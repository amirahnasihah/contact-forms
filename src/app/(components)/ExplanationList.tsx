"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import {
  SiGooglesheets,
  SiReacthookform,
  SiGoogleanalytics,
  SiZod,
  SiNodedotjs,
  SiTailwindcss,
  SiShadcnui,
  SiFramer,
} from "react-icons/si";

interface Item {
  name: string;
  description: string;
  icon: any;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Google Recaptcha v3",
    description: "Protects site",
    time: "5m ago",
    icon: <SiGoogleanalytics />,
    color: "#FFB800",
  },
  {
    name: "Nodemailer",
    description: "Email sending",
    time: "15m ago",
    icon: <SiNodedotjs />,
    color: "#00C9A7",
  },
  {
    name: "React Hook Form",
    description: "Reduces code",
    time: "15m ago",
    icon: <SiReacthookform />,
    color: "#EC5990",
  },
  {
    name: "Google Sheets",
    description: "As mail database",
    time: "2m ago",
    icon: <SiGooglesheets />,
    color: "#209F61",
  },
  {
    name: "Zod Validation",
    description: "Validate any data types",
    time: "2m ago",
    icon: <SiZod />,
    color: "#2F68B6",
  },
  {
    name: "Tailwind CSS",
    description: "Clean consistent UI",
    time: "10m ago",
    icon: <SiTailwindcss />,
    color: "#37BCF8",
  },
  {
    name: "Shadcn/UI",
    description: "Styling component",
    time: "10m ago",
    icon: <SiShadcnui />,
    color: "#18181B",
  },
  {
    name: "Framer Motion",
    description: "Animation framework",
    time: "10m ago",
    icon: <SiFramer />,
    color: "#FF3D71",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-secondary">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-primary-foreground">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function ExplanationList({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-2xl border-none bg-transparent",
        className
      )}
      style={{
        maskImage: `linear-gradient(to top, transparent, black 50%)`,
      }}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
