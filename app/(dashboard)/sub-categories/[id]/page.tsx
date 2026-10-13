"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { getSubCategoryById } from "@/queries/sub-category";
import SubCategoryProducts from "../components/SubCategoryProducts";
import CreateSubCategoryForm, {
  CreateSubCategoryFormRef,
} from "../components/CreateSubCategoryForm";
import { useRef } from "react";
import AppLoader from "@/components/common/AppLoader";
import AppError from "@/components/common/AppError";
import AppEmptyContainer from "@/components/common/AppEmptycontainer";

const SubCategoryDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const formRef = useRef<CreateSubCategoryFormRef>(null);

  const subCategoryId = params?.id as string;

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sub-category", subCategoryId],
    queryFn: () => getSubCategoryById(subCategoryId),
    enabled: Boolean(subCategoryId),
  });

  const subCategory = response?.data;

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError) {
    return <AppError message="Failed to load sub-category details." />;
  }

  if (!subCategory) {
    return <AppEmptyContainer title="no sub category details found" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/sub-categories")}
          />

          <div>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Sub Category Details
            </Typography>
          </div>
        </div>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => {
            formRef?.current?.openModal();
          }}
        >
          Edit Sub Category
        </Button>
      </div>

      {/* Main Information */}
      <Paper elevation={0} className="rounded-xl border p-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Image */}
          <div>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                mb: 1,
              }}
            >
              Sub Category Image
            </Typography>

            {subCategory?.image?.url ? (
              <Box
                component="img"
                src={subCategory?.image?.url}
                alt={subCategory?.image?.alt || subCategory?.name}
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
                  {subCategory?.name?.charAt(0)}
                </Avatar>
              </Box>
            )}
          </div>

          {/* Basic Details */}
          <div className="md:col-span-2">
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {subCategory?.name}
            </Typography>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem label="Sub Category Name" value={subCategory?.name} />

              <DetailItem label="Slug" value={subCategory?.slug} />

              <DetailItem
                label="Category"
                value={subCategory?.category?.name || "-"}
              />

              <DetailItem
                label="Display Order"
                value={String(subCategory?.displayOrder ?? 0)}
              />

              <div>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>

                <div className="mt-1">
                  <Chip
                    label={subCategory?.isActive ? "Active" : "Inactive"}
                    color={subCategory?.isActive ? "success" : "default"}
                    size="small"
                  />
                </div>
              </div>

              <div>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>

                {subCategory?.description ? (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.8,
                    }}
                  >
                    {subCategory.description}
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Banner Image
        </Typography>

        {subCategory?.bannerImage?.url ? (
          <Box
            component="img"
            src={subCategory.bannerImage.url}
            alt={subCategory.bannerImage.alt || `${subCategory.name} banner`}
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
          }}
        >
          SEO Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <div className="grid grid-cols-1 gap-5">
          <DetailItem
            label="SEO Title"
            value={subCategory?.seoTitle || "Not provided"}
          />

          <DetailItem
            label="SEO Description"
            value={subCategory?.seoDescription || "Not provided"}
          />
        </div>
      </Paper>

      {/* Metadata */}
      <Paper elevation={0} className="rounded-xl border p-6">
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
          }}
        >
          Metadata
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailItem
            label="Created By"
            value={subCategory?.createdBy?.name || "-"}
          />

          <DetailItem
            label="Updated By"
            value={subCategory?.updatedBy?.name || "-"}
          />

          <DetailItem
            label="Created At"
            value={formatDate(subCategory?.createdAt)}
          />

          <DetailItem
            label="Updated At"
            value={formatDate(subCategory?.updatedAt)}
          />
        </div>
      </Paper>
      <CreateSubCategoryForm ref={formRef} subCategory={subCategory} />
      <SubCategoryProducts subCategoryId={subCategoryId} />
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

export default SubCategoryDetailsPage;
