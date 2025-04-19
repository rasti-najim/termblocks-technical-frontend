import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSharedChecklist } from "@/app/actions";
import SharedChecklistView from "@/components/SharedChecklistView";

export default async function SharedChecklistPage({
  params,
}: {
  params: { token: string };
}) {
  console.log(`Rendering shared checklist with token: ${params.token}`);

  const response = await getSharedChecklist(params.token);

  if (!response.success || !response.data) {
    notFound();
  }

  const checklistData = response.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {checklistData.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Shared Checklist (View Only)
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<div>Loading shared checklist...</div>}>
            <SharedChecklistView checklist={checklistData} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
