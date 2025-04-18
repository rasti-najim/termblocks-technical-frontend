import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistGridServer from "@/components/ChecklistGridServer";
import { getAllChecklists } from "./actions";

export default async function Home() {
  // Fetch checklists using the server action
  const checklists = await getAllChecklists();

  // Map data to the format expected by ChecklistGrid
  const formattedChecklists = checklists.map((checklist) => ({
    id: checklist.id,
    name: checklist.name,
    categoryCount: checklist.categories.length,
    itemCount: checklist.categories.reduce(
      (total, category) => total + category.items.length,
      0
    ),
    lastModified: new Date(checklist.lastModified).toLocaleDateString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              My Checklists
            </h1>
            <Link
              href="/checklist/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Checklist
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChecklistGridServer checklists={formattedChecklists} />
      </main>
    </div>
  );
}
