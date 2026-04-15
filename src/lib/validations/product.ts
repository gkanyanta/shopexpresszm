import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z
    .number({ message: "Stock is required" })
    .int()
    .min(0, "Stock cannot be negative"),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isLocal: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  weight: z.number().positive().optional().nullable(),
  width: z.number().positive().optional().nullable(),
  height: z.number().positive().optional().nullable(),
  length: z.number().positive().optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;
