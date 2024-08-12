import React from "react";
import { BasicForm } from "./(components)/BasicForm";
import TextBorderAnimation from "@/components/animata/text-border-animation";

export default function BasicFormPage() {
  return (
    <div className="flex flex-col gap-5">
      <TextBorderAnimation text="Basic Form" />
      <BasicForm />
    </div>
  );
}
