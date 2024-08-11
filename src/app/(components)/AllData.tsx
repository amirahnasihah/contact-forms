import React from "react";
import DataCard from "./DataCard";
import { BentoGrid } from "@/components/ui/bento-grid";

const getAllPositions = async (url: string) => {
  const res = await fetch(url, {
    cache: "no-store",
    next: {
      tags: ["positions"],
    },
  });

  // console.log("response positions api:", res);

  if (!res.ok) {
    console.error("Failed to fetch positions data:", res.statusText);
    throw new Error("Failed to fetch positions data");
  }

  return res.json();
};

export default async function Positions() {
  const positions = await getAllPositions(
    "https://jsonplaceholder.typicode.com/users"
  );

  return (
    <div className="flex flex-col gap-10 lg:px-24">
      <p className="text-xs md:text-base lg:text-xl font-semibold text-center">
        Open positions
      </p>
      <p className="text-xl md:text-3xl lg:text-5xl font-bold text-center">
        Calling all innovators, dreamers, and visionaries to join our team.
      </p>
      <BentoGrid className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full w-full">
        {positions.map((position: any) => (
          <DataCard key={position.id} position={position} />
        ))}
      </BentoGrid>
    </div>
  );
}
