"use server";

import { type Category } from "@/schemas/checklist";

// Type definitions
export interface Checklist {
  id: string;
  name: string;
  categories: Category[];
  lastModified: string;
}

// In a real app, this would be saved to a database
// For now, we'll use this in-memory storage that will be reset on server restart
const mockDB: Record<string, Omit<Checklist, "id">> = {
  "1": {
    name: "Project Launch Checklist",
    categories: [
      {
        id: "cat1",
        name: "Documentation",
        items: [
          {
            id: "item1",
            name: "Project Requirements",
            uploadedFiles: ["requirements.pdf"],
          },
          {
            id: "item2",
            name: "Technical Specifications",
            uploadedFiles: ["specs.doc"],
          },
        ],
      },
      {
        id: "cat2",
        name: "Design Assets",
        items: [
          {
            id: "item3",
            name: "Logo Files",
            uploadedFiles: ["logo.png", "logo.svg"],
          },
        ],
      },
    ],
    lastModified: new Date().toISOString(),
  },
  "2": {
    name: "Weekly Review",
    categories: [
      {
        id: "cat3",
        name: "Reports",
        items: [
          {
            id: "item4",
            name: "Weekly Progress",
            uploadedFiles: ["progress.pdf"],
          },
        ],
      },
    ],
    lastModified: new Date().toISOString(),
  },
};

// Server action to get a checklist by ID
export async function getChecklist(id: string) {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (id === "new") {
    return null;
  }

  const data = mockDB[id];
  if (!data) {
    return null;
  }

  return { ...data, id };
}

// Server action to get all checklists
export async function getAllChecklists(): Promise<Checklist[]> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Object.entries(mockDB).map(([id, data]) => ({
    ...data,
    id,
  }));
}

// Server action to save a checklist
export async function saveChecklist(
  id: string | null,
  data: { name: string; categories: Category[] }
): Promise<{ success: boolean; id: string }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const newId = id || Math.random().toString(36).substring(2, 9);

    mockDB[newId] = {
      ...data,
      lastModified: new Date().toISOString(),
    };

    return { success: true, id: newId };
  } catch (error) {
    console.error("Error saving checklist:", error);
    return { success: false, id: id || "" };
  }
}

// Server action to delete a checklist
export async function deleteChecklist(
  id: string
): Promise<{ success: boolean }> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    if (mockDB[id]) {
      delete mockDB[id];
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Error deleting checklist:", error);
    return { success: false };
  }
}
