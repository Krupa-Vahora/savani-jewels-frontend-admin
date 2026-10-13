"use client";

import TableToolbar from "@/components/common/TableToolbar";
import CreateProductAttributeForm from "./components/CreateProductAttributesForm";
import ProductAttributeList from "./components/ProductAttributesList";
import { useProductAttributeContext } from "./ProductAttributesContext";
import { ProductAttributeTypeOptions } from "@/types/product-attributes";
import { statusOptions } from "@/types/common";

const ProductAttributes = () => {
  const {
    createProductAttributeModalRef,
    focusedProductAttribute,
    setFocusedProductAttribute,

    searchText,
    typeFilter,
    statusFilter,

    handleSearch,
    handleTypeFilter,
    handleStatusFilter,
    handleRefresh,
  } = useProductAttributeContext();

  const attributeTypeFilterConfig = {
    key: "attributeType",
    label: "Attribute Type",
    value: typeFilter,
    options: [
      {
        value: "all",
        label: "All",
      },
      ...ProductAttributeTypeOptions,
    ],

    onChange: (value: string) => handleTypeFilter(value as typeof typeFilter),
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
    setFocusedProductAttribute(null);

    createProductAttributeModalRef.current?.openModal();
  };

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchValue={searchText}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        filters={[attributeTypeFilterConfig, statusFilterConfig]}
        onAdd={openCreateForm}
        addButtonLabel="Add Attribute"
      />

      <ProductAttributeList />

      <CreateProductAttributeForm
        ref={createProductAttributeModalRef}
        productAttribute={focusedProductAttribute}
      />
    </div>
  );
};

export default ProductAttributes;
