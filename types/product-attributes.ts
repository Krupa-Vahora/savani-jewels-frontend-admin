export enum ProductAttributeType {
  GOLD_PURITY = "GOLD_PURITY",
  GOLD_COLOR = "GOLD_COLOR",
  DIAMOND_TYPE = "DIAMOND_TYPE",
  DIAMOND_QUALITY = "DIAMOND_QUALITY",
  DIAMOND_COLOR = "DIAMOND_COLOR",
  CERTIFICATE = "CERTIFICATE",
}

export type ProductAttributeSortField =
  | "attributeType"
  | "value"
  | "displayOrder"
  | "isActive"
  | "createdAt";

export interface ProductAttribute {
  _id: string;
  attributeType: ProductAttributeType;
  name: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductAttributePayload {
  attributeType: ProductAttributeType;
  value: string;
  displayOrder?: number;
}

export type UpdateProductAttributePayload = CreateProductAttributePayload;

export interface GetProductAttributesQuery {
  page: number;
  limit: number;
  search?: string;
  attributeType?: ProductAttributeType;
  isActive?: boolean;
  sortBy?: ProductAttributeSortField;
  sortOrder?: "asc" | "desc";
}

export const formatAttributeType = (type: string) => {
  const labels: Record<string, string> = {
    GOLD_PURITY: "Gold Purity",
    GOLD_COLOR: "Gold Color",
    DIAMOND_TYPE: "Diamond Type",
    DIAMOND_QUALITY: "Diamond Quality",
    DIAMOND_COLOR: "Diamond Color",
    CERTIFICATE: "Certificate",
  };

  return labels[type] ?? type;
};

export const ProductAttributeTypeOptions = [
  {
    value: ProductAttributeType.GOLD_PURITY,
    label: "Gold Purity",
  },
  {
    value: ProductAttributeType.GOLD_COLOR,
    label: "Gold Color",
  },
  {
    value: ProductAttributeType.DIAMOND_TYPE,
    label: "Diamond Type",
  },
  {
    value: ProductAttributeType.DIAMOND_QUALITY,
    label: "Diamond Quality",
  },
  {
    value: ProductAttributeType.DIAMOND_COLOR,
    label: "Diamond Color",
  },
  {
    value: ProductAttributeType.CERTIFICATE,
    label: "Certificate",
  },
];
