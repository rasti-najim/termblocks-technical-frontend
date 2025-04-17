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
    <div className="relative transform-gpu">
      {/* Card container with hover effects */}
      <div
        className="group/card bg-white rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer 
                   hover:border-gray-300 hover:shadow-md hover:translate-y-[-2px]
                   active:translate-y-0 active:shadow-sm active:bg-gray-50"
        onClick={(e) => {
          // Only trigger edit if not clicking on the action buttons
          if (!(e.target as HTMLElement).closest(".action-button")) {
            onEdit(id);
          }
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover/card:text-blue-600 transition-colors duration-200">
              {name || "Untitled Checklist"}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(id);
                }}
                className="action-button text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                className="action-button text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
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
    </div>
  );
}
