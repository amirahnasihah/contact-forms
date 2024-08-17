import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";
import { replaceMergeTags, stripHTMLTags } from "../../../../email/helpers";
import { transporter, mailOptions } from "../../../../email/client";

const secretKey = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const username = formData.get("name") as string;
    const email = formData.get("email") as string;
    const position = formData.get("position") as string;
    const message = (formData.get("message") as string) || "";
    const gRecaptchaToken = formData.get("gRecaptchaToken") as string;
    const document = formData.get("document") as File;

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
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return NextResponse.json(
        { error: "reCAPTCHA verification error" },
        { status: 500 }
      );
    }

    if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
      console.error("reCAPTCHA verification failed");
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
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

    const emailData = {
      username,
      email,
      position,
      message,
    };

    const capitalizedName = username
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
      subject: `Copy of Your Form`,
      text: plainTextContent,
      html: htmlContent,
      attachments: attachments,
    };

    // SEND MAIL
    try {
      // Send main email
      await transporter.sendMail(mainMailOptions);
      // Send BCC email (copy to candidate)
      await transporter.sendMail(bccMailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Error sending email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Success, email sent",
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
