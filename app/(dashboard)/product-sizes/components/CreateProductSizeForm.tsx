"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AppForm,
  FieldType,
  FormLayout,
  type FormField,
} from "@/components/common/Form";

import { useProductSizeContext } from "../ProductSizesContext";
import {
  ProductSizeFormValues,
  productSizeSchema,
} from "@/validations/product-sizes";
import {
  ProductSize,
  SizeCategory,
  SizeCategoryOptions,
  BraceletTypeOptions,
  getSizeOptions,
} from "@/types/product-sizes";

export interface CreateProductSizeFormRef {
  openModal: () => void;
  closeModal: () => void;
}

const resetFields = {
  sizeCategory: "" as unknown as SizeCategory,
  braceletType: undefined,
  value: "",
  displayOrder: 0,
} as ProductSizeFormValues;

interface CreateProductSizeFormProps {
  productSize?: ProductSize | null;
}

const CreateProductSizeForm = forwardRef<
  CreateProductSizeFormRef,
  CreateProductSizeFormProps
>(({ productSize }, ref) => {
  const { createProductSizeMutation, updateProductSizeMutation } =
    useProductSizeContext();

  const [visible, setVisible] = useState(false);

  const isEditMode = Boolean(productSize?._id);

  const { handleSubmit, reset, control, watch } =
    useForm<ProductSizeFormValues>({
      resolver: zodResolver(productSizeSchema),
      defaultValues: resetFields,
    });

  const selectedCategory = watch("sizeCategory");
  const selectedBraceletType = watch("braceletType");

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

    if (!isEditMode || !productSize) {
      reset(resetFields);
      return;
    }

    reset({
      sizeCategory: productSize?.sizeCategory,
      braceletType: productSize?.braceletType,
      value: productSize?.value ?? "",
      displayOrder: productSize?.displayOrder ?? 0,
    });
  }, [visible, isEditMode, productSize, reset]);

  const onSubmit = async (data: ProductSizeFormValues) => {
    try {
      const payload = {
        sizeCategory: data?.sizeCategory,
        braceletType: data?.braceletType,
        value: data?.value?.trim(),
        displayOrder: data.displayOrder ?? 0,
      };

      if (isEditMode && productSize?._id) {
        await updateProductSizeMutation.mutateAsync({
          id: productSize?._id,
          payload,
        });
      } else {
        await createProductSizeMutation.mutateAsync(payload);
      }

      reset(resetFields);
      setVisible(false);
    } catch (error) {
      console.error("Product size submit error:", error);
    }
  };

  const isSubmitting =
    createProductSizeMutation.isPending || updateProductSizeMutation.isPending;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset(resetFields);
    setVisible(false);
  };

  // Build fields dynamically
  const fields: FormField<ProductSizeFormValues>[] = [
    {
      type: FieldType.Select,
      name: "sizeCategory",
      control,
      label: "Category",
      required: true,
      emptyOptionLabel: "Select Category",
      options: SizeCategoryOptions,
    },
  ];

  // Add braceletType field if bracelet is selected
  if (selectedCategory === SizeCategory.BRACELET) {
    fields.push({
      type: FieldType.Select,
      name: "braceletType",
      control,
      label: "Bracelet Type",
      required: true,
      emptyOptionLabel: "Select Bracelet Type",
      options: BraceletTypeOptions,
    });
  }

  // Add value field with conditional options
  const sizeOptions = getSizeOptions(selectedCategory, selectedBraceletType);
  fields.push({
    type: FieldType.Select,
    name: "value",
    control,
    label: "Size",
    required: true,
    emptyOptionLabel: "Select Size",
    options: sizeOptions,
  });

  // Add display order field
  fields.push({
    type: FieldType.TextField,
    name: "displayOrder",
    control,
    label: "Display Order",
    inputType: "number",
    inputMode: "numeric",
    slotProps: {
      htmlInput: {
        min: 0,
      },
    },
    valueParser: (value) => (value === "" ? undefined : Number(value)),
  });

  return (
    <Dialog open={visible} onClose={handleClose} fullWidth maxWidth="sm">
      <AppForm onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? "Update Product Size" : "Create Product Size"}
        </DialogTitle>

        <DialogContent dividers>
          <FormLayout fields={fields} className="grid grid-cols-1 gap-4 pt-2" />
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
                label: isEditMode ? "Update Size" : "Create Size",
                buttonType: "submit",
                variant: "contained",
                loading: isSubmitting,
              },
            ]}
            className="flex gap-2"
          />
        </DialogActions>
      </AppForm>
    </Dialog>
  );
});

CreateProductSizeForm.displayName = "CreateProductSizeForm";

export default CreateProductSizeForm;
