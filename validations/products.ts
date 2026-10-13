import { z } from "zod";

const mediaSchema = z.object({
  url: z.string().url("Invalid URL"),
  alt: z.string().trim().min(1, "Alt text is required"),
  isPrimary: z.boolean(),
  displayOrder: z.number().min(1),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  slug: z.string().trim().min(1, "Slug is required"),

  productCode: z.string().trim().min(1, "Product code is required"),

  sku: z.string().trim().min(1, "SKU is required"),

  category: z.string().min(1, "Category is required"),

  subCategory: z.string().min(1, "Sub-category is required"),

  goldPurities: z.array(z.string()).default([]),

  goldColors: z.array(z.string()).default([]),

  diamondTypes: z.array(z.string()).default([]),

  diamondQualities: z.array(z.string()).default([]),

  diamondColors: z.array(z.string()).default([]),

  certificates: z.array(z.string()).default([]),

  availableSizes: z.array(z.string()).default([]),

  grossWeight: z.number().min(0, "Gross weight is required"),

  netWeight: z.number().min(0, "Net weight is required"),

  diamondWeight: z.number().min(0).optional(),

  diamondPieces: z.number().int().min(0).optional(),

  centerStoneWeight: z.number().min(0).optional(),

  centerStonePieces: z.number().int().min(0).optional(),

  shortDescription: z.string().optional(),

  description: z.string().optional(),

  specifications: z.string().optional(),

  images: z.array(mediaSchema).default([]),

  videos: z.array(mediaSchema).default([]),

  seoTitle: z.string().optional(),

  seoDescription: z.string().optional(),

  isFeatured: z.boolean().default(false),

  isBestSeller: z.boolean().default(false),

  isNewArrival: z.boolean().default(false),
});

export type ProductFormValues = z.input<typeof productSchema>;
