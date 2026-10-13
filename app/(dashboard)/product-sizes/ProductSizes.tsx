"use client";

import TableToolbar from "@/components/common/TableToolbar";
import CreateProductSizeForm from "./components/CreateProductSizeForm";
import ProductSizeList from "./components/ProductSizeList";
import { useProductSizeContext } from "./ProductSizesContext";
import { statusOptions } from "@/types/common";
import {
  SizeCategoryOptions,
  BraceletTypeOptions,
  SizeCategory,
} from "@/types/product-sizes";

const ProductSizes = () => {
  const {
    createProductSizeModalRef,
    focusedProductSize,
    setFocusedProductSize,
    searchText,
    statusFilter,
    sizeCategory,
    braceletTypeFilter,
    handleSearch,
    handleStatusFilter,
    handleSizeCategoryFilter,
    handleBraceletTypeFilter,
    handleRefresh,
  } = useProductSizeContext();

  const sizeCategoryFilterConfig = {
    key: "sizeCategory",
    label: "Category",
    value: sizeCategory,
    options: [{ value: "all", label: "All" }, ...SizeCategoryOptions],
    onChange: (value: string) => handleSizeCategoryFilter(value),
  };

  const braceletTypeFilterConfig = {
    key: "braceletType",
    label: "Bracelet Type",
    value: braceletTypeFilter,
    options: [{ value: "all", label: "All" }, ...BraceletTypeOptions],
    onChange: (value: string) => handleBraceletTypeFilter(value),
  };

  const statusFilterConfig = {
    key: "status",
    label: "Status",
    value: statusFilter,
    options: statusOptions,

    onChange: (value: string) =>
      handleStatusFilter(value as "all" | "active" | "inactive"),
  };

  const openCreateForm = () => {
    setFocusedProductSize(null);
    createProductSizeModalRef.current?.openModal();
  };

  // Build filter array - only show braceletType filter if BRACELET is selected
  const filters = [
    sizeCategoryFilterConfig,
    ...(sizeCategory === SizeCategory.BRACELET
      ? [braceletTypeFilterConfig]
      : []),
    statusFilterConfig,
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchValue={searchText}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        filters={filters}
        onAdd={openCreateForm}
        addButtonLabel="Add Size"
      />

      <ProductSizeList />

      <CreateProductSizeForm
        ref={createProductSizeModalRef}
        productSize={focusedProductSize}
      />
    </div>
  );
};

export default ProductSizes;
