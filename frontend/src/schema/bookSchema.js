// src/schemas/bookSchema.js
import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  // image: z.union([z.instanceof(File), z.string().url()]).optional(), // Removed as per discussion, using coverImageUrl
  coverImageUrl: z.union([z.instanceof(File), z.string().url()]).optional(), // Now directly maps to the file input
  genre: z
    .string()
    .min(1, "At least one genre is required")
    .transform((str) => str.split(",").map((s) => s.trim()).filter(Boolean)), // Transform comma-separated string to array
  publicationYear: z.coerce
    .number()
    .int()
    .gte(1900)
    .lte(new Date().getFullYear()),
  stockQuantity: z.coerce.number().int().nonnegative(),
  isFeatured: z.boolean(),
  publisher: z.string().min(1, "Publisher is required"),
  language: z.string().min(1, "Language is required"),
});