"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import constate from "constate";
import useDebounce from "@/hooks/useDebounce";

import {
  createCategory,
  deleteCategory,
  getCategories,
  toggleCategoryStatus,
  updateCategory,
} from "@/queries/category";

import type {
  Category,
  CategorySortField,
  CreateCategoryPayload,
  GetCategoriesQuery,
  UpdateCategoryPayload,
} from "@/types/category";
import { CreateCategoryFormRef } from "./components/CreateCategoryForm";
import { useSnackbar } from "@/context/SnackbarContext";

const useCategory = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  const createCategoryModalRef = useRef<CreateCategoryFormRef>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const debouncedSearchText = useDebounce(searchText);

  const searchQuery =
    debouncedSearchText.trim().length >= 3 ? debouncedSearchText.trim() : "";

  const [filterParams, setFilterParams] = useState<GetCategoriesQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [focusedCategory, setFocusedCategory] = useState<Category | null>(null);

  const getCategoriesQuery = useQuery({
    queryKey: [
      "categories",
      {
        ...filterParams,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      getCategories({
        ...filterParams,
        search: searchQuery || undefined,
      }),

    staleTime: 5 * 60 * 1000,
  });

  const categories = getCategoriesQuery?.data?.data ?? [];

  const pagination = getCategoriesQuery?.data?.pagination;

  const handleSort = (field: CategorySortField) => {
    setFilterParams((previous) => {
      const sameField = previous.sortBy === field;
      return {
        ...previous,
        page: 1,
        sortBy: field,
        sortOrder: sameField && previous.sortOrder === "asc" ? "desc" : "asc",
      };
    });
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    setFilterParams((previous) => ({
      ...previous,
      page: 1,
      isActive: status === "all" ? undefined : status === "active",
    }));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("all");
    setFilterParams((previous) => ({
      ...previous,
      page: 1,
      isActive: undefined,
      sortOrder: "desc",
    }));
    queryClient.invalidateQueries({
      queryKey: ["categories"],
    });
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

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      showSuccess("Category created successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),
    onError: () => {
      showError("Something went wrong");
    },
    onSuccess: () => {
      showSuccess("Category updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setFocusedCategory(null);
    },
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onError: () => {
      showError("Something went wrong");
    },
    onSuccess: () => {
      showSuccess("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const updateCategoryStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleCategoryStatus(id, isActive),
    onError: () => {
      showError("Something went wrong");
    },
    onSuccess: () => {
      showSuccess("Category status updated");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return {
    createCategoryModalRef,
    setSearchText,
    searchText,
    statusFilter,
    setStatusFilter,
    getCategoriesQuery,
    categories,
    pagination,
    filterParams,
    setFilterParams,
    handleSearch,
    focusedCategory,
    setFocusedCategory,
    handleSort,
    handleStatusFilter,
    handleRefresh,
    handlePageChange,
    handleRowsPerPageChange,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    updateCategoryStatusMutation,
  };
};

export const [CategoryContextProvider, useCategoryContext] =
  constate(useCategory);
