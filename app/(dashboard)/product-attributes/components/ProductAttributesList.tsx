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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TablePagination } from "@mui/material";

import { useProductAttributeContext } from "../ProductAttributesContext";
import {
  formatAttributeType,
  ProductAttribute,
} from "@/types/product-attributes";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";
import AppLoader from "@/components/common/AppLoader";
import ConfirmDelete from "@/components/common/ConfirmDelete";
import { useSnackbar } from "@/context/SnackbarContext";
import { useState } from "react";
import { getApiErrorMessage } from "@/utils/api-error";

const ProductAttributeList = () => {
  const { showError } = useSnackbar();
  const {
    pagination,
    productAttributes,
    getProductAttributesQuery,
    createProductAttributeModalRef,
    updateProductAttributeStatusMutation,
    deleteProductAttributeMutation,
    filterParams,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    focusedProductAttribute,
    setFocusedProductAttribute,
  } = useProductAttributeContext();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleEdit = (attribute: (typeof productAttributes)[number]) => {
    setFocusedProductAttribute(attribute);
    createProductAttributeModalRef.current?.openModal();
  };

  const handleDeleteClick = (productAttribute: ProductAttribute) => {
    setFocusedProductAttribute(productAttribute);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    if (deleteProductAttributeMutation?.isPending) {
      return;
    }
    setDeleteConfirmOpen(false);
    setFocusedProductAttribute(null);
  };

  const handleDeleteConfirm = async () => {
    if (!focusedProductAttribute?._id) return;
    try {
      await deleteProductAttributeMutation.mutateAsync(
        focusedProductAttribute._id,
      );
      setDeleteConfirmOpen(false);
      setFocusedProductAttribute(null);
    } catch (error) {
      showError(getApiErrorMessage(error));
      console.error("Delete category error:", error);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await updateProductAttributeStatusMutation.mutateAsync({
        id,
        isActive,
      });
    } catch (error) {
      console.error("Update product attribute status error:", error);
    }
  };

  if (getProductAttributesQuery?.isLoading) {
    return <AppLoader />;
  }

  if (getProductAttributesQuery?.isError) {
    return (
      <AppError
        message="Failed to load product attributes."
        retry={() => getProductAttributesQuery?.refetch()}
      />
    );
  }

  if (!productAttributes?.length) {
    return <AppEmptyContainer title="No product attributes found." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">
              <TableSortLabel
                active={filterParams?.sortBy === "attributeType"}
                direction={
                  filterParams.sortBy === "attributeType"
                    ? filterParams.sortOrder
                    : "asc"
                }
                onClick={() => handleSort("attributeType")}
              >
                Type
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
                Name
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
          {productAttributes?.map((attribute: ProductAttribute) => (
            <TableRow key={attribute?._id} hover>
              <TableCell>
                {formatAttributeType(attribute?.attributeType)}
              </TableCell>
              <TableCell>{attribute?.value}</TableCell>
              <TableCell>{attribute?.displayOrder}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    size="small"
                    checked={attribute?.isActive}
                    onChange={(event) =>
                      handleStatusChange(attribute?._id, event?.target?.checked)
                    }
                    disabled={updateProductAttributeStatusMutation?.isPending}
                  />
                </div>
              </TableCell>

              <TableCell align="right">
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => handleEdit(attribute)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(attribute)}
                  disabled={deleteProductAttributeMutation.isPending}
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
        itemName={focusedProductAttribute?.value}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteProductAttributeMutation.isPending}
      />
    </div>
  );
};

export default ProductAttributeList;
