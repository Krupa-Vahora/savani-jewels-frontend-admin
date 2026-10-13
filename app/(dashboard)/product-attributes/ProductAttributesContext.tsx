"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import constate from "constate";
import useDebounce from "@/hooks/useDebounce";

import {
  createProductAttribute,
  deleteProductAttribute,
  getProductAttributes,
  toggleProductAttributeStatus,
  updateProductAttribute,
} from "../../../queries/product-attributes";

import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateProductAttributePayload,
  GetProductAttributesQuery,
  ProductAttribute,
  ProductAttributeSortField,
  ProductAttributeType,
  UpdateProductAttributePayload,
} from "@/types/product-attributes";
import { CreateProductAttributeFormRef } from "./components/CreateProductAttributesForm";

const useProductAttributes = () => {
  const queryClient = useQueryClient();
  const { showError } = useSnackbar();

  const createProductAttributeModalRef =
    useRef<CreateProductAttributeFormRef>(null);

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProductAttributeType | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [focusedProductAttribute, setFocusedProductAttribute] =
    useState<ProductAttribute | null>(null);

  const debouncedSearchText = useDebounce(searchText);

  const searchQuery =
    debouncedSearchText?.trim().length >= 3 ? debouncedSearchText?.trim() : "";

  const [filterParams, setFilterParams] = useState<GetProductAttributesQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const getProductAttributesQuery = useQuery({
    queryKey: ["product-attributes", filterParams, searchQuery],
    queryFn: () =>
      getProductAttributes({
        ...filterParams,
        page: filterParams.page ?? 1,
        limit: filterParams.limit ?? 10,
        search: searchQuery,
      }),
  });

  const productAttributes = getProductAttributesQuery?.data?.data ?? [];

  const pagination = getProductAttributesQuery?.data?.pagination;

  const handleSort = (field: ProductAttributeSortField) => {
    setFilterParams((prev: GetProductAttributesQuery) => {
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
    setFilterParams((prev: GetProductAttributesQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleTypeFilter = (attributeType: ProductAttributeType | "all") => {
    setTypeFilter(attributeType);
    setFilterParams((prev) => ({
      ...prev,
      page: 1,
      attributeType: attributeType === "all" ? undefined : attributeType,
    }));
  };
  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    setFilterParams((prev: GetProductAttributesQuery) => ({
      ...prev,
      page: 1,
      isActive: status === "all" ? undefined : status === "active",
    }));
  };

  const handleRefresh = () => {
    setSearchText("");
    setTypeFilter("all");
    setStatusFilter("all");
    setFilterParams({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      attributeType: undefined,
      isActive: undefined,
    });

    queryClient.invalidateQueries({
      queryKey: ["product-attributes"],
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

  const createProductAttributeMutation = useMutation({
    mutationFn: (payload: CreateProductAttributePayload) =>
      createProductAttribute(payload),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-attributes"],
      });
    },
  });

  const updateProductAttributeMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductAttributePayload;
    }) => updateProductAttribute(id, payload),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-attributes"],
      });
      setFocusedProductAttribute(null);
    },
  });

  const deleteProductAttributeMutation = useMutation({
    mutationFn: (id: string) => deleteProductAttribute(id),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-attributes"],
      });
    },
  });

  const updateProductAttributeStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleProductAttributeStatus(id, isActive),
    onError: () => showError("Something went wrong"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-attributes"],
      });
    },
  });

  return {
    createProductAttributeModalRef,
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filterParams,
    setFilterParams,
    focusedProductAttribute,
    setFocusedProductAttribute,
    getProductAttributesQuery,
    productAttributes,
    pagination,
    handleSearch,
    handleTypeFilter,
    handleStatusFilter,
    handleRefresh,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    createProductAttributeMutation,
    updateProductAttributeMutation,
    deleteProductAttributeMutation,
    updateProductAttributeStatusMutation,
  };
};

export const [ProductAttributeContextProvider, useProductAttributeContext] =
  constate(useProductAttributes);
