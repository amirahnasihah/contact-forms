import { Separator } from "@/components/ui/separator";
import { MovingWords } from "./(components)/MovingWords";
import { HeroHighlightDemo } from "./(components)/HeroHighlightDemo";
import Link from "next/link";
import HeroSectionTextHover from "@/components/animata/hero-section-text-hover";
import AllFormsList from "./(components)/AllFormsList";
import { ExplanationList } from "./(components)/ExplanationList";
import TextBorderAnimation from "@/components/animata/text-border-animation";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 pt-10 container mx-auto">
      <div className="flex flex-col gap-10 w-full">
        <HeroSectionTextHover />
        <AllFormsList />
      </div>
      <div className="flex flex-col">
        <TextBorderAnimation text="Contain" />
        <ExplanationList />
      </div>

      {/* <div className="flex flex-col gap-2 justify-evenly px-10">
        <div>
          <p>
            - send form to email with upload  file as pdf + form zod validation
          </p>
          <Link href={"/form-zod"} className="underline hover:text-orange-500">
            to the form page
          </Link>
        </div>
        <div>
          <p>
            - send form to email with upload file as pdf + form zod validation +
            email data saved to google sheets api
          </p>
          <Link
            href={"/gsheet-form"}
            className="underline hover:text-orange-500"
          >
            to the gsheet-form page
          </Link>
        </div>
        <div>
          <p>- send form data saved to google sheets with gsheet api</p>
          <Link
            href={"/spreadsheet"}
            className="underline hover:text-orange-500"
          >
            to the spreadsheet page
          </Link>
        </div>
      </div> */}
    </div>
  );
}
