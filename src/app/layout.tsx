import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import GoogleCaptchaWrapper from "@/lib/google-captcha-wrapper";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s ~ Forms",
    default: "Contact Forms ~ amrhnshh",
  },
  description:
    "Easily Build Form Components - send form easily as developer and validate types",
  openGraph: {
    title: "Forms ~ amrhnshh",
    description:
      "Easily Build Form Components - send form easily as developer and validate types",
    images: [
      {
        url: `/icon.png`,
        secureUrl: `/icon.png`,
        width: 200,
        height: 200,
        alt: `Forms ~ amrhnshh`,
      },
    ],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
    other: {
      rel: "icon",
      url: "/icon.png",
    },
  },
  twitter: {
    title: "Forms ~ amrhnshh",
    description:
      "Easily Build Form Components - send form easily as developer and validate types",
    images: {
      url: `/icon.png`,
      alt: `Forms ~ amrhnshh`,
    },
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
          <Toaster />
        </GoogleCaptchaWrapper>
      </body>
    </html>
  );
}
