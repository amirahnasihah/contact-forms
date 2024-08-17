import React from "react";
import TextBorderAnimation from "@/components/animata/text-border-animation";
import GsheetForm from "./GsheetForm";

export default function GsheetFormPage() {
  return (
    <div className="flex flex-col gap-5">
      <TextBorderAnimation text="Form data saved in Google Sheets" />
      <GsheetForm />
    </div>
  );
}
