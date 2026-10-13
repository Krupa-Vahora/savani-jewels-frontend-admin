import { CategoriesResponse, CategoryListParams, CreateCategoryRequest,CategoryResponse, UpdateCategoryRequest } from '@/types/category';
import {  } from './../types/category';
import apiClient from '@/lib/api-client';

export const getCategories = async (
  params?: CategoryListParams,
): Promise<CategoriesResponse> => {
  const response = await apiClient.get('/category', {
    params,
  });

  return response?.data;
};

export const getCategoryById = async (
  id: string,
): Promise<CategoryResponse> => {
  const response = await apiClient.get(`/category/${id}`);

  return response?.data;
};

export const createCategory = async (
  payload: CreateCategoryRequest,
): Promise<CategoryResponse> => {
  const response = await apiClient.post('/category', payload);

  return response?.data;
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryRequest,
): Promise<CategoryResponse> => {
  const response = await apiClient.put(`/category/${id}`, payload);

  return response?.data;
};

export const deleteCategory = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/category/${id}`);

  return response?.data;
};

export const toggleCategoryStatus = async (
  id: string,
  isActive: boolean,
): Promise<CategoryResponse> => {
  const response = await apiClient.patch(`/category/${id}/status`, {
    isActive,
  });

  return response?.data;
};
