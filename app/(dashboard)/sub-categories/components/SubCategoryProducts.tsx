"use client";

import Link from "next/link";
import {
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/queries/products";
import AppLoader from "@/components/common/AppLoader";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";

interface SubCategoryProductsProps {
  subCategoryId: string;
}

interface Product {
  _id: string;
  image?: {
    url?: string;
    alt?: string;
  };
  name?: string;
  slug?: string;
  isActive?: boolean;
}

const SubCategoryProducts = ({ subCategoryId }: SubCategoryProductsProps) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "sub-category", subCategoryId],
    queryFn: () =>
      getProducts({
        subCategory: subCategoryId,
        page: 1,
        limit: 3,
      }),
    enabled: Boolean(subCategoryId),
  });

  const products: Product[] = response?.data ?? [];

  if (isLoading) {
    return (
      <Paper elevation={0} className="rounded-xl border p-6">
        <AppLoader />
      </Paper>
    );
  }

  if (isError) {
    return <AppError message="Failed to load products." />;
  }

  return (
    <Paper elevation={0} className="rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Associated Products
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Products belonging to this sub category
          </Typography>
        </div>

        <Typography variant="body2" color="text.secondary">
          {products?.length} product
          {products?.length !== 1 ? "s" : ""}
        </Typography>
      </div>

      {!products?.length ? (
        <div className="flex justify-center py-10">
          <AppEmptyContainer title="No products found" />
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products?.map((product: Product) => (
                <TableRow key={product?._id} hover>
                  <TableCell>
                    <Avatar
                      src={product?.image?.url}
                      alt={product?.image?.alt || product?.name}
                      variant="rounded"
                      sx={{
                        width: 50,
                        height: 50,
                      }}
                    >
                      {product?.name?.charAt(0)}
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product?.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {product?.slug || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: product?.isActive
                          ? "success.main"
                          : "text.secondary",
                      }}
                    >
                      {product?.isActive ? "Active" : "Inactive"}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      component={Link}
                      href={`/products/${product._id}`}
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default SubCategoryProducts;
