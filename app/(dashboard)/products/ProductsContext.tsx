"use client";

import { useRef, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import constate from "constate";
import useDebounce from "@/hooks/useDebounce";

import {
  createProduct,
  deleteProduct,
  getProducts,
  toggleProductStatus,
  updateProduct,
} from "@/queries/products";

import { useSnackbar } from "@/context/SnackbarContext";
import {
  CreateProductPayload,
  GetProductsQuery,
  Product,
  ProductSortField,
  ProductTagFilter,
  UpdateProductPayload,
} from "@/types/products";
import { CreateProductFormRef } from "./components/CreateProductForm";
import { getCategories } from "@/queries/category";
import { getSubCategories } from "@/queries/sub-category";

const useProducts = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useSnackbar();

  const createProductModalRef = useRef<CreateProductFormRef>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");
  const [productTag, setProductTag] = useState<ProductTagFilter[]>([]);
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);

  const debouncedSearchText = useDebounce(searchText);

  const searchQuery =
    debouncedSearchText?.trim().length >= 3 ? debouncedSearchText?.trim() : "";

  const [filterParams, setFilterParams] = useState<GetProductsQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const getProductsQuery = useQuery({
    queryKey: [
      "products",
      filterParams,
      searchQuery,
      categoryFilter,
      subCategoryFilter,
      statusFilter,
      productTag,
    ],

    queryFn: () =>
      getProducts({
        ...filterParams,
        page: filterParams.page ?? 1,
        limit: filterParams.limit ?? 10,
        search: searchQuery || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        subCategory:
          subCategoryFilter === "all" ? undefined : subCategoryFilter,
        isActive:
          statusFilter === "all" ? undefined : statusFilter === "active",
        featured: productTag.includes("featured") ? true : undefined,
        bestSeller: productTag.includes("bestSeller") ? true : undefined,
        newArrival: productTag.includes("newArrival") ? true : undefined,
      }),

    placeholderData: keepPreviousData,
  });

  const products = getProductsQuery?.data?.data ?? [];

  const pagination = getProductsQuery?.data?.pagination;

  const handleSort = (field: ProductSortField) => {
    setFilterParams((prev: GetProductsQuery) => {
      const sameField = prev?.sortBy === field;
      return {
        ...prev,
        page: 1,
        sortBy: field,
        sortOrder: sameField && prev?.sortOrder === "asc" ? "desc" : "asc",
      };
    });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setSubCategoryFilter("all");
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleSubCategoryFilter = (subCategory: string) => {
    setSubCategoryFilter(subCategory);
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleProductTagFilter = (tags: ProductTagFilter[]) => {
    setProductTag(tags);
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSubCategoryFilter("all");
    setProductTag([]);

    setFilterParams({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setFilterParams((prev: GetProductsQuery) => ({
      ...prev,
      page: 1,
      limit: newLimit,
    }));
  };

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      showSuccess("Product created successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      createProductModalRef.current?.closeModal();
    },
    onError: () => {
      showError("Failed to create product");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => updateProduct(id, payload),
    onSuccess: () => {
      showSuccess("Product updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      createProductModalRef.current?.closeModal();
    },
    onError: () => {
      showError("Failed to update product");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      showSuccess("Product deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: () => {
      showError("Failed to delete product");
    },
  });

  const updateProductStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleProductStatus(id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: () => {
      showError("Failed to update status");
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () =>
      getCategories({
        isActive: true,
        limit: 1000,
      }),
  });

  const { data: subCategoriesData } = useQuery({
    queryKey: ["sub-categories-all", categoryFilter],
    queryFn: () =>
      getSubCategories({
        category: categoryFilter === "all" ? undefined : categoryFilter,
        isActive: true,
        limit: 1000,
      }),
    enabled: categoryFilter !== "all",
  });

  return {
    createProductModalRef,
    productTag,
    setProductTag,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    filterParams,
    setFilterParams,
    focusedProduct,
    setFocusedProduct,
    getProductsQuery,
    products,
    pagination,
    handleSearch,
    handleStatusFilter,
    handleCategoryFilter,
    handleSubCategoryFilter,
    handleProductTagFilter,
    handleRefresh,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    updateProductStatusMutation,
    categoriesData,
    subCategoriesData,
  };
};

export const [ProductsContextProvider, useProductsContext] =
  constate(useProducts);
