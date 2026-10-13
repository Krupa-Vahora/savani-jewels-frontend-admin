"use client";

import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { Avatar, Box, Button, Chip, Paper, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { getCategoryById } from "@/queries/category";
import CategorySubCategories from "../components/CategorySubCategories";
import CreateCategoryForm, {
  CreateCategoryFormRef,
} from "../components/CreateCategoryForm";
import AppLoader from "@/components/common/AppLoader";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";

const CategoryDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const formRef = useRef<CreateCategoryFormRef>(null);

  const categoryId = params?.id as string;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: Boolean(categoryId),
  });

  const category = useMemo(() => response?.data, [response]);

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError) {
    return (
      <AppError
        message="Failed to load category details."
        retry={() => refetch()}
      />
    );
  }

  if (!category) {
    return <AppEmptyContainer title="No category found" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/categories")}
          />

          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Category Details
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => {
            formRef.current?.openModal();
          }}
        >
          Edit Category
        </Button>
      </div>

      {/* Main Information */}
      <Paper elevation={0} className="rounded-xl border p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Image */}
          <div>
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary", mb: 1 }}
            >
              Category Image
            </Typography>

            {category?.image?.url ? (
              <Box
                component="img"
                src={category?.image?.url}
                alt={category?.image?.alt || category?.name}
                sx={{
                  width: "100%",
                  height: 280,
                  objectFit: "contain",
                  borderRadius: 2,
                  border: "1px solid #eee",
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 280,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 40,
                  }}
                >
                  {category?.name?.charAt(0)}
                </Avatar>
              </Box>
            )}
          </div>

          {/* Basic Details */}
          <div className="md:col-span-2">
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {category?.name}
            </Typography>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem label="Category Name" value={category?.name} />

              <DetailItem label="Slug" value={category?.slug} />

              <DetailItem
                label="Display Order"
                value={String(category?.displayOrder)}
              />

              <div>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>

                <div className="mt-1">
                  <Chip
                    label={category.isActive ? "Active" : "Inactive"}
                    color={category.isActive ? "success" : "default"}
                    size="small"
                  />
                </div>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                {category?.description ? (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.8,
                    }}
                  >
                    {category?.description}
                  </Typography>
                ) : (
                  <Typography color="text.secondary">
                    No description added.
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </div>
      </Paper>

      {/* Banner */}
      <Paper elevation={0} className="rounded-xl border p-6">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Banner Image
        </Typography>

        {category.bannerImage?.url ? (
          <Box
            component="img"
            src={category?.bannerImage?.url}
            alt={category?.bannerImage?.alt || `${category?.name} banner`}
            sx={{
              width: "100%",
              maxHeight: 350,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        ) : (
          <Typography color="text.secondary">No banner image added.</Typography>
        )}
      </Paper>

      {/* SEO */}
      <Paper elevation={0} className="rounded-xl border p-6">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          SEO Information
        </Typography>

        <div className="grid grid-cols-1 gap-5">
          <DetailItem
            label="SEO Title"
            value={category?.seoTitle || "Not provided"}
          />

          <DetailItem
            label="SEO Description"
            value={category?.seoDescription || "Not provided"}
          />
        </div>
      </Paper>
      <CreateCategoryForm ref={formRef} category={category} />
      <CategorySubCategories categoryId={categoryId} />
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 0.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </div>
  );
};

export default CategoryDetailsPage;
