// Send email to different email addresses

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";
import { replaceMergeTags, stripHTMLTags } from "../../../../email/helpers";
import { transporter, mailOptions } from "../../../../email/client";

const secretKey = process.env.RECAPTCHA_SECRET_KEY;

interface OptionsEmailMapping {
  [key: string]: string;
}

// Different select options for different email
const optionsEmailMapping: OptionsEmailMapping = {
  "Yellowish view": "yellow@email.com",
  "Monday blues": "blue@email.com",
  "Orangies juice": "orange@email.com",
  "Green hug": "green@email.com",
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // RECAPTCHA
    const formData = `secret=${secretKey}&response=${data.gRecaptchaToken}`;
    const recaptchaRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const recaptchaResponse = recaptchaRes.data;

    if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
      console.error("reCAPTCHA verification failed");
      return NextResponse.json({ error: "reCAPTCHA verification failed" });
    }

    const capitalized = data.position
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // HTML
    const htmlFilePath = path.join(process.cwd(), "email", "contact-form.html");
    let htmlContent;

    try {
      htmlContent = fs.readFileSync(htmlFilePath, "utf8");
    } catch (err) {
      console.error("Error reading HTML file: ", err);
      return NextResponse.json({ error: "Error reading HTML file" });
    }

    htmlContent = replaceMergeTags(data, htmlContent);
    const plainTextContent = stripHTMLTags(htmlContent);

    // ATTACHMENT
    const attachments = data.document
      ? data.document.map((doc: any, index: number) => {
          const base64Content = doc.split(",")[1]; // Extract base64 content
          return {
            content: base64Content,
            filename: `file-${Date.now()}-${index}.pdf`,
            contentType: "application/pdf",
            encoding: "base64",
          };
        })
      : [];

    // Different email recipients
    const recipientEmail =
      optionsEmailMapping[data.option] || "default@email.com";

    // Recipients
    const mainMailOptions = {
      ...mailOptions,
      to: recipientEmail,
      subject: `New Form - ${capitalized}`,
      replyTo: data.email,
      text: plainTextContent,
      html: htmlContent,
      attachments,
    };

    // Sender
    const bccMailOptions = {
      from: `NO-REPLY 🚫 ${process.env.SMTP_EMAIL}`,
      to: data.email,
      subject: `Copy of Your ${capitalized} Form`,
      text: plainTextContent,
      html: htmlContent,
      attachments,
    };

    // SEND MAIL
    await transporter.sendMail(mainMailOptions);
    await transporter.sendMail(bccMailOptions);

    return NextResponse.json({ success: true, score: recaptchaResponse.score });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Error processing request" });
  }
}
