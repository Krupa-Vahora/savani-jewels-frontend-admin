"use client";

import {
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useProductSizeContext } from "../ProductSizesContext";
import {
  ProductSize,
  formatSizeCategory,
  formatBraceletType,
} from "@/types/product-sizes";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";
import AppLoader from "@/components/common/AppLoader";
import ConfirmDelete from "@/components/common/ConfirmDelete";
import { useState } from "react";
import { getApiErrorMessage } from "@/utils/api-error";
import { useSnackbar } from "@/context/SnackbarContext";

const ProductSizeList = () => {
  const { showError } = useSnackbar();
  const {
    pagination,
    productSizes,
    getProductSizesQuery,
    handleDelete,
    handleEdit,
    handleStatusChange,
    updateProductSizeStatusMutation,
    deleteProductSizeMutation,
    filterParams,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    focusedProductSize,
    setFocusedProductSize,
  } = useProductSizeContext();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (getProductSizesQuery?.isLoading) {
    return <AppLoader />;
  }

  if (getProductSizesQuery?.isError) {
    return (
      <AppError
        message="Failed to load product sizes."
        retry={() => getProductSizesQuery?.refetch()}
      />
    );
  }

  if (!productSizes?.length) {
    return <AppEmptyContainer title="No product sizes found." />;
  }

  const handleDeleteClick = (productSize: ProductSize) => {
    setFocusedProductSize(productSize);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleteProductSizeMutation?.isPending) {
      return;
    }
    setDeleteConfirmOpen(false);
    setFocusedProductSize(null);
  };

  const handleDeleteConfirm = async () => {
    if (!focusedProductSize?._id) return;
    try {
      await deleteProductSizeMutation.mutateAsync(focusedProductSize._id);
      setDeleteConfirmOpen(false);
      setFocusedProductSize(null);
    } catch (error) {
      showError(getApiErrorMessage(error));
      console.error("Delete category error:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">
              <TableSortLabel
                active={filterParams?.sortBy === "sizeCategory"}
                direction={
                  filterParams.sortBy === "sizeCategory"
                    ? filterParams.sortOrder
                    : "asc"
                }
                onClick={() => handleSort("sizeCategory")}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell className="font-bold">
              <TableSortLabel
                active={filterParams?.sortBy === "braceletType"}
                direction={
                  filterParams.sortBy === "braceletType"
                    ? filterParams.sortOrder
                    : "asc"
                }
                onClick={() => handleSort("braceletType")}
              >
                Bracelet Type
              </TableSortLabel>
            </TableCell>
            <TableCell className="font-bold">
              <TableSortLabel
                active={filterParams?.sortBy === "value"}
                direction={
                  filterParams.sortBy === "value"
                    ? filterParams.sortOrder
                    : "asc"
                }
                onClick={() => handleSort("value")}
              >
                Size
              </TableSortLabel>
            </TableCell>
            <TableCell className="font-bold">
              <TableSortLabel
                active={filterParams?.sortBy === "displayOrder"}
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
          {productSizes?.map((size: ProductSize) => (
            <TableRow key={size?._id} hover>
              <TableCell>{formatSizeCategory(size?.sizeCategory)}</TableCell>
              <TableCell>
                {size?.braceletType
                  ? formatBraceletType(size?.braceletType)
                  : "-"}
              </TableCell>
              <TableCell>{size?.value}</TableCell>
              <TableCell>{size?.displayOrder}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    size="small"
                    checked={size?.isActive}
                    onChange={(event) =>
                      handleStatusChange(size?._id, event?.target?.checked)
                    }
                    disabled={updateProductSizeStatusMutation?.isPending}
                  />
                </div>
              </TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => handleEdit(size)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(size)}
                  disabled={deleteProductSizeMutation.isPending}
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
      <ConfirmDelete
        open={deleteConfirmOpen}
        title="Remove Category?"
        itemName={focusedProductSize?.value}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteProductSizeMutation.isPending}
      />
    </div>
  );
};

export default ProductSizeList;
