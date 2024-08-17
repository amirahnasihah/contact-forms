import { appendToSheet } from "@/lib/sheets";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";
import { replaceMergeTags, stripHTMLTags } from "../../../../email/helpers";
import { transporter, mailOptions } from "../../../../email/client";

const secretKey = process.env.RECAPTCHA_SECRET_KEY;

let id = 1;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const position = formData.get("position") as string;
    const message = (formData.get("message") as string) || "";
    const gRecaptchaToken = formData.get("gRecaptchaToken") as string;
    const document = formData.get("document") as File;

    // Log received form data
    console.log("Form Data: ", {
      name,
      email,
      position,
      message,
      gRecaptchaToken,
      document,
    });

    // RECAPTCHA verification
    let recaptchaResponse;
    try {
      const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;
      const recaptchaRes = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      recaptchaResponse = recaptchaRes.data;
      console.log("reCAPTCHA Response: ", recaptchaResponse);
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return NextResponse.json(
        { error: "reCAPTCHA verification error" },
        { status: 500 }
      );
    }

    if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
      console.error(
        "reCAPTCHA verification failed with score:",
        recaptchaResponse.score
      );
      return NextResponse.json(
        {
          error: "reCAPTCHA verification failed",
          score: recaptchaResponse.score,
        },
        { status: 400 }
      );
    }

    // Read HTML file for email content
    const htmlFilePath = path.join(process.cwd(), "email", "thankyou.html");
    let htmlContent;

    try {
      htmlContent = fs.readFileSync(htmlFilePath, "utf8");
    } catch (err) {
      console.error("Error reading HTML file: ", err);
      return NextResponse.json(
        { error: "Error reading HTML file" },
        { status: 500 }
      );
    }

    const emailData = { name, email, position, message };
    const capitalizedName = name
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    htmlContent = replaceMergeTags(emailData, htmlContent);
    const plainTextContent = stripHTMLTags(htmlContent);

    // Process attachments
    const attachments = document
      ? [
          {
            content: await document
              .arrayBuffer()
              .then((buf) => Buffer.from(buf).toString("base64")),
            filename: document.name,
            contentType: document.type,
            encoding: "base64",
          },
        ]
      : [];

    const mainMailOptions = {
      ...mailOptions,
      to: process.env.SMTP_EMAIL,
      subject: `New Form - ${capitalizedName}`,
      replyTo: email,
      text: plainTextContent,
      html: htmlContent,
      attachments: attachments,
    };

    const bccMailOptions = {
      from: `NO-REPLY 🚫 ${process.env.SMTP_EMAIL}`,
      to: email,
      subject: `Copy of Your ${position} Form`,
      text: plainTextContent,
      html: htmlContent,
      attachments: attachments,
    };

    // SEND MAIL
    try {
      console.log("Sending email with options: ", mainMailOptions);
      await transporter.sendMail(mainMailOptions);
      await transporter.sendMail(bccMailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Error sending email" },
        { status: 500 }
      );
    }

    // Save data to Google Sheets
    try {
      await appendToSheet({
        name,
        email,
        position,
        message,
        timestamp: new Date().toLocaleString(),
        id: id++,
      });
    } catch (error) {
      console.error("Error saving data to Google Sheets:", error);
      return NextResponse.json(
        { error: "Error saving data to Google Sheets" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Success save data and send email",
        score: recaptchaResponse.score,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
