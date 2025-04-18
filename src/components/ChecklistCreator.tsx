"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChecklistFormData } from "../schemas/checklist";

interface ChecklistCreatorProps {
  onSubmit: (data: ChecklistFormData) => void;
}

export default function ChecklistCreator({ onSubmit }: ChecklistCreatorProps) {
  const [formData, setFormData] = useState<ChecklistFormData>({
    name: "",
    categories: [
      {
        id: uuidv4(),
        name: "",
        items: [],
      },
    ],
  });

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: uuidv4(),
          name: "",
          items: [],
        },
      ],
    }));
  };

  const addItem = (categoryIndex: number) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items.push({
        id: uuidv4(),
        name: "",
        is_file_upload_field: false,
        allow_multiple_files: false,
        files: [],
        uploadedFiles: [],
      });
      return { ...prev, categories: newCategories };
    });
  };

  const updateCategoryName = (categoryIndex: number, name: string) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].name = name;
      return { ...prev, categories: newCategories };
    });
  };

  const updateItemName = (
    categoryIndex: number,
    itemIndex: number,
    name: string
  ) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items[itemIndex].name = name;
      return { ...prev, categories: newCategories };
    });
  };

  const updateItemFileUpload = (
    categoryIndex: number,
    itemIndex: number,
    isFileUpload: boolean
  ) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items[itemIndex].is_file_upload_field =
        isFileUpload;
      return { ...prev, categories: newCategories };
    });
  };

  const updateItemMultipleFiles = (
    categoryIndex: number,
    itemIndex: number,
    allowMultiple: boolean
  ) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items[itemIndex].allow_multiple_files =
        allowMultiple;
      return { ...prev, categories: newCategories };
    });
  };

  const removeCategory = (categoryIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, index) => index !== categoryIndex),
    }));
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items = newCategories[
        categoryIndex
      ].items.filter((_, index) => index !== itemIndex);
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="checklistName"
          className="block text-sm font-medium text-gray-700"
        >
          Checklist Name
        </label>
        <input
          type="text"
          id="checklistName"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {formData.categories.map((category, categoryIndex) => (
        <div key={category.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={category.name}
              onChange={(e) =>
                updateCategoryName(categoryIndex, e.target.value)
              }
              placeholder="Category Name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => removeCategory(categoryIndex)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          {category.items.map((item, itemIndex) => (
            <div key={item.id} className="ml-4 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    updateItemName(categoryIndex, itemIndex, e.target.value)
                  }
                  placeholder="Item Name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(categoryIndex, itemIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={item.is_file_upload_field}
                    onChange={(e) =>
                      updateItemFileUpload(
                        categoryIndex,
                        itemIndex,
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    File Upload Field
                  </span>
                </label>
                {item.is_file_upload_field && (
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={item.allow_multiple_files}
                      onChange={(e) =>
                        updateItemMultipleFiles(
                          categoryIndex,
                          itemIndex,
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Allow Multiple Files
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addItem(categoryIndex)}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Item
          </button>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Category
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save Checklist
        </button>
      </div>
    </form>
  );
}
