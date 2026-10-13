"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Switch,
  IconButton,
  TablePagination,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";

import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";
import AppLoader from "@/components/common/AppLoader";
import { useProductsContext } from "../ProductsContext";
import { Product } from "@/types/products";
import ConfirmDelete from "@/components/common/ConfirmDelete";

const ProductList = () => {
  const router = useRouter();

  const {
    products,
    pagination,
    filterParams,
    getProductsQuery,
    setFocusedProduct,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    deleteProductMutation,
    updateProductStatusMutation,
    createProductModalRef,
    focusedProduct,
  } = useProductsContext();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProductMutation.mutateAsync(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setFocusedProduct(product);
    createProductModalRef.current?.openModal();
  };

  const handleStatusToggle = async (product: Product) => {
    await updateProductStatusMutation.mutateAsync({
      id: product._id,
      isActive: !product.isActive,
    });
  };

  if (getProductsQuery?.isLoading) {
    return <AppLoader title="Loading products..." />;
  }

  if (getProductsQuery?.isError) {
    return (
      <AppError
        message="Failed to load products"
        retry={() => getProductsQuery?.refetch()}
      />
    );
  }

  if (!products?.length) {
    return <AppEmptyContainer title="No products found." />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100} className="font-bold">
                Image
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams?.sortBy === "name"}
                  direction={
                    filterParams.sortBy === "name"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("name")}
                >
                  Product Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams?.sortBy === "productCode"}
                  direction={
                    filterParams.sortBy === "productCode"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("productCode")}
                >
                  Product Code
                </TableSortLabel>
              </TableCell>
              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams?.sortBy === "category"}
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
                  active={filterParams?.sortBy === "subCategory"}
                  direction={
                    filterParams.sortBy === "subCategory"
                      ? filterParams.sortOrder
                      : "asc"
                  }
                  onClick={() => handleSort("subCategory")}
                >
                  Sub-Category
                </TableSortLabel>
              </TableCell>

              <TableCell className="font-bold">
                <TableSortLabel
                  active={filterParams?.sortBy === "isActive"}
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
            {products?.map((product: Product) => {
              const primaryImage = product?.images?.[0];
              return (
                <TableRow
                  key={product?._id}
                  onClick={() => router.push(`/products/${product?._id}`)}
                >
                  <TableCell>
                    <Avatar
                      src={primaryImage?.url || undefined}
                      alt={primaryImage?.alt || product?.name}
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
                      {product?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{product?.name}</TableCell>
                  <TableCell>{product?.productCode}</TableCell>
                  <TableCell>
                    {typeof product.category === "object"
                      ? product.category?.name
                      : product.category}
                  </TableCell>
                  <TableCell>
                    {typeof product.subCategory === "object"
                      ? product.subCategory?.name
                      : product.subCategory}
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={product?.isActive}
                      onChange={() => handleStatusToggle(product)}
                      disabled={updateProductStatusMutation.isPending}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(product)}
                      title="Edit"
                    >
                      <EditIcon className="text-blue-600" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(product?._id)}
                      title="Delete"
                    >
                      <DeleteIcon className="text-red-600" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

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
        itemName={focusedProduct?.name}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteProductMutation.isPending}
      />
    </>
  );
};

export default ProductList;
