"use client";

import CategoryList from "./components/CategoryList";
import CreateCategoryForm from "./components/CreateCategoryForm";
import { useCategoryContext } from "./CategoriesContext";
import TableToolbar from "@/components/common/TableToolbar";
import { statusOptions } from "@/types/common";

const Categories = () => {
  const {
    createCategoryModalRef,
    focusedCategory,
    setFocusedCategory,
    searchText,
    statusFilter,
    handleSearch,
    handleStatusFilter,
    handleRefresh,
  } = useCategoryContext();

  const statusFilterConfig = {
    key: "status",
    label: "Status",
    value: statusFilter,
    options: statusOptions,
    onChange: (value: string) =>
      handleStatusFilter(value as "all" | "active" | "inactive"),
  };

  const openCreateForm = () => {
    setFocusedCategory(null);
    createCategoryModalRef?.current?.openModal();
  };

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        searchValue={searchText}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        filters={[statusFilterConfig]}
        onAdd={openCreateForm}
        addButtonLabel="Add Category"
      />
      <CategoryList />
      <CreateCategoryForm
        ref={createCategoryModalRef}
        category={focusedCategory}
      />
    </div>
  );
};

export default Categories;
