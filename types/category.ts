export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  bannerImage?: {
    url?: string;
    alt?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategorySortField =
  | "name"
  | "slug"
  | "displayOrder"
  | "isActive"
  | "createdAt";

export interface GetCategoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: CategorySortField;
  sortOrder?: "asc" | "desc";
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: CategorySortField;
  sortOrder?: "asc" | "desc";
}
