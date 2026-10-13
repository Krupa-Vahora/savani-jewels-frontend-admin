import apiClient from "@/lib/api-client";

export interface GetSubCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getSubCategories = async (
  params?: GetSubCategoriesParams,
) => {
  const response = await apiClient.get("/subcategory", {
    params,
  });

  return response?.data;
};

export const getSubCategoryById = async (
  id: string,
) => {
  const response = await apiClient.get(
    `/subcategory/${id}`,
  );

  return response?.data;
};

export const createSubCategory = async (
  payload: unknown,
) => {
  const response = await apiClient.post(
    "/subcategory",
    payload,
  );

  return response?.data;
};

export const updateSubCategory = async (
  id: string,
  payload: unknown,
) => {
  const response = await apiClient.put(
    `/subcategory/${id}`,
    payload,
  );

  return response?.data;
};

export const deleteSubCategory = async (
  id: string,
) => {
  const response = await apiClient.delete(
    `/subcategory/${id}`,
  );

  return response?.data;
};

export const toggleSubCategoryStatus = async (
  id: string,
  isActive: boolean,
) => {
  const response = await apiClient.patch(
    `/subcategory/${id}/status`,
    {
      isActive,
    },
  );

  return response?.data;
};
