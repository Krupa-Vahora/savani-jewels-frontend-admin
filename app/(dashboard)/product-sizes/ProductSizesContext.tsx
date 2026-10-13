"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import constate from "constate";
import useDebounce from "@/hooks/useDebounce";

import {
  createProductSize,
  deleteProductSize,
  getProductSizes,
  toggleProductSizeStatus,
  updateProductSize,
} from "@/queries/product-sizes";

import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateProductSizePayload,
  GetProductSizesQuery,
  ProductSize,
  ProductSizeSortField,
  UpdateProductSizePayload,
} from "@/types/product-sizes";
import { CreateProductSizeFormRef } from "./components/CreateProductSizeForm";

const useProductSizes = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useSnackbar();

  const createProductSizeModalRef = useRef<CreateProductSizeFormRef>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sizeCategory, setSizeCategory] = useState<string>("all");
  const [braceletTypeFilter, setBraceletTypeFilter] = useState<string>("all");
  const [focusedProductSize, setFocusedProductSize] =
    useState<ProductSize | null>(null);

  const debouncedSearchText = useDebounce(searchText);

  const searchQuery =
    debouncedSearchText?.trim().length >= 3 ? debouncedSearchText?.trim() : "";

  const [filterParams, setFilterParams] = useState<GetProductSizesQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const getProductSizesQuery = useQuery({
    queryKey: [
      "product-sizes",
      filterParams,
      searchQuery,
      sizeCategory,
      braceletTypeFilter,
    ],
    queryFn: () =>
      getProductSizes({
        ...filterParams,
        page: filterParams.page ?? 1,
        limit: filterParams.limit ?? 10,
        search: searchQuery,
        sizeCategory: sizeCategory === "all" ? undefined : sizeCategory,
        braceletType:
          braceletTypeFilter === "all" ? undefined : braceletTypeFilter,
      }),
  });

  const productSizes = getProductSizesQuery?.data?.data ?? [];

  const pagination = getProductSizesQuery?.data?.pagination;

  const handleSort = (field: ProductSizeSortField) => {
    setFilterParams((prev: GetProductSizesQuery) => {
      const sameField = prev?.sortBy === field;
      return {
        ...prev,
        page: 1,
        sortBy: field,
        sortOrder: sameField && prev?.sortOrder === "asc" ? "desc" : "asc",
      };
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setFilterParams((prev: GetProductSizesQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    setFilterParams((prev: GetProductSizesQuery) => ({
      ...prev,
      page: 1,
      isActive: status === "all" ? undefined : status === "active",
    }));
  };

  const handleSizeCategoryFilter = (category: string) => {
    setSizeCategory(category);
    setBraceletTypeFilter("all");
    setFilterParams((prev: GetProductSizesQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleBraceletTypeFilter = (type: string) => {
    setBraceletTypeFilter(type);
    setFilterParams((prev: GetProductSizesQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("all");
    setSizeCategory("all");
    setBraceletTypeFilter("all");
    setFilterParams({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      isActive: undefined,
    });

    queryClient.invalidateQueries({
      queryKey: ["product-sizes"],
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

  const handleEdit = (size: (typeof productSizes)[number]) => {
    setFocusedProductSize(size);
    createProductSizeModalRef.current?.openModal();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this size?",
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteProductSizeMutation.mutateAsync(id);
    } catch (error) {
      console.error("Delete product size error:", error);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await updateProductSizeStatusMutation.mutateAsync({
        id,
        isActive,
      });
    } catch (error) {
      console.error("Update product size status error:", error);
    }
  };

  const createProductSizeMutation = useMutation({
    mutationFn: (payload: CreateProductSizePayload) =>
      createProductSize(payload),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Product size created successfully");
      queryClient.invalidateQueries({
        queryKey: ["product-sizes"],
      });
    },
  });

  const updateProductSizeMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductSizePayload;
    }) => updateProductSize(id, payload),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Product size updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["product-sizes"],
      });
      setFocusedProductSize(null);
    },
  });

  const deleteProductSizeMutation = useMutation({
    mutationFn: (id: string) => deleteProductSize(id),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Product size deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["product-sizes"],
      });
    },
  });

  const updateProductSizeStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleProductSizeStatus(id, isActive),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      showSuccess("Product size status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["product-sizes"],
      });
    },
  });

  return {
    createProductSizeModalRef,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    sizeCategory,
    setSizeCategory,
    braceletTypeFilter,
    setBraceletTypeFilter,
    filterParams,
    setFilterParams,
    focusedProductSize,
    setFocusedProductSize,
    getProductSizesQuery,
    productSizes,
    pagination,
    handleSearch,
    handleStatusFilter,
    handleSizeCategoryFilter,
    handleBraceletTypeFilter,
    handleRefresh,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleDelete,
    handleEdit,
    handleStatusChange,
    createProductSizeMutation,
    updateProductSizeMutation,
    deleteProductSizeMutation,
    updateProductSizeStatusMutation,
  };
};

export const [ProductSizeContextProvider, useProductSizeContext] =
  constate(useProductSizes);
