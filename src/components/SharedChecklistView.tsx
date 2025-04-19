"use client";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface ChecklistItem {
  id?: string;
  name: string;
  is_file_upload_field: boolean;
  allow_multiple_files?: boolean;
  files?: File[];
  uploadedFiles?: string[];
}

interface Category {
  id?: string;
  name: string;
  items: ChecklistItem[];
}

interface SharedChecklistProps {
  checklist: {
    id: string;
    name: string;
    categories: Category[];
    shareToken?: string;
  };
}

export default function SharedChecklistView({
  checklist,
}: SharedChecklistProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-medium text-gray-900">
            {checklist.name}
          </h2>
        </div>

        <div className="px-6 py-4">
          {checklist.categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">
                This checklist doesn&apos;t have any categories.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {checklist.categories.map((category, categoryIndex) => (
                <div
                  key={category.id || categoryIndex}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">
                      {category.name}
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {category.items.length === 0 ? (
                      <div className="py-4 px-4 text-gray-500 text-sm">
                        No items in this category
                      </div>
                    ) : (
                      category.items.map((item, itemIndex) => (
                        <div
                          key={item.id || `${categoryIndex}-${itemIndex}`}
                          className="p-4"
                        >
                          <div className="flex items-center">
                            <div className="text-gray-800 font-medium">
                              {item.name}
                            </div>
                            {item.is_file_upload_field && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                                File Upload
                              </span>
                            )}
                          </div>

                          {item.is_file_upload_field && (
                            <div className="mt-2">
                              {item.uploadedFiles &&
                              item.uploadedFiles.length > 0 ? (
                                <div className="mt-2 space-y-1">
                                  {item.uploadedFiles.map((file, fileIndex) => (
                                    <div
                                      key={fileIndex}
                                      className="flex items-center text-sm text-gray-600"
                                    >
                                      <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                                      <span>{file}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No files uploaded
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
