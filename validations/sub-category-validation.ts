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

export const subCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Sub category name is required"),
  category: z
    .string()
    .min(1, "Category is required"),

  description: z
    .string()
    .trim()
    .optional(),

  image: imageSchema,

  bannerImage: z
    .object({
      url: z
        .string()
        .trim()
        .url("Banner image URL must be a valid URL")
        .or(z.literal("")),
      alt: z.string().trim().optional(),
    })
    .optional(),

  displayOrder: z
    .number()
    .min(0, "Display order cannot be negative")
    .optional(),

  seoTitle: z
    .string()
    .trim()
    .optional(),

  seoDescription: z
    .string()
    .trim()
    .optional(),
});

export type SubCategoryFormValues = z.infer<
  typeof subCategorySchema
>;
