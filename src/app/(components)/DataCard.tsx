import Link from "next/link";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaCircleInfo } from "react-icons/fa6";
import { Position } from "@/lib/types";

type PositionProps = {
  position: Position;
};

export default function DataCard({ position }: PositionProps) {
  const { name, company, id } = position;
  return (
    <Link href={`/join-us/position/${position.id}`}>
      <Card className="shadow-inner shadow-input bg-border h-full w-full">
        <CardHeader>
          <FaCircleInfo />
          <CardTitle className="text-sm lg:text-lg">{name}</CardTitle>
          <CardDescription className="text-xs lg:text-sm font-medium">
            {company.bs}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
