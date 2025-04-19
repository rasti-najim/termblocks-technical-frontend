"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  ExclamationCircleIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useRouter, usePathname } from "next/navigation";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploadField from "./FileUploadField";
import {
  saveChecklist,
  deleteCategory,
  deleteItem,
  duplicateChecklist,
} from "@/app/actions";
import {
  checklistSchema,
  type ChecklistFormData,
  type Category,
} from "@/schemas/checklist";

interface ChecklistFormProps {
  initialData?: {
    id: string;
    name: string;
    categories: Category[];
  } | null;
}

export default function ChecklistForm({ initialData }: ChecklistFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isNewChecklist = pathname === "/checklist/new";
  const [isSaving, setIsSaving] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Initialize form with React Hook Form and Zod validation
  const methods = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || "",
      categories: initialData?.categories || [],
    },
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  // Field array for managing categories
  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategoryField,
    update: updateCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  // Watch the form values
  const formValues = watch();

  // Update form values if initialData changes
  useEffect(() => {
    if (initialData) {
      setValue("id", initialData.id);
      setValue("name", initialData.name);
      setValue("categories", initialData.categories);
    }
  }, [initialData, setValue]);

  // Form submission handler
  const onSubmit: SubmitHandler<ChecklistFormData> = async (data) => {
    console.log("Form submitted with data:", data);
    setIsSaving(true);

    try {
      // Use the server action to save checklist
      const result = await saveChecklist(data.id || null, {
        name: data.name,
        categories: data.categories,
      });

      console.log("Save checklist result:", result);

      if (result.success) {
        // After saving, redirect to home
        router.push("/");
        router.refresh();
      } else {
        throw new Error("Failed to save checklist");
      }
    } catch (error) {
      console.error("Error saving checklist:", error);
      alert("Failed to save checklist. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for adding a new category
  const addCategory = () => {
    appendCategory({
      name: "New Category",
      items: [],
    });
  };

  // Helper for adding a new item to a category
  const addItem = (categoryIndex: number, category: Category) => {
    const updatedCategory = {
      ...category,
      items: [
        ...category.items,
        {
          name: "New Item",
          is_file_upload_field: true,
          allow_multiple_files: false,
          files: [],
          uploadedFiles: [],
        },
      ],
    };

    updateCategory(categoryIndex, updatedCategory);
  };

  // Helper for removing an item from a category
  const removeItem = async (
    categoryIndex: number,
    category: Category,
    itemIndex: number
  ) => {
    const item = category.items[itemIndex];

    // If the item has an ID, it exists in the backend and needs to be deleted there
    if (item.id) {
      try {
        const result = await deleteItem(item.id);
        if (!result.success) {
          alert("Failed to delete item. Please try again.");
          return;
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
        return;
      }
    }

    // Update the local state
    const updatedCategory = {
      ...category,
      items: category.items.filter((_, idx) => idx !== itemIndex),
    };

    updateCategory(categoryIndex, updatedCategory);
  };

  // Helper for removing a category
  const removeCategory = async (categoryIndex: number) => {
    const category = formValues.categories[categoryIndex];

    // If the category has an ID, it exists in the backend and needs to be deleted there
    if (category.id) {
      try {
        console.log(`Attempting to delete category with ID: ${category.id}`);
        const result = await deleteCategory(category.id);
        if (!result.success) {
          alert("Failed to delete category. Please try again.");
          return;
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
        return;
      }
    }

    // Remove from local state using the field array remove function
    console.log(`Removing category at index: ${categoryIndex}`);
    removeCategoryField(categoryIndex);
  };

  // Helper for updating an item's files
  const updateItemFiles = (
    categoryIndex: number,
    itemIndex: number,
    files: File[]
  ) => {
    const newCategories = [...formValues.categories];
    if (newCategories[categoryIndex]?.items?.[itemIndex]) {
      newCategories[categoryIndex].items[itemIndex].files = files;
      setValue(`categories.${categoryIndex}.items.${itemIndex}.files`, files, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Mock share functionality
  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  // Add a function to handle checklist duplication
  const handleDuplicate = async () => {
    if (!initialData?.id) return;

    setIsDuplicating(true);
    try {
      const result = await duplicateChecklist(initialData.id);
      if (result.success && result.data?.id) {
        router.push(`/checklist/${result.data.id}`);
      } else {
        alert("Failed to duplicate checklist. Please try again.");
      }
    } catch (error) {
      console.error("Error duplicating checklist:", error);
      alert("Failed to duplicate checklist. Please try again.");
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submitted, current values:", formValues);
          onSubmit(formValues as ChecklistFormData);
        }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className="mb-12">
          <div className="relative">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder={
                    isNewChecklist ? "New Checklist Name" : "Untitled Checklist"
                  }
                  className={`text-3xl font-medium w-full border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400
                    ${errors.name ? "text-red-600" : ""}`}
                />
              )}
            />
            {errors.name && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500 flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">{errors.name.message}</span>
              </div>
            )}
          </div>
        </div>

        {errors.categories?.root && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {errors.categories.root.message}
          </div>
        )}

        <div className="space-y-8">
          {categoryFields.map((categoryField, categoryIndex) => {
            const category = formValues.categories[categoryIndex];
            return (
              <div
                key={`category-${categoryIndex}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <Controller
                    name={`categories.${categoryIndex}.name`}
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex-1">
                        <input
                          {...field}
                          type="text"
                          className={`text-lg font-medium focus:outline-none focus:ring-0 text-gray-700 w-full
                            ${
                              errors.categories?.[categoryIndex]?.name
                                ? "text-red-600"
                                : ""
                            }`}
                          placeholder="Category name"
                        />
                        {errors.categories?.[categoryIndex]?.name && (
                          <div className="text-red-500 text-xs mt-1">
                            {errors.categories[categoryIndex]?.name?.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeCategory(categoryIndex)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={`item-${categoryIndex}-${itemIndex}`}
                      className="p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <Controller
                          name={`categories.${categoryIndex}.items.${itemIndex}.name`}
                          control={control}
                          render={({ field }) => (
                            <div className="relative flex-1">
                              <input
                                {...field}
                                type="text"
                                className={`text-gray-600 focus:outline-none focus:ring-0 bg-transparent w-full
                                  ${
                                    errors.categories?.[categoryIndex]?.items?.[
                                      itemIndex
                                    ]?.name
                                      ? "text-red-600"
                                      : ""
                                  }`}
                                placeholder="Item name"
                              />
                              {errors.categories?.[categoryIndex]?.items?.[
                                itemIndex
                              ]?.name && (
                                <div className="text-red-500 text-xs mt-1">
                                  {
                                    errors.categories[categoryIndex]?.items?.[
                                      itemIndex
                                    ]?.name?.message
                                  }
                                </div>
                              )}
                            </div>
                          )}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(categoryIndex, category, itemIndex)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <Controller
                          name={`categories.${categoryIndex}.items.${itemIndex}.is_file_upload_field`}
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center text-sm text-gray-600">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                              />
                              File Upload Field
                            </label>
                          )}
                        />

                        {formValues.categories[categoryIndex]?.items[itemIndex]
                          ?.is_file_upload_field && (
                          <Controller
                            name={`categories.${categoryIndex}.items.${itemIndex}.allow_multiple_files`}
                            control={control}
                            render={({ field }) => (
                              <label className="flex items-center text-sm text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                                />
                                Allow Multiple Files
                              </label>
                            )}
                          />
                        )}
                      </div>

                      {formValues.categories[categoryIndex]?.items[itemIndex]
                        ?.is_file_upload_field && (
                        <FileUploadField
                          onFilesSelected={(files) =>
                            updateItemFiles(categoryIndex, itemIndex, files)
                          }
                          existingFiles={item.uploadedFiles}
                          error={
                            errors.categories?.[categoryIndex]?.items?.[
                              itemIndex
                            ]?.files?.message
                          }
                          allowMultiple={item.allow_multiple_files}
                        />
                      )}
                    </div>
                  ))}

                  <div className="p-4">
                    <button
                      type="button"
                      onClick={() => addItem(categoryIndex, category)}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Add item</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {categoryFields.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500 mb-4">
              No categories yet. Add your first category to get started.
            </p>
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add First Category
            </button>
          </div>
        )}

        {categoryFields.length > 0 && (
          <div className="mt-8">
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add category</span>
            </button>
          </div>
        )}

        <div className="fixed bottom-6 right-6 flex space-x-3">
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg flex items-center
              ${
                isSaving ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
          >
            {isSaving
              ? "Saving..."
              : isNewChecklist
              ? "Create Checklist"
              : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              // Test direct API call
              const testData = {
                name: "Test Checklist",
                categories: [
                  {
                    name: "Test Category",
                    items: [
                      {
                        name: "Test Item",
                        is_file_upload_field: true,
                        allow_multiple_files: false,
                      },
                    ],
                  },
                ],
              };
              console.log("Making direct API call with test data:", testData);
              saveChecklist(null, testData);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg"
          >
            Test API Call
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg border border-gray-200 flex items-center"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Share
          </button>
          <button
            type="button"
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
            {isDuplicating ? "Duplicating..." : "Duplicate"}
          </button>
        </div>
      </form>

      {/* Share Dialog */}
      {isShareDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Checklist</h3>
              <button
                type="button"
                onClick={() => setIsShareDialogOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Share this checklist with your team members by entering their
              email addresses below.
            </p>

            <div className="mb-4">
              <label
                htmlFor="emails"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Addresses
              </label>
              <input
                type="text"
                id="emails"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@example.com, another@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple email addresses with commas.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsShareDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  alert(
                    "Sharing functionality would be implemented here in a real app."
                  );
                  setIsShareDialogOpen(false);
                }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
}
