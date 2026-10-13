"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { useCategoryContext } from "../CategoriesContext";

import {
  CategoryFormValues,
  categorySchema,
} from "@/validations/category-validation";

import { Category } from "@/types/category";
import {
  AppForm,
  FieldType,
  FormLayout,
  type FormField,
} from "@/components/common/Form";
import { getApiErrorMessage } from "@/utils/api-error";
import { useSnackbar } from "@/context/SnackbarContext";

export interface CreateCategoryFormRef {
  openModal: () => void;
  closeModal: () => void;
}

export const resetFields: CategoryFormValues = {
  name: "",
  description: "",
  image: {
    url: "",
    alt: "",
  },
  bannerImage: {
    url: "",
    alt: "",
  },
  displayOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

interface CreateCategoryFormProps {
  category?: Category | null;
}

const CreateCategoryForm = forwardRef<
  CreateCategoryFormRef,
  CreateCategoryFormProps
>(({ category }, ref) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const { showError } = useSnackbar();
  const { createCategoryMutation, updateCategoryMutation } =
    useCategoryContext();

  const categoryId = useMemo(() => category?._id, [category]);
  const isEditMode = Boolean(categoryId);

  const { handleSubmit, reset, control } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: resetFields,
  });

  useImperativeHandle(
    ref,
    () => ({
      openModal: () => {
        setVisible(true);
      },

      closeModal: () => {
        setVisible(false);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (!categoryId || !category) {
      reset(resetFields);
      return;
    }

    reset({
      name: category?.name ?? "",
      description: category?.description ?? "",
      image: {
        url: category?.image?.url ?? "",
        alt: category?.image?.alt ?? "",
      },
      bannerImage: {
        url: category?.bannerImage?.url ?? "",
        alt: category?.bannerImage?.alt ?? "",
      },
      displayOrder: category?.displayOrder ?? 0,
      seoTitle: category?.seoTitle ?? "",
      seoDescription: category?.seoDescription ?? "",
    });
  }, [visible, categoryId, category, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const payload: CategoryFormValues = {
        ...data,
        image:
          data?.image?.url?.trim() || data?.image?.alt?.trim()
            ? {
                url: data?.image?.url?.trim() ?? "",
                alt: data?.image?.alt?.trim() ?? "",
              }
            : undefined,

        bannerImage:
          data?.bannerImage?.url?.trim() || data?.bannerImage?.alt?.trim()
            ? {
                url: data?.bannerImage?.url?.trim() ?? "",
                alt: data?.bannerImage?.alt?.trim() ?? "",
              }
            : undefined,
      };

      if (isEditMode && categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: categoryId,
          payload,
        });

        await queryClient.invalidateQueries({
          queryKey: ["category", categoryId],
        });
      } else {
        await createCategoryMutation.mutateAsync(payload);
      }
      reset(resetFields);
      setVisible(false);
    } catch (error) {
      showError(getApiErrorMessage(error));
      console.error("Category submit error:", error);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset(resetFields);
    setVisible(false);
  };

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  const basicFields: FormField<CategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "name",
      control,
      label: "Category Name",
      placeholder: "Enter category name",
      required: true,
      containerClassName: "md:col-span-1",
    },
    {
      type: FieldType.TextField,
      name: "displayOrder",
      control,
      label: "Display Order",
      inputType: "number",
      inputMode: "numeric",
      slotProps: { htmlInput: { min: 0 } },
      valueParser: (value) => (value === "" ? undefined : Number(value)),
    },
    {
      type: FieldType.Textarea,
      name: "description",
      control,
      label: "Description",
      placeholder: "Enter category description",
      containerClassName: "md:col-span-2",
    },
  ];

  const imageFields: FormField<CategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "image.url",
      control,
      label: "Image URL",
      placeholder: "https://...",
    },
    {
      type: FieldType.TextField,
      name: "image.alt",
      control,
      label: "Image Alt Text",
      placeholder: "Describe the image",
    },
  ];

  const bannerImageFields: FormField<CategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "bannerImage.url",
      control,
      label: "Banner Image URL",
      placeholder: "https://...",
    },
    {
      type: FieldType.TextField,
      name: "bannerImage.alt",
      control,
      label: "Banner Image Alt Text",
      placeholder: "Describe the banner image",
    },
  ];

  const seoFields: FormField<CategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "seoTitle",
      control,
      label: "SEO Title",
      placeholder: "Enter SEO title",
    },
    {
      type: FieldType.Textarea,
      name: "seoDescription",
      control,
      label: "SEO Description",
      placeholder: "Enter SEO description",
    },
  ];

  return (
    <Dialog open={visible} onClose={handleClose} fullWidth maxWidth="md">
      <AppForm onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? "Update Category" : "Create Category"}
        </DialogTitle>

        <DialogContent dividers>
          <div className="flex flex-col gap-6 pt-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Basic Information</h3>
              <FormLayout
                fields={basicFields}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Category Image</h3>

              <FormLayout
                fields={imageFields}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                Optional. Add the image URL and alternative text.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Banner Image</h3>

              <FormLayout
                fields={bannerImageFields}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              />

              <p className="mt-2 text-sm text-gray-500">
                Optional. Add a banner image for the category.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">SEO Information</h3>

              <FormLayout fields={seoFields} className="flex flex-col gap-4" />
            </div>
          </div>
        </DialogContent>

        <DialogActions className="px-6 py-4">
          <FormLayout
            fields={[
              {
                type: FieldType.Button,
                label: "Cancel",
                variant: "outlined",
                onClick: handleClose,
                disabled: isSubmitting,
              },
              {
                type: FieldType.Button,
                label: isEditMode ? "Update Category" : "Create Category",
                buttonType: "submit",
                variant: "contained",
                loading: isSubmitting,
                loadingText: "Submitting...",
              },
            ]}
            className="flex gap-2"
          />
        </DialogActions>
      </AppForm>
    </Dialog>
  );
});

CreateCategoryForm.displayName = "CreateCategoryForm";

export default CreateCategoryForm;
