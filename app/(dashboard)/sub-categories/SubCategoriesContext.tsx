"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import constate from "constate";

import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  toggleSubCategoryStatus,
  updateSubCategory,
} from "@/queries/sub-category";

import type { SubCategory, SubCategorySortField } from "@/types/sub-category";
import { CreateSubCategoryFormRef } from "./components/CreateSubCategoryForm";
import { getCategories } from "@/queries/category";
import useDebounce from "@/hooks/useDebounce";
import { useSnackbar } from "@/context/SnackbarContext";

const useSubCategories = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useSnackbar();

  const categoryIdFromUrl = searchParams?.get("categoryId") || "";

  const createSubCategoryModalRef = useRef<CreateSubCategoryFormRef>(null);

  const [filterParams, setFilterParams] = useState<{
    page: number;
    limit: number;
    sortBy: SubCategorySortField;
    sortOrder: "asc" | "desc";
    isActive?: boolean;
  }>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(categoryIdFromUrl);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [focusedSubCategory, setFocusedSubCategory] =
    useState<SubCategory | null>(null);

  const debouncedSearchText = useDebounce(searchText);

  const searchQuery =
    debouncedSearchText.trim().length >= 3 ? debouncedSearchText.trim() : "";

  const getCategoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const categories = getCategoriesQuery?.data?.data ?? [];

  const getSubCategoriesQuery = useQuery({
    queryKey: [
      "sub-categories",
      filterParams,
      searchText,
      categoryFilter,
      statusFilter,
      searchQuery,
    ],

    queryFn: () =>
      getSubCategories({
        ...filterParams,
        search: searchQuery || undefined,
        category: categoryFilter || undefined,
        isActive:
          statusFilter === "all"
            ? undefined
            : statusFilter === "active"
              ? true
              : false,
      }),

    staleTime: 5 * 60 * 1000,
  });

  const subCategories = getSubCategoriesQuery?.data?.data ?? [];
  const pagination = getSubCategoriesQuery?.data?.pagination;

  const createSubCategoryMutation = useMutation({
    mutationFn: (payload: unknown) => createSubCategory(payload),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Sub-Category created successfully");
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      });
    },
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      updateSubCategory(id, payload),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Sub-Category updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sub-category"],
      });
      setFocusedSubCategory(null);
    },
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteSubCategory(id),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Sub-Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      });
    },
  });

  const updateSubCategoryStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleSubCategoryStatus(id, isActive),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Sub-Category status updated");

      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      });
    },
  });

  const handleCategoryFilter = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setFilterParams((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleSort = (field: SubCategorySortField) => {
    setFilterParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    setFilterParams((previous) => ({
      ...previous,
      page: 1,
      isActive: status === "all" ? undefined : status === "active",
    }));
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("all");
    setCategoryFilter("");
    setFilterParams((previous) => ({
      ...previous,
      page: 1,
      isActive: undefined,
      sortOrder: "desc",
    }));
    queryClient.invalidateQueries({
      queryKey: ["sub-categories"],
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handlePageChange = (page: number) => {
    setFilterParams((previous) => ({
      ...previous,
      page: page + 1,
    }));
  };

  const handleRowsPerPageChange = (limit: number) => {
    setFilterParams((previous) => ({
      ...previous,
      page: 1,
      limit,
    }));
  };

  return {
    categories,
    createSubCategoryModalRef,
    getSubCategoriesQuery,
    subCategories,
    pagination,
    filterParams,
    setFilterParams,
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    focusedSubCategory,
    setFocusedSubCategory,
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
    updateSubCategoryStatusMutation,
    handleCategoryFilter,
    handleRefresh,
    handleStatusFilter,
    handleSearch,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
  };
};

export const [SubCategoriesContextProvider, useSubCategoriesContext] =
  constate(useSubCategories);
