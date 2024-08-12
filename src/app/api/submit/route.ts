// WITH FILE ATTACHMENT
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";
import { replaceMergeTags, stripHTMLTags } from "../../../../email/helpers";
import { transporter, mailOptions } from "../../../../email/client";

const secretKey = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("submit data:- ", data);

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

  const capitalizedPosition = data.position
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

  // SEND MAIL
  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `Received Job Application - ${capitalizedPosition}`,
      replyTo: data.email,
      // cc: ["amirahnasihah97@gmail.com", "amirah@todak.com"],
      bcc: `'Copy of Application <${data.email}>'`,
      text: plainTextContent,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, score: recaptchaResponse.score });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" });
  }
}
