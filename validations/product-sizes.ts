import { z } from "zod";
import { SizeCategory, BraceletType } from "@/types/product-sizes";

export const productSizeSchema = z
  .object({
    sizeCategory: z.enum(SizeCategory, {
      message: "Category is required",
    }),
    braceletType: z.enum(BraceletType).optional(),
    value: z.string().trim().min(1, "Size value is required"),
    displayOrder: z.number().min(0, "Display order cannot be negative"),
  })
  .refine(
    (data) => {
      // If bracelet is selected, braceletType must be provided
      if (data.sizeCategory === SizeCategory.BRACELET) {
        return !!data.braceletType;
      }
      return true;
    },
    {
      message: "Bracelet type is required for bracelet category",
      path: ["braceletType"],
    },
  );

export type ProductSizeFormValues = z.infer<typeof productSizeSchema>;
