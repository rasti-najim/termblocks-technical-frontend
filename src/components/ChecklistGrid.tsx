"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistCard from "./ChecklistCard";

interface Checklist {
  id: string;
  name: string;
  categoryCount: number;
  itemCount: number;
  lastModified: string;
}

interface ChecklistGridProps {
  checklists: Checklist[];
}

export default function ChecklistGrid({ checklists }: ChecklistGridProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/checklist/${id}`);
  };

  const handleShare = (id: string) => {
    // This would open share dialog
    console.log("Share checklist:", id);
  };

  if (!checklists?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No checklists yet
        </h3>
        <p className="text-gray-500 mb-6">
          Create your first checklist to get started
        </p>
        <Link
          href="/checklist/new"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Checklist
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {checklists.map((checklist) => (
        <ChecklistCard
          key={checklist.id}
          {...checklist}
          onEdit={handleEdit}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}
