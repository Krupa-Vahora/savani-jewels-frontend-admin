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

import { useProductAttributeContext } from "../ProductAttributesContext";
import {
  ProductAttributeFormValues,
  productAttributeSchema,
} from "@/validations/product-attributes";
import {
  ProductAttribute,
  ProductAttributeType,
  ProductAttributeTypeOptions,
} from "@/types/product-attributes";

export interface CreateProductAttributeFormRef {
  openModal: () => void;
  closeModal: () => void;
}

const resetFields: ProductAttributeFormValues = {
  attributeType: "",
  value: "",
  displayOrder: 0,
};

interface CreateProductAttributeFormProps {
  productAttribute?: ProductAttribute | null;
}

const CreateProductAttributeForm = forwardRef<
  CreateProductAttributeFormRef,
  CreateProductAttributeFormProps
>(({ productAttribute }, ref) => {
  const { createProductAttributeMutation, updateProductAttributeMutation } =
    useProductAttributeContext();

  const [visible, setVisible] = useState(false);

  const isEditMode = Boolean(productAttribute?._id);

  const { handleSubmit, reset, control } = useForm<ProductAttributeFormValues>({
    resolver: zodResolver(productAttributeSchema),
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

    if (!isEditMode || !productAttribute) {
      reset(resetFields);
      return;
    }

    reset({
      attributeType: productAttribute?.attributeType ?? "",
      value: productAttribute?.value ?? "",
      displayOrder: productAttribute?.displayOrder ?? 0,
    });
  }, [visible, isEditMode, productAttribute, reset]);

  const onSubmit = async (data: ProductAttributeFormValues) => {
    try {
      const payload = {
        attributeType: data?.attributeType as ProductAttributeType,
        value: data?.value?.trim(),
        displayOrder: data.displayOrder ?? 0,
      };

      if (isEditMode && productAttribute?._id) {
        await updateProductAttributeMutation.mutateAsync({
          id: productAttribute?._id,
          payload,
        });
      } else {
        await createProductAttributeMutation.mutateAsync(payload);
      }

      reset(resetFields);
      setVisible(false);
    } catch (error) {
      console.error("Product attribute submit error:", error);
    }
  };

  const isSubmitting =
    createProductAttributeMutation.isPending ||
    updateProductAttributeMutation.isPending;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset(resetFields);
    setVisible(false);
  };

  const fields: FormField<ProductAttributeFormValues>[] = [
    {
      type: FieldType.Select,
      name: "attributeType",
      control,
      label: "Attribute Type",
      required: true,
      emptyOptionLabel: "Select Attribute Type",

      options: ProductAttributeTypeOptions ?? [],
    },

    {
      type: FieldType.TextField,
      name: "value",
      control,
      label: "Value",
      placeholder: "Enter attribute value",
      required: true,
    },
    {
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
    },
  ];

  return (
    <Dialog open={visible} onClose={handleClose} fullWidth maxWidth="sm">
      <AppForm onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? "Update Product Attribute" : "Create Product Attribute"}
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
                label: isEditMode ? "Update Attribute" : "Create Attribute",
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

CreateProductAttributeForm.displayName = "CreateProductAttributeForm";

export default CreateProductAttributeForm;
