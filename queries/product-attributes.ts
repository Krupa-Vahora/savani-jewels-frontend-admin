import apiClient from "@/lib/api-client";

import {
  CreateProductAttributePayload,
  GetProductAttributesQuery,
  ProductAttribute,
  UpdateProductAttributePayload,
} from "@/types/product-attributes";

interface ProductAttributeListResponse {
  success: boolean;
  message: string;
  data: ProductAttribute[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ProductAttributeResponse {
  success: boolean;
  message: string;
  data: ProductAttribute;
}

export const getProductAttributes = async (
  params: GetProductAttributesQuery,
): Promise<ProductAttributeListResponse> => {
  const response = await apiClient.get("/product-attributes", {
    params,
  });

  return response?.data;
};

export const getProductAttributeById = async (
  id: string,
): Promise<ProductAttributeResponse> => {
  const response = await apiClient.get(`/product-attributes/${id}`);

  return response?.data;
};

export const createProductAttribute = async (
  payload: CreateProductAttributePayload,
): Promise<ProductAttributeResponse> => {
  const response = await apiClient.post("/product-attributes", payload);

  return response?.data;
};

export const updateProductAttribute = async (
  id: string,
  payload: UpdateProductAttributePayload,
): Promise<ProductAttributeResponse> => {
  const response = await apiClient.put(`/product-attributes/${id}`, payload);

  return response?.data;
};

export const toggleProductAttributeStatus = async (
  id: string,
  isActive: boolean,
): Promise<ProductAttributeResponse> => {
  const response = await apiClient.patch(`/product-attributes/${id}/status`, {
    isActive,
  });

  return response?.data;
};

export const deleteProductAttribute = async (
  id: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await apiClient.delete(`/product-attributes/${id}`);

  return response?.data;
};
