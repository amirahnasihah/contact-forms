"use client";
import { ReactNode } from "react";
import {
  HTMLMotionProps,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import Balancer from "react-wrap-balancer";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface FeatureCardProps extends HTMLMotionProps<"div"> {
  feature: {
    title: ReactNode;
    category: string;
    imageUrl: string;
    pageUrl?: string;
  };
  zIndexOffset?: number;
}

function FeatureCard({
  feature,
  className,
  zIndexOffset = 0,
  ...props
}: FeatureCardProps) {
  const { title, category, imageUrl, pageUrl } = feature;
  const springValue = useSpring(0, {
    bounce: 0,
  });
  const zIndex = useTransform(
    springValue,
    (value) => +Math.floor(value * 10) + 10 + zIndexOffset
  );
  const scale = useTransform(springValue, [0, 1], [1, 1.1]);

  const content = (
    <>
      <img
        src={imageUrl}
        alt="hi"
        className="-z-1 absolute inset-0 h-full w-full object-cover"
      />
      <div className="z-10 flex h-full w-full flex-col gap-2 bg-gradient-to-t from-zinc-800/40 from-15% to-transparent p-3">
        <small className="inline w-fit rounded-xl bg-orange-950 bg-opacity-50 px-2 py-1 text-xs font-medium leading-none text-white">
          {category}
        </small>

        <div className="flex-1" />
        <Link
          href={pageUrl !== undefined ? pageUrl : "/"}
          className="hover:underline decoration-wavy"
        >
          <h3 className="rounded-xl bg-blue-950 bg-opacity-30 p-3 text-base font-bold leading-none text-white backdrop-blur-sm">
            {title}
          </h3>
        </Link>
      </div>
    </>
  );

  const containerClassName = cn(
    "relative flex h-64 w-48 flex-col overflow-hidden rounded-2xl shadow-none transition-shadow duration-300 ease-in-out hover:shadow-xl",
    className
  );

  return (
    <>
      <motion.div
        onMouseEnter={() => springValue.set(1)}
        onMouseLeave={() => springValue.set(0)}
        style={{
          zIndex,
          scale,
        }}
        className={cn(containerClassName, "hidden sm:flex")}
        {...props}
      >
        {content}
      </motion.div>
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0, transition: { duration: 0.5 } }}
        className={cn(containerClassName, "flex sm:hidden")}
      >
        {content}
      </motion.div>
    </>
  );
}

export default function AllFormsList() {
  const cardWidth = 48 * 4; // w-48 x 4
  const angle = 6;
  const yOffset = 30;

  return (
    <section className="storybook-fix rounded-2xl border border-gray-200 flex w-full flex-col items-center gap-4 bg-orange-50 py-10">
      <motion.header
        initial={{
          y: 100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        }}
        className="flex max-w-md flex-col items-center gap-2 text-center"
      >
        <h1 className="text-2xl lg:text-3xl font-black text-orange-600 px-1 lg:px-0">
          Easily Build Form Components
        </h1>
        <Balancer className="block lg:text-lg text-neutral-500">
          Nextjs, Tailwind CSS, ZOD Validation, Google integration, Attached PDF
          file, Copy to sender email etc.
        </Balancer>
      </motion.header>

      {/* <motion.div
        initial={{
          y: 100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        }}
      >
        <button
          className="box-border inline-block h-11 transform-gpu cursor-pointer touch-manipulation whitespace-nowrap rounded-full border-b-4 border-solid border-transparent bg-orange-600 px-4 py-3 text-center text-sm font-bold uppercase leading-5 tracking-wider text-white shadow-2xl outline-none transition-all duration-200 hover:brightness-110 active:border-b-0 active:border-t-4 active:bg-none disabled:cursor-auto"
          role="button"
        >
          Ready to slay &rarr;
          <span className="absolute inset-0 -z-10 rounded-full border-b-4 border-solid border-transparent bg-orange-500" />
        </button>
      </motion.div> */}

      <div className="relative flex w-full flex-wrap lg:flex-nowrap justify-center gap-8 px-4 py-12 sm:flex-row sm:gap-0">
        <FeatureCard
          feature={{
            category: "Fun Mode",
            imageUrl:
              "https://angelhodar.com/_vercel/image?url=%2F_astro%2Fnextjs-zod.DbDVX74h.jpg&w=640&q=100",
            title: "Simple basic form format",
            pageUrl: "/basic-form",
          }}
          initial={{
            x: cardWidth,
            y: yOffset,
            opacity: 0,
            rotate: 0,
            scale: 0.9,
          }}
          animate={{
            x: yOffset,
            y: 10,
            opacity: 1,
            scale: 0.95,
            rotate: -angle,
            transition: {
              type: "spring",
              delay: 0.8,
            },
          }}
        />

        <FeatureCard
          feature={{
            category: "Tricky Trails",
            title: "Send PDF file + Zod validation",
            imageUrl:
              "https://hips.hearstapps.com/hmg-prod/images/envelope-in-pdf-file-email-pdf-document-flat-royalty-free-illustration-1581700117.jpg",
            pageUrl: "/form-zod",
          }}
          initial={{
            y: yOffset,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              delay: 0.4,
            },
          }}
          zIndexOffset={1}
        />

        <FeatureCard
          feature={{
            category: "Crazy Mode",
            title: "Send PDF file + Validation + Saved to Google Sheets",
            imageUrl: "https://i.ytimg.com/vi/yYtL8HyC7FE/maxresdefault.jpg",
            pageUrl: "/gsheet-form",
          }}
          initial={{
            x: -cardWidth,
            y: yOffset,
            opacity: 0,
            rotate: 0,
            scale: 0.9,
          }}
          animate={{
            x: -yOffset,
            y: 10,
            opacity: 1,
            rotate: angle,
            scale: 0.95,
            transition: {
              type: "spring",
              delay: 0.6,
            },
          }}
        />
      </div>
    </section>
  );
}
