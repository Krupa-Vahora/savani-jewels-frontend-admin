export interface Image {
  publicId?: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface ProductCategory {
  _id: number;
  name: string;
  slug: string;
}
export interface ProductSubCategory {
  _id: number;
  name: string;
  slug: string;
}

export interface ProductMedia {
  url: string;
  alt: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  productCode: string;
  sku: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  goldPurities: string[];
  goldColors: string[];
  diamondTypes: string[];
  diamondQualities: string[];
  diamondColors: string[];
  certificates: string[];
  availableSizes: string[];
  grossWeight: number;
  netWeight: number;
  diamondWeight?: number;
  diamondPieces?: number;
  centerStoneWeight?: number;
  centerStonePieces?: number;
  shortDescription?: string;
  description?: string;
  specifications?: string;
  images: Image[];
  videos: Image[];
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductSortField =
  | "name"
  | "productCode"
  | "sku"
  | "category"
  | "subCategory"
  | "grossWeight"
  | "netWeight"
  | "isFeatured"
  | "isBestSeller"
  | "isNewArrival"
  | "isActive"
  | "createdAt";


  export type ProductTagFilter =
  | "featured"
  | "bestSeller"
  | "newArrival";

export interface CreateProductPayload {
  name: string;
  slug: string;
  productCode: string;
  sku: string;
  category: string;
  subCategory: string;
  goldPurities?: string[];
  goldColors?: string[];
  diamondTypes?: string[];
  diamondQualities?: string[];
  diamondColors?: string[];
  certificates?: string[];
  availableSizes?: string[];
  grossWeight: number;
  netWeight: number;
  diamondWeight?: number;
  diamondPieces?: number;
  centerStoneWeight?: number;
  centerStonePieces?: number;
  shortDescription?: string;
  description?: string;
  specifications?: string;
  images?: Image[];
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface GetProductsQuery {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  subCategory?: string;
  isActive?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sortBy?: ProductSortField;
  sortOrder?: "asc" | "desc";
}

export interface GetProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
