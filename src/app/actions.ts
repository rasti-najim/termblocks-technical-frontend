"use server";

import { revalidatePath } from "next/cache";

interface ChecklistItem {
  name: string;
  is_file_upload_field: boolean;
  allow_multiple_files?: boolean;
}

interface Category {
  name: string;
  items: ChecklistItem[];
}

interface Checklist {
  name: string;
  categories: Category[];
}

export async function saveChecklist(id: string | null, data: Checklist) {
  try {
    console.log("Submitting checklist data:", data);

    // Prepare the data in the format the API expects
    const apiData = {
      name: data.name,
      categories: data.categories.map((category) => ({
        name: category.name,
        items: category.items.map((item) => ({
          name: item.name,
          is_file_upload_field: Boolean(item.is_file_upload_field),
          allow_multiple_files: Boolean(item.allow_multiple_files),
        })),
      })),
    };

    console.log("Formatted API data:", apiData);

    const response = await fetch("http://localhost:8000/checklists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("API success response:", result);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save checklist:", error);
    return { success: false, error: "Failed to save checklist" };
  }
}

export async function getChecklist(id: string) {
  try {
    const response = await fetch(`http://localhost:8000/checklists/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get checklist:", error);
    return { success: false, error: "Failed to get checklist" };
  }
}

export async function getAllChecklists() {
  try {
    const response = await fetch("http://localhost:8000/checklists");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get checklists:", error);
    return { success: false, error: "Failed to get checklists" };
  }
}

export async function deleteChecklist(id: string) {
  try {
    const response = await fetch(`http://localhost:8000/checklists/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete checklist:", error);
    return { success: false, error: "Failed to delete checklist" };
  }
}
