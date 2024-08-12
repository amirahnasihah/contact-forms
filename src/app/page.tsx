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
    <div className="flex flex-col lg:flex-row items-center gap-20 pt-10 container mx-auto">
      <div className="flex flex-col gap-10 w-full">
        <HeroSectionTextHover />
        <AllFormsList />
      </div>
      <div className="flex flex-col">
        <TextBorderAnimation text="Packages Installed" />
        <ExplanationList />
      </div>
    </div>
  );
}
