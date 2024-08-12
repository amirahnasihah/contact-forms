// zod
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";
import { replaceMergeTags, stripHTMLTags } from "../../../../email/helpers";
import { transporter, mailOptions } from "../../../../email/client";

const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

type EmailFormData = {
  text: string;
  images?: string[];
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  // console.log(data);

  // RECAPTCHA
  let recaptchaResponse;
  try {
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
    recaptchaResponse = recaptchaRes.data;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json({ error: "reCAPTCHA verification error" });
  }

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
  const attachment = data.document
    ? data.document.map((doc: any) => {
        const base64Content = doc.split(",")[1]; // Extract base64 content
        return {
          content: base64Content,
          filename: `file-${Date.now()}.pdf`,
          contentType: "application/pdf",
          disposition: "attachment",
        };
      })
    : [];

  // SEND MAIL
  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `Received Job Application - ${capitalized}`,
      replyTo: data.email,
      // cc: ["amirahnasihah97@gmail.com", "amirah@todak.com"],
      bcc: `'Copy of Application <${data.email}>'`,
      text: plainTextContent,
      html: htmlContent,
      attachments: attachment,
    });

    return NextResponse.json({ success: true, score: recaptchaResponse.score });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" });
  }
}
