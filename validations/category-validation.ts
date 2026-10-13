import { z } from "zod";

const imageSchema = z
  .object({
    url: z
      .string()
      .trim()
      .url("Image URL must be a valid URL")
      .or(z.literal("")),
    alt: z.string().trim().optional(),

  })

  .optional();

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  displayOrder: z
    .number()
    .int("Display order must be a whole number")
    .min(0, "Display order cannot be negative"),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  image: imageSchema,
  bannerImage: imageSchema,

});

export type CategoryFormValues = z.infer<typeof categorySchema>;
