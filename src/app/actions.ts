"use server";

import { revalidatePath } from "next/cache";

interface ChecklistItem {
  id?: string;
  name: string;
  is_file_upload_field?: boolean;
  allow_multiple_files?: boolean;
}

interface Category {
  id?: string;
  name: string;
  items: ChecklistItem[];
}

interface Checklist {
  name: string;
  categories: Category[];
}

interface ApiChecklist {
  id: number;
  name: string;
  share_token: string;
  created_at: string;
  updated_at: string;
  category_count: number;
  item_count: number;
}

interface ApiCategory {
  id: number;
  name: string;
  items: ApiItem[];
}

interface ApiItem {
  id: number;
  name: string;
  is_file_upload_field: boolean;
  allow_multiple_files: boolean;
}

export async function saveChecklist(id: string | null, data: Checklist) {
  try {
    console.log("Submitting checklist data:", data);
    console.log("Checklist ID:", id);

    // Determine if it's a create or update operation
    const isUpdate = id !== null && id !== undefined;

    if (isUpdate) {
      // Update existing checklist
      await updateChecklist(id, data);

      // After updating the checklist itself, handle categories and items
      for (const category of data.categories) {
        if (category.id) {
          // Update existing category
          await updateCategory(category.id, category);

          for (const item of category.items) {
            if (item.id) {
              // Update existing item
              await updateItem(item.id, item);
            } else {
              // Create new item in this category
              await createItem(category.id, item);
            }
          }
        } else {
          // Create new category with its items
          await createCategory(id, category);
        }
      }

      revalidatePath("/");
      return { success: true, data: { id, ...data } };
    } else {
      // Create new checklist
      const apiData = {
        name: data.name,
        categories: data.categories.map((category) => ({
          name: category.name,
          items: category.items.map((item) => ({
            name: item.name,
            is_file_upload_field: item.is_file_upload_field,
            allow_multiple_files: item.allow_multiple_files || false,
          })),
        })),
      };

      console.log("Creating new checklist:", apiData);

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
    }
  } catch (error) {
    console.error("Failed to save checklist:", error);
    return { success: false, error: "Failed to save checklist" };
  }
}

// Update an existing checklist
async function updateChecklist(id: string, data: { name: string }) {
  console.log(`Updating checklist ${id}:`, data.name);

  const response = await fetch(`http://localhost:8000/checklists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: data.name }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Update an existing category
async function updateCategory(categoryId: string, data: { name: string }) {
  console.log(`Updating category ${categoryId}:`, data.name);

  const response = await fetch(
    `http://localhost:8000/categories/${categoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data.name }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Create a new category in an existing checklist
async function createCategory(checklistId: string, data: Category) {
  console.log(`Creating new category in checklist ${checklistId}:`, data.name);

  const categoryData = {
    name: data.name,
    checklist_id: checklistId,
    items: data.items.map((item) => ({
      name: item.name,
      is_file_upload_field: item.is_file_upload_field,
      allow_multiple_files: item.allow_multiple_files || false,
    })),
  };

  const response = await fetch(`http://localhost:8000/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Update an existing item
async function updateItem(itemId: string, data: ChecklistItem) {
  console.log(`Updating item ${itemId}:`, data.name);

  const itemData = {
    name: data.name,
    is_file_upload_field: data.is_file_upload_field,
    allow_multiple_files: data.allow_multiple_files || false,
  };

  const response = await fetch(`http://localhost:8000/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Create a new item in an existing category
async function createItem(categoryId: string, data: ChecklistItem) {
  console.log(`Creating new item in category ${categoryId}:`, data.name);

  const itemData = {
    name: data.name,
    category_id: categoryId,
    is_file_upload_field: data.is_file_upload_field,
    allow_multiple_files: data.allow_multiple_files || false,
  };

  const response = await fetch(`http://localhost:8000/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function getChecklist(id: string) {
  try {
    console.log(`Getting checklist with ID: ${id}`);
    const response = await fetch(`http://localhost:8000/checklists/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Checklist data from API:", data);

    // Ensure we have properly formatted data with the expected structure and ID fields
    const formattedData = {
      id: data.id.toString(), // Convert to string
      name: data.name,
      categories: (data.categories || []).map((category: ApiCategory) => ({
        id: category.id?.toString(), // Convert to string if exists
        name: category.name,
        items: (category.items || []).map((item: ApiItem) => ({
          id: item.id?.toString(), // Convert to string if exists
          name: item.name,
          is_file_upload_field: item.is_file_upload_field || false,
          allow_multiple_files: item.allow_multiple_files || false,
          files: [],
          uploadedFiles: [],
        })),
      })),
    };

    console.log("Formatted checklist data for UI:", formattedData);
    return { success: true, data: formattedData };
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
    console.log("All checklists response:", data);

    // Extract the 'checklists' array from the response
    const checklists = data.checklists || [];

    // Since we only have minimal data (id, name, share_token), we need to add placeholder data for the UI
    const enhancedChecklists = checklists.map((checklist: ApiChecklist) => ({
      id: checklist.id.toString(), // Convert ID to string as expected by UI
      name: checklist.name,
      categories: [], // Add empty categories array as placeholder
      lastModified: checklist.updated_at, // Add current date as placeholder
      item_count: checklist.item_count,
      category_count: checklist.category_count,
    }));

    return { success: true, data: enhancedChecklists };
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

export async function deleteCategory(categoryId: string) {
  try {
    console.log(`Deleting category with ID: ${categoryId}`);
    const response = await fetch(
      `http://localhost:8000/categories/${categoryId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function deleteItem(itemId: string) {
  try {
    console.log(`Deleting item with ID: ${itemId}`);
    const response = await fetch(`http://localhost:8000/items/${itemId}`, {
      method: "DELETE",
    });

    console.log("Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function duplicateChecklist(id: string) {
  try {
    console.log(`Duplicating checklist with ID: ${id}`);
    const response = await fetch(
      `http://localhost:8000/checklists/${id}/clone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Checklist clone response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Clone result:", result);

    // Make sure we return the new checklist ID for redirection
    const newChecklistId = result.checklist_id?.toString();

    if (!newChecklistId) {
      throw new Error("No ID returned for cloned checklist");
    }

    revalidatePath("/");
    return {
      success: true,
      data: {
        id: newChecklistId,
        name: result.name,
      },
    };
  } catch (error) {
    console.error("Failed to duplicate checklist:", error);
    return { success: false, error: "Failed to duplicate checklist" };
  }
}
