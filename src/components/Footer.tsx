import Link from "next/link";
import React from "react";
import { BsRocketTakeoff } from "react-icons/bs";

const GitHubIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z"
      />
    </svg>
  );
};

const XIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M11.1527 8.92804L16.2525 3H15.044L10.6159 8.14724L7.07919 3H3L8.34821 10.7835L3 17H4.20855L8.88474 11.5643L12.6198 17H16.699L11.1524 8.92804H11.1527ZM9.49748 10.8521L8.95559 10.077L4.644 3.90978H6.50026L9.97976 8.88696L10.5216 9.66202L15.0446 16.1316H13.1883L9.49748 10.8524V10.8521Z" />
    </svg>
  );
};

const LinkedInIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg aria-hidden="true" viewBox="0 0 30 30" {...props}>
      <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
    </svg>
  );
};

const MyWebsite = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return <BsRocketTakeoff />;
};

const SocialLink = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group">
      <span className="sr-only">{children}</span>
      <Icon className="h-5 w-5 fill-foreground transition group-hover:fill-secondary-foreground dark:group-hover:fill-gray-200" />
    </a>
  );
};

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-gray-900/5 py-5 sm:flex-row dark:border-white/5 container mx-auto">
      <p className="text-xs text-foreground dark:text-foreground">
        {new Date().getFullYear()} | <span>Building in public by</span>{" "}
        <a
          href="https://github.com/amirahnasihah/contact-forms"
          className="text-ring underline decoration-wavy hover:text-muted-foreground"
          target="_blank"
        >
          Amirah Nasihah
        </a>{" "}
      </p>

      <div>
        <Link
          href={"/"}
          className="text-foreground hover:text-secondary-foreground hover:underline decoration-wavy"
        >
          home
        </Link>
      </div>

      <div className="flex gap-4">
        <SocialLink href="https://amirahnasihah.vercel.app/" icon={MyWebsite}>
          My Portfolio
        </SocialLink>
        <SocialLink href="https://twitter.com/amrhnshh" icon={XIcon}>
          Follow me on X
        </SocialLink>
        <SocialLink href="http://github.com/amirahnasihah" icon={GitHubIcon}>
          Follow me on GitHub
        </SocialLink>
        <SocialLink
          href="https://www.linkedin.com/in/amirahnasihah/"
          icon={LinkedInIcon}
        >
          Connect on LinkedIn
        </SocialLink>
      </div>
    </div>
  );
};

export default Footer;
