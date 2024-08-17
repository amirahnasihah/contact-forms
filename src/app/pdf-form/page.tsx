import TextBorderAnimation from "@/components/animata/text-border-animation";
import PdfForm from "./(components)/PdfForm";

export default function FormPage() {
  return (
    <div className="flex flex-col gap-5">
      <TextBorderAnimation text="Send with PDF File" />
      <PdfForm />
    </div>
  );
}
