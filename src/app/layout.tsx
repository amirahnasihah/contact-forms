import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import GoogleCaptchaWrapper from "@/lib/google-captcha-wrapper";
import Footer from "@/components/Footer";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Contact Forms",
    default: "Contact Forms",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen ${font.className}`}>
        <GoogleCaptchaWrapper>
          <main className="flex-grow">{children}</main>
          <Footer />
        </GoogleCaptchaWrapper>
      </body>
    </html>
  );
}
