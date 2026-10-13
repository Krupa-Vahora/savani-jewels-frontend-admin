"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { SubCategory } from "@/types/sub-category";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";

interface CategorySubCategoryListProps {
  subCategories: SubCategory[];
}

const CategorySubCategoryList = ({
  subCategories,
}: CategorySubCategoryListProps) => {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/sub-categories/${id}`);
  };

  if (!subCategories?.length) {
    return <AppEmptyContainer title="No sub-categories found" />;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Display Order</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {subCategories?.map((subCategory) => (
            <TableRow
              key={subCategory?._id}
              hover
              onClick={() => handleRowClick(subCategory?._id)}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <TableCell>
                <Avatar
                  src={subCategory?.image?.url}
                  alt={subCategory?.image?.alt || subCategory?.name}
                  variant="rounded"
                  sx={{
                    width: 52,
                    height: 52,
                  }}
                >
                  {subCategory?.name?.charAt(0)}
                </Avatar>
              </TableCell>

              <TableCell>
                <Typography sx={{ fontWeight: 500 }}>
                  {subCategory?.name}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {subCategory?.slug}
                </Typography>
              </TableCell>

              <TableCell>{subCategory?.displayOrder ?? 0}</TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500 }}
                  color={
                    subCategory?.isActive ? "success.main" : "text.secondary"
                  }
                >
                  {subCategory?.isActive ? "Active" : "Inactive"}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategorySubCategoryList;
