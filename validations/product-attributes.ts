import { z } from "zod";

export const productAttributeSchema = z.object({
  attributeType: z.string().min(1, "Attribute type is required"),
  value: z.string().trim().min(1, "Value is required"),
  displayOrder: z
    .number()
    .min(0, "Display order cannot be negative"),
});

export type ProductAttributeFormValues = z.infer<
  typeof productAttributeSchema
>;
