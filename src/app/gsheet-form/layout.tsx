import { Metadata } from "next";

const title = "Crazy Mode";

export const metadata: Metadata = {
  title,
  description:
    "Easily Build Form Components - send form easily as developer and validate types",
  openGraph: {
    title: "Forms ~ amrhnshh",
    description:
      "Easily Build Form Components - send form easily as developer and validate types",
    images: [
      {
        url: `/app/app/icon.png`,
        secureUrl: `/app/icon.png`,
        width: 200,
        height: 200,
        alt: `Forms ~ amrhnshh`,
      },
    ],
  },
  icons: {
    icon: "/app/icon.png",
    shortcut: "/app/icon.png",
    apple: "/app/icon.png",
    other: {
      rel: "icon",
      url: "/app/icon.png",
    },
  },
  twitter: {
    title: "Forms ~ amrhnshh",
    description:
      "Easily Build Form Components - send form easily as developer and validate types",
    images: {
      url: `/app/icon.png`,
      alt: `Forms ~ amrhnshh`,
    },
  },
};

export default function BasicFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mx-auto pt-10">{children}</div>;
}
