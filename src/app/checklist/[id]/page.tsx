"use client";

import { useParams } from "next/navigation";
import ClientChecklistCreator from "@/components/ClientChecklistCreator";

export default function ChecklistPage() {
  const params = useParams();
  const isNew = params.id === "new";

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
          <ClientChecklistCreator />
        </div>
      </main>
    </div>
  );
}
