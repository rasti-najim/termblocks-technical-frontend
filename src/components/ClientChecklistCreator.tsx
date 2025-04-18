"use client";

import dynamic from "next/dynamic";
import { Category } from "./ChecklistCreator";

interface ClientChecklistCreatorProps {
  initialData?: {
    name: string;
    categories: Category[];
  };
}

const ChecklistCreator = dynamic(() => import("./ChecklistCreator"), {
  ssr: false,
});

export default function ClientChecklistCreator({
  initialData,
}: ClientChecklistCreatorProps) {
  return <ChecklistCreator initialData={initialData} />;
}
