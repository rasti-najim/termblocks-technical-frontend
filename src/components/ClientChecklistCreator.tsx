"use client";

import dynamic from "next/dynamic";

const ChecklistCreator = dynamic(() => import("./ChecklistCreator"), {
  ssr: false,
});

export default function ClientChecklistCreator() {
  return <ChecklistCreator />;
}
