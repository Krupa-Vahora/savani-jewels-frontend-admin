export enum SizeCategory {
  RINGS = "RING",
  BANGLE = "BANGLE",
  BRACELET = "BRACELET",
}

export enum BraceletType {
  KADA = "KADA",
  LOOSE = "LOOSE",
}

export type ProductSizeSortField =
  | "sizeCategory"
  | "braceletType"
  | "value"
  | "displayOrder"
  | "isActive"
  | "createdAt";

export interface ProductSize {
  _id: string;
  sizeCategory: SizeCategory;
  value: string;
  braceletType?: BraceletType;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductSizePayload {
  sizeCategory: SizeCategory;
  value: string;
  braceletType?: BraceletType;
  displayOrder?: number;
}

export type UpdateProductSizePayload = CreateProductSizePayload;

export interface GetProductSizesQuery {
  page: number;
  limit: number;
  search?: string;
  sizeCategory?: string;
  braceletType?: string;
  isActive?: boolean;
  sortBy?: ProductSizeSortField;
  sortOrder?: "asc" | "desc";
}

export const SizeCategoryOptions = [
  { value: SizeCategory.RINGS, label: "Rings" },
  { value: SizeCategory.BANGLE, label: "Bangles" },
  { value: SizeCategory.BRACELET, label: "Bracelet" },
];

export const BraceletTypeOptions = [
  { value: BraceletType.KADA, label: "Kada" },
  { value: BraceletType.LOOSE, label: "Loose" },
];

export const formatSizeCategory = (category: string): string => {
  const labels: Record<string, string> = {
    RING: "Ring",
    BANGLE: "Bangle",
    BRACELET: "Bracelet",
  };
  return labels[category] ?? category;
};

export const formatBraceletType = (type: string): string => {
  const labels: Record<string, string> = {
    KADA: "Kada",
    LOOSE: "Loose",
  };
  return labels[type] ?? type;
};

// Generate size options based on category and bracelet type
export const getSizeOptions = (
  category: SizeCategory | string,
  braceletType?: BraceletType | string,
): { value: string; label: string }[] => {
  // Kada style sizes for both BANGLE and BRACELET with KADA
  const kadaSizes = [
    { value: "2'2", label: "2'2" },
    { value: "2'4", label: "2'4" },
    { value: "2'6", label: "2'6" },
    { value: "2'8", label: "2'8" },
    { value: "2'10", label: "2'10" },
  ];

  // Loose bracelet sizes
  const looseSizes = [
    { value: "6", label: "6 inches" },
    { value: "6.5", label: "6.5 inches" },
    { value: "7", label: "7 inches" },
    { value: "7.5", label: "7.5 inches" },
    { value: "8", label: "8 inches" },
    { value: "8.5", label: "8.5 inches" },
    { value: "9", label: "9 inches" },
  ];

  // Ring sizes
  const ringSizes = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
  ];

  // Bangle uses Kada style sizes
  if (category === SizeCategory.BANGLE) {
    return kadaSizes;
  }

  // Bracelet with Kada style
  if (category === SizeCategory.BRACELET && braceletType === BraceletType.KADA) {
    return kadaSizes;
  }

  // Bracelet with Loose style
  if (category === SizeCategory.BRACELET && braceletType === BraceletType.LOOSE) {
    return looseSizes;
  }

  // Ring uses standard ring sizes
  return ringSizes;
};
