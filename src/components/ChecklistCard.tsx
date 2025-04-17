"use client";

import { ShareIcon, PencilIcon } from "@heroicons/react/24/outline";

interface ChecklistCardProps {
  id: string;
  name: string;
  categoryCount: number;
  itemCount: number;
  lastModified: string;
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
}

export default function ChecklistCard({
  id,
  name,
  categoryCount,
  itemCount,
  lastModified,
  onEdit,
  onShare,
}: ChecklistCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {name || "Untitled Checklist"}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onShare(id)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(id)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <span>{categoryCount} categories</span>
          <span>•</span>
          <span>{itemCount} items</span>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Last modified {lastModified}
        </div>
      </div>
    </div>
  );
}
