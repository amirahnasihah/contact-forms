import { Toaster } from "@/components/ui/toaster";

const title = "Basic";

export const metadata = {
  title,
};

export default function BasicFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto pt-10">
      <Toaster />
      {children}
    </div>
  );
}
