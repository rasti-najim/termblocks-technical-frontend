"use client";

import { useParams } from "next/navigation";
import ClientChecklistCreator from "@/components/ClientChecklistCreator";

// Mock data - in a real app, this would come from your API/database
const mockChecklistData = {
  "1": {
    name: "Project Launch Checklist",
    categories: [
      {
        id: "cat1",
        name: "Documentation",
        items: [
          {
            id: "item1",
            name: "Project Requirements",
            uploadedFiles: ["requirements.pdf"],
          },
          {
            id: "item2",
            name: "Technical Specifications",
            uploadedFiles: ["specs.doc"],
          },
        ],
      },
      {
        id: "cat2",
        name: "Design Assets",
        items: [
          {
            id: "item3",
            name: "Logo Files",
            uploadedFiles: ["logo.png", "logo.svg"],
          },
        ],
      },
    ],
  },
  "2": {
    name: "Weekly Review",
    categories: [
      {
        id: "cat3",
        name: "Reports",
        items: [
          {
            id: "item4",
            name: "Weekly Progress",
            uploadedFiles: ["progress.pdf"],
          },
        ],
      },
    ],
  },
};

export default function ChecklistPage() {
  const params = useParams();
  const isNew = params.id === "new";
  const checklistData = !isNew
    ? mockChecklistData[params.id as keyof typeof mockChecklistData]
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isNew ? "Create New Checklist" : "Edit Checklist"}
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <ClientChecklistCreator initialData={checklistData} />
        </div>
      </main>
    </div>
  );
}
