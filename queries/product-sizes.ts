import apiClient from "@/lib/api-client";

import {
  CreateProductSizePayload,
  GetProductSizesQuery,
  ProductSize,
  UpdateProductSizePayload,
} from "@/types/product-sizes";

interface ProductSizeListResponse {
  success: boolean;
  message: string;
  data: ProductSize[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ProductSizeResponse {
  success: boolean;
  message: string;
  data: ProductSize;
}

export const getProductSizes = async (
  params: GetProductSizesQuery,
): Promise<ProductSizeListResponse> => {
  const response = await apiClient.get("/product-sizes", {
    params,
  });

  return response?.data;
};

export const getProductSizeById = async (
  id: string,
): Promise<ProductSizeResponse> => {
  const response = await apiClient.get(`/product-sizes/${id}`);

  return response?.data;
};

export const createProductSize = async (
  payload: CreateProductSizePayload,
): Promise<ProductSizeResponse> => {
  const response = await apiClient.post("/product-sizes", payload);

  return response?.data;
};

export const updateProductSize = async (
  id: string,
  payload: UpdateProductSizePayload,
): Promise<ProductSizeResponse> => {
  const response = await apiClient.put(`/product-sizes/${id}`, payload);

  return response?.data;
};

export const toggleProductSizeStatus = async (
  id: string,
  isActive: boolean,
): Promise<ProductSizeResponse> => {
  const response = await apiClient.patch(`/product-sizes/${id}/status`, {
    isActive,
  });

  return response?.data;
};

export const deleteProductSize = async (
  id: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await apiClient.delete(`/product-sizes/${id}`);

  return response?.data;
};
