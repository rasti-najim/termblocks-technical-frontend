import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistGrid from "@/components/ChecklistGrid";

// This would come from your database
const mockChecklists = [
  {
    id: "1",
    name: "Project Launch Checklist",
    categoryCount: 4,
    itemCount: 12,
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    name: "Weekly Review",
    categoryCount: 3,
    itemCount: 8,
    lastModified: "1 day ago",
  },
  {
    id: "3",
    name: "New Employee Onboarding",
    categoryCount: 5,
    itemCount: 15,
    lastModified: "3 days ago",
  },
];

export default async function Home() {
  // In a real app, you would fetch this data from your database
  const checklists = mockChecklists;

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
        <ChecklistGrid checklists={checklists} />
      </main>
    </div>
  );
}
