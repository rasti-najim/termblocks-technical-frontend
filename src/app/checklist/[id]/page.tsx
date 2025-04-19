import { Suspense } from "react";
import { notFound } from "next/navigation";
import ChecklistForm from "@/components/ChecklistForm";
import { getChecklist } from "@/app/actions";

export default async function ChecklistPage({
  params,
}: {
  params: { id: string };
}) {
  // Redirect to new route handled by middleware or server action'

  console.log(params.id);

  const response = await getChecklist(params.id);

  if (!response.success || !response.data) {
    notFound();
  }

  const checklistData = response.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Checklist
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading checklist editor...</div>}>
            <ChecklistForm initialData={checklistData} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
