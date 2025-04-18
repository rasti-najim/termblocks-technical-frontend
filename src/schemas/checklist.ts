import { z } from "zod";

// Zod schema for checklist item
export const checklistItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Item name is required" }),
  files: z.array(z.instanceof(File)).optional(),
  uploadedFiles: z.array(z.string()).optional(),
});

// Zod schema for checklist category
export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Category name is required" }),
  items: z.array(checklistItemSchema),
});

// Zod schema for the entire checklist form
export const checklistFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Checklist name is required" }),
  categories: z.array(categorySchema).min(1, {
    message: "At least one category is required",
  }),
});

// TypeScript types derived from Zod schemas
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ChecklistFormData = z.infer<typeof checklistFormSchema>;
