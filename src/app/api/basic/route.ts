import { appendToSheet } from "@/lib/sheets";
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

    const username = formData.get("username") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const favourite = formData.get("favourite") as string;
    const description = (formData.get("description") as string) || "";
    const gRecaptchaToken = formData.get("gRecaptchaToken") as string;

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
    const htmlFilePath = path.join(
      process.cwd(),
      "email",
      "basic-mail-template",
      "mail.html"
    );
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
      description,
      phoneNumber,
      favourite,
    };

    const capitalizedName = username
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    htmlContent = replaceMergeTags(emailData, htmlContent);
    const plainTextContent = stripHTMLTags(htmlContent);

    // to receipient
    const mainMailOptions = {
      ...mailOptions,
      to: "amrhnshh@gmail.com",
      cc: ["meongseha@gmail.com", "therongaks@gmail.com"],
      subject: `👋 Hello`,
      replyTo: email,
      text: plainTextContent,
      html: htmlContent,
    };

    // copy to sender
    const bccMailOptions = {
      from: `NO-REPLY 🚫 ${process.env.SMTP_EMAIL}`,
      to: email,
      subject: `Copy of Email - ${capitalizedName}`,
      text: plainTextContent,
      html: htmlContent,
    };

    // SEND MAIL
    try {
      // Send Main email
      await transporter.sendMail(mainMailOptions);
      // Send BCC (copy to candidate)
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
