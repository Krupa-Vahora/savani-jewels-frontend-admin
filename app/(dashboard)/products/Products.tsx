"use client";
import { useMemo } from "react";

import TableToolbar, {
  MultiToolbarFilter,
} from "@/components/common/TableToolbar";
import ProductList from "./components/ProductList";
import { useProductsContext } from "./ProductsContext";
import { statusOptions } from "@/types/common";
import CreateProductForm from "./components/CreateProductForm";
import { Category } from "@/types/category";
import { SubCategory } from "@/types/sub-category";
import { ProductTagFilter } from "@/types/products";
import { productTagOptions } from "./utils";

const Products = () => {
  const {
    createProductModalRef,
    setFocusedProduct,
    searchText,
    statusFilter,
    categoryFilter,
    subCategoryFilter,
    handleSearch,
    handleStatusFilter,
    handleCategoryFilter,
    handleSubCategoryFilter,
    handleRefresh,
    categoriesData,
    subCategoriesData,
    focusedProduct,
    productTag,
    handleProductTagFilter,
  } = useProductsContext();

  const categoriesOptions = useMemo(() => {
    const categories = categoriesData?.data ?? [];
    return categories?.map((cat: Category) => ({
      value: cat?._id,
      label: cat?.name,
    }));
  }, [categoriesData]);

  const subCategoriesOptions = useMemo(() => {
    const subCategories = subCategoriesData?.data ?? [];
    return subCategories.map((subCat: SubCategory) => ({
      value: subCat?._id,
      label: subCat?.name,
    }));
  }, [subCategoriesData]);

  const statusFilterConfig = {
    key: "status",
    label: "Status",
    value: statusFilter,
    options: statusOptions,
    onChange: (value: string) =>
      handleStatusFilter(value as "all" | "active" | "inactive"),
  };

  const categoryFilterConfig = {
    key: "category",
    label: "Category",
    value: categoryFilter,
    options: [{ value: "all", label: "All" }, ...categoriesOptions],
    onChange: (value: string) => handleCategoryFilter(value),
  };

  const subCategoryFilterConfig = {
    key: "subCategory",
    label: "Sub-Category",
    value: subCategoryFilter,
    options: [{ value: "all", label: "All" }, ...subCategoriesOptions],
    onChange: (value: string) => handleSubCategoryFilter(value),
  };

  const productTagFilterConfig: MultiToolbarFilter = {
    key: "productTag",
    label: "Product Tags",
    value: productTag,
    multiple: true,
    options: productTagOptions,
    onChange: (value: string[]) => {
      handleProductTagFilter(value as ProductTagFilter[]);
    },
  };

  const openCreateForm = () => {
    setFocusedProduct(null);
    createProductModalRef.current?.openModal();
  };

  // Build filter array - show all main filters and conditional sub-category filter
  const filters = [
    categoryFilterConfig,
    ...(categoryFilter !== "all" ? [subCategoryFilterConfig] : []),
    statusFilterConfig,
    productTagFilterConfig,
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchValue={searchText}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        filters={filters}
        onAdd={openCreateForm}
        addButtonLabel="Add Product"
      />

      <ProductList />

      <CreateProductForm ref={createProductModalRef} product={focusedProduct} />
    </div>
  );
};

export default Products;
