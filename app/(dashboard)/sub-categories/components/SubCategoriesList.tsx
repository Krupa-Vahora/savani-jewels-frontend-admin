"use client";

import { useState } from "react";
import {
  Avatar,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { SubCategory } from "@/types/sub-category";
import { useSubCategoriesContext } from "../SubCategoriesContext";
import ConfirmDelete from "@/components/common/ConfirmDelete";
import AppLoader from "@/components/common/AppLoader";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";
import { getApiErrorMessage } from "@/utils/api-error";
import { useSnackbar } from "@/context/SnackbarContext";

const SubCategoriesList = () => {
  const {
    subCategories,
    getSubCategoriesQuery,
    createSubCategoryModalRef,
    focusedSubCategory,
    setFocusedSubCategory,
    deleteSubCategoryMutation,
    updateSubCategoryStatusMutation,
    filterParams,
    handleSort,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
  } = useSubCategoriesContext();
  const router = useRouter();
  const { showError } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (subCategory: SubCategory) => {
    setFocusedSubCategory(subCategory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleteSubCategoryMutation?.isPending) {
      return;
    }
    setDeleteDialogOpen(false);
    setFocusedSubCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!focusedSubCategory?._id) return;
    try {
      await deleteSubCategoryMutation.mutateAsync(focusedSubCategory?._id);
      setDeleteDialogOpen(false);
      setFocusedSubCategory(null);
    } catch (error) {
      showError(getApiErrorMessage(error));
      console.error("Delete category error:", error);
    }
  };

  const openEditForm = (subCategory: SubCategory) => {
    setFocusedSubCategory(subCategory);
    createSubCategoryModalRef?.current?.openModal();
  };

  if (getSubCategoriesQuery?.isLoading) {
    return <AppLoader />;
  }

  if (getSubCategoriesQuery?.isError) {
    return <AppError message="Failed to load sub-categories." />;
  }

  if (!subCategories?.length) {
    return (
      <AppEmptyContainer
        title="No sub-categories found"
        description="Try changing your search or filters."
      />
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Image</TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams.sortBy === "name"}
                  direction={
                    filterParams.sortBy === "name"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams.sortBy === "category"}
                  direction={
                    filterParams.sortBy === "category"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams.sortBy === "slug"}
                  direction={
                    filterParams.sortBy === "slug"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("slug")}
                >
                  Slug
                </TableSortLabel>
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams.sortBy === "displayOrder"}
                  direction={
                    filterParams.sortBy === "displayOrder"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("displayOrder")}
                >
                  Display Order
                </TableSortLabel>
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams.sortBy === "isActive"}
                  direction={
                    filterParams.sortBy === "isActive"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("isActive")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" className="font-bold">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subCategories?.map((subCategory: SubCategory) => (
              <TableRow
                key={subCategory?._id}
                hover
                onClick={() =>
                  router.push(`/sub-categories/${subCategory?._id}`)
                }
              >
                <TableCell>
                  <Avatar
                    src={subCategory?.image?.url || undefined}
                    alt={subCategory?.image?.alt || subCategory?.name}
                    variant="rounded"
                    sx={{
                      width: 52,
                      height: 52,
                    }}
                  >
                    {subCategory?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <Typography
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    {subCategory?.name}
                  </Typography>
                </TableCell>

                <TableCell>{subCategory?.category?.name || "-"}</TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {subCategory?.slug}
                  </Typography>
                </TableCell>

                <TableCell>{subCategory?.displayOrder ?? 0}</TableCell>

                <TableCell onClick={(event) => event?.stopPropagation()}>
                  <Switch
                    checked={subCategory?.isActive}
                    onChange={() =>
                      updateSubCategoryStatusMutation.mutate({
                        id: subCategory._id,
                        isActive: !subCategory.isActive,
                      })
                    }
                  />
                </TableCell>

                <TableCell
                  align="right"
                  onClick={(event) => event?.stopPropagation()}
                >
                  <IconButton
                    color="info"
                    onClick={() => openEditForm(subCategory)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(subCategory)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination?.total ?? 0}
          page={(filterParams?.page ?? 1) - 1}
          rowsPerPage={filterParams?.limit ?? 10}
          onPageChange={(_, page) => handlePageChange(page)}
          onRowsPerPageChange={(event) =>
            handleRowsPerPageChange(Number(event.target.value))
          }
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>
      <ConfirmDelete
        open={deleteDialogOpen}
        title="Remove Sub-Category?"
        itemName={focusedSubCategory?.name}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteSubCategoryMutation?.isPending}
      />
    </>
  );
};

export default SubCategoriesList;
