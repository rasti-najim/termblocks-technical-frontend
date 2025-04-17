"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import FileUploadField from "./FileUploadField";

interface Category {
  id: string;
  name: string;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  name: string;
  files?: File[];
  uploadedFiles?: string[];
}

export default function ChecklistCreator() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [checklistName, setChecklistName] = useState("");

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "New Category",
        items: [],
      },
    ]);
  };

  const addItem = (categoryId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: [
              ...category.items,
              {
                id: Math.random().toString(36).substr(2, 9),
                name: "New Item",
              },
            ],
          };
        }
        return category;
      })
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          };
        }
        return category;
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-12">
        <input
          type="text"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          placeholder="Untitled Checklist"
          className="text-3xl font-medium w-full border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400"
        />
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <input
                type="text"
                value={category.name}
                onChange={(e) => {
                  setCategories(
                    categories.map((c) =>
                      c.id === category.id ? { ...c, name: e.target.value } : c
                    )
                  );
                }}
                className="text-lg font-medium focus:outline-none focus:ring-0 text-gray-700 w-full"
                placeholder="Category name"
              />
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {category.items.map((item) => (
                <div key={item.id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        setCategories(
                          categories.map((c) => {
                            if (c.id === category.id) {
                              return {
                                ...c,
                                items: c.items.map((i) =>
                                  i.id === item.id
                                    ? { ...i, name: e.target.value }
                                    : i
                                ),
                              };
                            }
                            return c;
                          })
                        );
                      }}
                      className="text-gray-600 focus:outline-none focus:ring-0 bg-transparent w-full"
                      placeholder="Item name"
                    />
                    <button
                      onClick={() => deleteItem(category.id, item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <FileUploadField
                    onFilesSelected={(files) => {
                      setCategories(
                        categories.map((c) => {
                          if (c.id === category.id) {
                            return {
                              ...c,
                              items: c.items.map((i) =>
                                i.id === item.id ? { ...i, files } : i
                              ),
                            };
                          }
                          return c;
                        })
                      );
                    }}
                    existingFiles={item.uploadedFiles}
                  />
                </div>
              ))}

              <div className="p-4">
                <button
                  onClick={() => addItem(category.id)}
                  className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add item</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={addCategory}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add category</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-6 flex space-x-3">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg">
          Save
        </button>
        <button className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg border border-gray-200">
          Share
        </button>
      </div>
    </div>
  );
}
