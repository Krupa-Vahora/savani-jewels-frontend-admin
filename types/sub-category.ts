export interface SubCategoryImage {
  url: string;
  alt: string;
}

export interface SubCategoryCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: SubCategoryCategory;
  description?: string;
  image?: SubCategoryImage;
  bannerImage?: SubCategoryImage;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubCategoryPayload {
  name: string;
  category: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
  };
  bannerImage?: {
    url: string;
    alt?: string;
  };
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;

}

export type UpdateSubCategoryPayload = CreateSubCategoryPayload;

export type SubCategorySortField =
  | "name"
  | "slug"
  | "displayOrder"
  | "isActive"
  | "createdAt"
  | "category";
