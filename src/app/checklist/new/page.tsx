import { Suspense } from "react";
import ChecklistForm from "@/components/ChecklistForm";

export default function NewChecklistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Checklist
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading checklist editor...</div>}>
            <ChecklistForm initialData={null} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
