import apiClient from "@/lib/api-client";
import {
  GetProductsQuery,
  GetProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  Product,
} from "@/types/products";

export const getProducts = async (
  query: GetProductsQuery,
): Promise<GetProductsResponse> => {
  const response = await apiClient.get("/products", {
    params: query,
  });

  return response?.data;
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<{ success: boolean; data: Product }> => {
  const response = await apiClient.post("/products", payload);
  return response?.data;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<{ success: boolean; data: Product }> => {
  const response = await apiClient.put(`/products/${id}`, payload);
  return response?.data;
};

export const deleteProduct = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await apiClient.delete(`/products/${id}`);
  return response?.data;
};

export const toggleProductStatus = async (
  id: string,
  isActive: boolean,
) => {
  const response = await apiClient.patch(
    `/products/${id}/status`,
    {
      isActive,
    },
  );

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`);

  return response.data;
};
