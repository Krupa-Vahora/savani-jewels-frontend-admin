"use client";

import { Box, Button, Paper, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getSubCategories } from "@/queries/sub-category";
import CategorySubCategoryList from "./CategorySubCategoryList";
import AppLoader from "@/components/common/AppLoader";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";

interface CategorySubCategoriesProps {
  categoryId: string;
}

const CategorySubCategories = ({ categoryId }: CategorySubCategoriesProps) => {
  const router = useRouter();

  const {
    data: subCategoriesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category-sub-categories", categoryId],
    queryFn: () =>
      getSubCategories({
        category: categoryId,
        page: 1,
        limit: 3,
      }),

    enabled: Boolean(categoryId),
  });

  const subCategories = subCategoriesData?.data ?? [];

  const handleViewAll = () => {
    router?.push(`/sub-categories?categoryId=${categoryId}`);
  };

  if (isLoading) {
    return (
      <Paper elevation={0} className="rounded-xl border p-6">
        <AppLoader />
      </Paper>
    );
  }

  if (isError) {
    return <AppError message="Failed to load sub-categories." />;
  }

  if (!subCategories?.length) {
    <AppEmptyContainer title="No sub-categories found" />;
  }

  return (
    <Paper elevation={0} className="rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sub Categories
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Sub categories belonging to this category
          </Typography>
        </div>

        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>

      {!isLoading && !isError && subCategories?.length > 0 && (
        <CategorySubCategoryList subCategories={subCategories} />
      )}
    </Paper>
  );
};

export default CategorySubCategories;
