import React from "react";
import GsheetForm from "./GsheetForm";
import TextBorderAnimation from "@/components/animata/text-border-animation";

export default function GsheetFormPage() {
  return (
    <div className="flex flex-col gap-5">
      <TextBorderAnimation text="Form data saved in Google Sheets" />
      <GsheetForm />
    </div>
  );
}
