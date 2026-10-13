"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSubCategoriesContext } from "../SubCategoriesContext";
import {
  SubCategoryFormValues,
  subCategorySchema,
} from "@/validations/sub-category-validation";
import { SubCategory } from "@/types/sub-category";
import {
  AppForm,
  FieldType,
  FormLayout,
  type FormField,
} from "@/components/common/Form";
import { getApiErrorMessage } from "@/utils/api-error";
import { useSnackbar } from "@/context/SnackbarContext";

export interface CreateSubCategoryFormRef {
  openModal: () => void;
  closeModal: () => void;
}

const resetFields: SubCategoryFormValues = {
  name: "",
  category: "",
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

interface CreateSubCategoryFormProps {
  subCategory?: SubCategory | null;
}

const CreateSubCategoryForm = forwardRef<
  CreateSubCategoryFormRef,
  CreateSubCategoryFormProps
>(({ subCategory }, ref) => {
  const { createSubCategoryMutation, updateSubCategoryMutation, categories } =
    useSubCategoriesContext();
  const { showError } = useSnackbar();

  const [visible, setVisible] = useState(false);

  const isEditMode = Boolean(subCategory?._id);

  const { handleSubmit, reset, control } = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
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
    if (!visible) return;

    if (!isEditMode) {
      reset(resetFields);
      return;
    }

    if (!subCategory) {
      return;
    }
    reset({
      name: subCategory?.name ?? "",
      category: subCategory?.category?._id ?? "",
      description: subCategory?.description ?? "",
      image: {
        url: subCategory?.image?.url ?? "",
        alt: subCategory?.image?.alt ?? "",
      },
      bannerImage: {
        url: subCategory?.bannerImage?.url ?? "",
        alt: subCategory?.bannerImage?.alt ?? "",
      },
      displayOrder: subCategory?.displayOrder ?? 0,
      seoTitle: subCategory?.seoTitle ?? "",
      seoDescription: subCategory?.seoDescription ?? "",
    });
  }, [visible, isEditMode, subCategory, reset]);

  const onSubmit = async (data: SubCategoryFormValues) => {
    try {
      const payload = {
        ...data,
        image: data?.image?.url || data?.image?.alt ? data.image : undefined,
        bannerImage:
          data?.bannerImage?.url || data?.bannerImage?.alt
            ? data.bannerImage
            : undefined,
      };
      if (isEditMode && subCategory?._id) {
        await updateSubCategoryMutation.mutateAsync({
          id: subCategory?._id,
          payload,
        });
      } else {
        await createSubCategoryMutation.mutateAsync(payload);
      }
      reset(resetFields);
      setVisible(false);
    } catch (error) {
      showError(getApiErrorMessage(error));
      console.error("Sub category submit error:", error);
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
    createSubCategoryMutation?.isPending ||
    updateSubCategoryMutation?.isPending;

  const basicFields: FormField<SubCategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "name",
      control,
      label: "Sub Category Name",
      placeholder: "Enter sub category name",
      required: true,
    },
    {
      type: FieldType.Select,
      name: "category",
      control,
      label: "Category",
      required: true,
      emptyOptionLabel: "Select Category",
      options: categories.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    },
    {
      type: FieldType.TextField,
      name: "displayOrder",
      control,
      label: "Display Order",
      inputType: "number",
      slotProps: { htmlInput: { min: 0 } },
      valueParser: (value) => (value === "" ? undefined : Number(value)),
      required: true,
    },
    {
      type: FieldType.Textarea,
      name: "description",
      control,
      label: "Description",
      placeholder: "Enter sub category description",
      containerClassName: "md:col-span-2",
      required: true,
    },
  ];

  const imageFields: FormField<SubCategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "image.url",
      control,
      label: "Image URL",
      placeholder: "https://...",
      required: true,
    },
    {
      type: FieldType.TextField,
      name: "image.alt",
      control,
      label: "Image Alt Text",
      placeholder: "Describe the image",
      required: true,
    },
  ];

  const bannerImageFields: FormField<SubCategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "bannerImage.url",
      control,
      label: "Banner Image URL",
      placeholder: "https://...",
      required: true,
    },
    {
      type: FieldType.TextField,
      name: "bannerImage.alt",
      control,
      label: "Banner Image Alt Text",
      placeholder: "Describe the banner image",
      required: true,
    },
  ];

  const seoFields: FormField<SubCategoryFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "seoTitle",
      control,
      label: "SEO Title",
      placeholder: "Enter SEO title",
      required: true,
    },
    {
      type: FieldType.Textarea,
      name: "seoDescription",
      control,
      label: "SEO Description",
      placeholder: "Enter SEO description",
      required: true,
    },
  ];

  return (
    <Dialog open={visible} onClose={handleClose} fullWidth maxWidth="md">
      <AppForm onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? "Update Sub Category" : "Create Sub Category"}
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
              <h3 className="mb-4 text-lg font-semibold">Sub Category Image</h3>

              <FormLayout
                fields={imageFields}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Banner Image</h3>

              <FormLayout
                fields={bannerImageFields}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              />
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
                label: isEditMode
                  ? "Update Sub Category"
                  : "Create Sub Category",
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

CreateSubCategoryForm.displayName = "CreateSubCategoryForm";

export default CreateSubCategoryForm;
