"use client";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Avatar,
  TableSortLabel,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/navigation";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";

import { useCategoryContext } from "../CategoriesContext";
import { Category } from "@/types/category";
import { useState } from "react";
import ConfirmDelete from "@/components/common/ConfirmDelete";
import AppLoader from "@/components/common/AppLoader";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";
import { getApiErrorMessage } from "@/utils/api-error";
import { useSnackbar } from "@/context/SnackbarContext";

const CategoryList = () => {
  const {
    categories,
    getCategoriesQuery,
    deleteCategoryMutation,
    updateCategoryStatusMutation,
    setFocusedCategory,
    createCategoryModalRef,
    focusedCategory,
    handleSort,
    filterParams,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
  } = useCategoryContext();

  const router = useRouter();
  const { showError } = useSnackbar();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openEditForm = (category: Category) => {
    setFocusedCategory(category);
    createCategoryModalRef.current?.openModal();
  };

  if (getCategoriesQuery?.isLoading) {
    return <AppLoader />;
  }

  if (getCategoriesQuery?.isError) {
    return <AppError message="Failed to load categories." />;
  }

  const handleDeleteClick = (category: Category) => {
    setFocusedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleteCategoryMutation?.isPending) {
      return;
    }
    setDeleteDialogOpen(false);
    setFocusedCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!focusedCategory?._id) return;
    try {
      await deleteCategoryMutation.mutateAsync(focusedCategory._id);
      setDeleteDialogOpen(false);
      setFocusedCategory(null);
    } catch (error) {
      showError(getApiErrorMessage(error));
      console.error("Delete category error:", error);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100} className="font-bold">
                Image
              </TableCell>

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
            {categories?.map((category: Category) => (
              <TableRow
                key={category?._id}
                hover
                onClick={() => router.push(`/categories/${category?._id}`)}
              >
                <TableCell>
                  <Avatar
                    src={category?.image?.url || undefined}
                    alt={category?.image?.alt || category?.name}
                    variant="rounded"
                    sx={{
                      width: 72,
                      height: 72,
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #e5e5e5",
                    }}
                    slotProps={{
                      img: {
                        style: {
                          objectFit: "contain",
                          width: "100%",
                          height: "100%",
                          padding: "4px",
                        },
                      },
                    }}
                  >
                    {category?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>
                    {category?.name}
                  </Typography>
                </TableCell>

                <TableCell>{category?.slug}</TableCell>

                <TableCell>{category?.displayOrder}</TableCell>

                <TableCell onClick={(event) => event?.stopPropagation()}>
                  <Switch
                    checked={category?.isActive}
                    onChange={() =>
                      updateCategoryStatusMutation.mutate({
                        id: category?._id,
                        isActive: !category?.isActive,
                      })
                    }
                    disabled={updateCategoryStatusMutation.isPending}
                  />
                </TableCell>

                <TableCell
                  align="right"
                  onClick={(event) => event?.stopPropagation()}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      color="info"
                      onClick={() => openEditForm(category)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(category)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {categories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <AppEmptyContainer
                    title="No categories found"
                    description="Try changing your search or filters."
                  />
                </TableCell>
              </TableRow>
            )}
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
        title="Remove Category?"
        itemName={focusedCategory?.name}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteCategoryMutation.isPending}
      />
    </>
  );
};

export default CategoryList;
