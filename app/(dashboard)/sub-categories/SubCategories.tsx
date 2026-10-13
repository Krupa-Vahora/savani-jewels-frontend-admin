"use client";

import TableToolbar from "@/components/common/TableToolbar";
import SubCategoriesList from "./components/SubCategoriesList";
import CreateSubCategoryForm from "./components/CreateSubCategoryForm";
import { useSubCategoriesContext } from "./SubCategoriesContext";
import { statusOptions } from "@/types/common";

const SubCategories = () => {
  const {
    searchText,
    handleRefresh,
    handleStatusFilter,
    statusFilter,
    categoryFilter,
    handleCategoryFilter,
    handleSearch,
    createSubCategoryModalRef,
    setFocusedSubCategory,
    categories,
    focusedSubCategory,
  } = useSubCategoriesContext();

  const categoryFilterConfig = {
    key: "category",
    label: "Category",
    value: categoryFilter,
    options:
      categories?.map((category) => ({
        value: category._id,
        label: category.name,
      })) ?? [],
    onChange: handleCategoryFilter,
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
    setFocusedSubCategory(null);
    createSubCategoryModalRef?.current?.openModal();
  };

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchValue={searchText}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        filters={[categoryFilterConfig, statusFilterConfig]}
        onAdd={openCreateForm}
        addButtonLabel="Add Sub Category"
      />

      <SubCategoriesList />

      <CreateSubCategoryForm
        ref={createSubCategoryModalRef}
        subCategory={focusedSubCategory}
      />
    </div>
  );
};

export default SubCategories;
