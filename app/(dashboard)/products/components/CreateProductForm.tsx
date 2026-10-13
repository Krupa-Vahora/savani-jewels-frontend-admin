"use client";

import {
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
import { useQuery } from "@tanstack/react-query";

import {
  AppForm,
  FieldType,
  FormLayout,
  type FormField,
} from "@/components/common/Form";

import { useProductsContext } from "../ProductsContext";

import { getCategories } from "@/queries/category";
import { getSubCategories } from "@/queries/sub-category";
import { getProductAttributes } from "@/queries/product-attributes";
import { getProductSizes } from "@/queries/product-sizes";

import { Category } from "@/types/category";
import { SubCategory } from "@/types/sub-category";
import { ProductSize } from "@/types/product-sizes";

import { ProductFormValues, productSchema } from "@/validations/products";

import type { Product } from "@/types/products";
import { getId, getIds, normalizeMedia, SIZE_CATEGORY_MAP } from "../utils";

export interface CreateProductFormRef {
  openModal: () => void;
  closeModal: () => void;
}

interface CreateProductFormProps {
  product?: Product | null;
}

const resetFields: ProductFormValues = {
  name: "",
  slug: "",
  productCode: "",
  sku: "",

  category: "",
  subCategory: "",

  goldPurities: [],
  goldColors: [],
  diamondTypes: [],
  diamondQualities: [],
  diamondColors: [],
  certificates: [],

  availableSizes: [],

  grossWeight: 0,
  netWeight: 0,

  diamondWeight: undefined,
  diamondPieces: undefined,

  centerStoneWeight: undefined,
  centerStonePieces: undefined,

  shortDescription: "",
  description: "",
  specifications: "",

  images: [],
  videos: [],

  seoTitle: "",
  seoDescription: "",

  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
};

const CreateProductForm = forwardRef<
  CreateProductFormRef,
  CreateProductFormProps
>(({ product }, ref) => {
  const { createProductMutation, updateProductMutation } = useProductsContext();

  const [visible, setVisible] = useState(false);

  const isEditMode = Boolean(product?._id);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<ProductFormValues>({
      resolver: zodResolver(productSchema),
      defaultValues: resetFields,
    });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-all-form"],
    queryFn: () =>
      getCategories({
        page: 1,
        limit: 1000,
        isActive: true,
      }),
  });

  const selectedCategory = watch("category");
  const selectedSizes = watch("availableSizes");

  const selectedCategoryData = useMemo(() => {
    return (categoriesData?.data ?? []).find(
      (category: Category) => category._id === selectedCategory,
    );
  }, [categoriesData, selectedCategory]);

  const categoriesOptions = useMemo(() => {
    return (categoriesData?.data ?? []).map((category: Category) => ({
      value: category?._id,
      label: category?.name,
    }));
  }, [categoriesData]);

  const { data: subCategoriesData } = useQuery({
    queryKey: ["sub-categories-form", selectedCategory],
    queryFn: () =>
      getSubCategories({
        page: 1,
        limit: 1000,
        category: selectedCategory,
        isActive: true,
      }),
    enabled: Boolean(selectedCategory),
  });

  const subCategoriesOptions = useMemo(() => {
    return (subCategoriesData?.data ?? []).map((subCategory: SubCategory) => ({
      value: subCategory._id,
      label: subCategory.name,
    }));
  }, [subCategoriesData]);

  const { data: attributesData } = useQuery({
    queryKey: ["product-attributes-all-form"],
    queryFn: () =>
      getProductAttributes({
        page: 1,
        limit: 1000,
        isActive: true,
      }),
  });

  const attributesByType = useMemo(() => {
    const grouped: Record<string, Array<{ value: string; label: string }>> = {};

    for (const attribute of attributesData?.data ?? []) {
      const type = attribute.attributeType;

      if (!grouped[type]) {
        grouped[type] = [];
      }

      grouped[type].push({
        value: attribute._id,
        label: attribute.value,
      });
    }

    return grouped;
  }, [attributesData]);

  const { data: sizesData } = useQuery({
    queryKey: ["product-sizes-all-form"],
    queryFn: () =>
      getProductSizes({
        page: 1,
        limit: 1000,
        isActive: true,
      }),
  });

  const sizesOptions = useMemo(() => {
    const categorySlug = selectedCategoryData?.slug?.toLowerCase();

    if (!categorySlug) {
      return [];
    }

    const sizeCategory = SIZE_CATEGORY_MAP[categorySlug];

    if (!sizeCategory) {
      return [];
    }

    return (sizesData?.data ?? [])
      .filter(
        (size: ProductSize) =>
          size.sizeCategory?.toLowerCase() === sizeCategory.toLowerCase(),
      )
      .map((size: ProductSize) => ({
        value: size._id,
        label: `${size.value}${
          size.braceletType ? ` (${size.braceletType})` : ""
        }`,
      }));
  }, [sizesData, selectedCategoryData]);
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

    if (!isEditMode || !product) {
      reset(resetFields);
      return;
    }

    reset({
      name: product.name ?? "",
      slug: product.slug ?? "",
      productCode: product.productCode ?? "",
      sku: product.sku ?? "",
      category: getId(product.category),
      subCategory: getId(product.subCategory),
      goldPurities: getIds(product.goldPurities),
      goldColors: getIds(product.goldColors),
      diamondTypes: getIds(product.diamondTypes),
      diamondQualities: getIds(product.diamondQualities),
      diamondColors: getIds(product.diamondColors),
      certificates: getIds(product.certificates),
      availableSizes: getIds(product.availableSizes),
      grossWeight: product.grossWeight ?? 0,
      netWeight: product.netWeight ?? 0,
      diamondWeight: product.diamondWeight ?? undefined,
      diamondPieces: product.diamondPieces ?? undefined,
      centerStoneWeight: product.centerStoneWeight ?? undefined,
      centerStonePieces: product.centerStonePieces ?? undefined,
      shortDescription: product.shortDescription ?? "",
      description: product.description ?? "",
      specifications: product.specifications ?? "",
      images: normalizeMedia(product.images) as ProductFormValues["images"],
      videos: normalizeMedia(product.videos) as ProductFormValues["videos"],
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
      isFeatured: Boolean(product.isFeatured),
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival),
    });
  }, [visible, isEditMode, product, reset]);

  useEffect(() => {
    if (!selectedCategory) {
      if (selectedSizes?.length) {
        setValue("availableSizes", []);
      }
      return;
    }

    const categorySlug = selectedCategoryData?.slug?.toLowerCase();

    const requiredSizeCategory = SIZE_CATEGORY_MAP[categorySlug ?? ""] ?? null;

    // Necklace, pendant, earring, etc.
    if (!requiredSizeCategory) {
      if (selectedSizes?.length) {
        setValue("availableSizes", []);
      }
      return;
    }

    const validSizeIds = sizesOptions?.map((size) => size.value);

    const filteredSizes = selectedSizes?.filter((id) =>
      validSizeIds.includes(id),
    );

    if (filteredSizes?.length !== selectedSizes?.length) {
      setValue("availableSizes", filteredSizes);
    }
  }, [
    selectedCategory,
    selectedCategoryData,
    selectedSizes,
    sizesOptions,
    setValue,
  ]);
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload: ProductFormValues = {
        name: data?.name?.trim(),
        slug: data?.slug?.trim(),
        productCode: data?.productCode?.trim(),
        sku: data?.sku?.trim(),
        category: getId(data?.category),
        subCategory: getId(data?.subCategory),
        goldPurities: getIds(data?.goldPurities),
        goldColors: getIds(data?.goldColors),
        diamondTypes: getIds(data?.diamondTypes),
        diamondQualities: getIds(data?.diamondQualities),
        diamondColors: getIds(data?.diamondColors),
        certificates: getIds(data?.certificates),
        availableSizes: getIds(data?.availableSizes),
        grossWeight: Number(data?.grossWeight),
        netWeight: Number(data?.netWeight),
        diamondWeight:
          data?.diamondWeight === undefined || data?.diamondWeight === null
            ? undefined
            : Number(data?.diamondWeight),
        diamondPieces:
          data?.diamondPieces === undefined || data?.diamondPieces === null
            ? undefined
            : Number(data?.diamondPieces),
        centerStoneWeight:
          data?.centerStoneWeight === undefined ||
          data?.centerStoneWeight === null
            ? undefined
            : Number(data?.centerStoneWeight),
        centerStonePieces:
          data?.centerStonePieces === undefined ||
          data?.centerStonePieces === null
            ? undefined
            : Number(data?.centerStonePieces),
        shortDescription: data?.shortDescription?.trim() ?? "",
        description: data?.description?.trim() ?? "",
        specifications: data?.specifications?.trim() ?? "",
        images: data?.images ?? [],
        videos: data?.videos ?? [],
        seoTitle: data?.seoTitle?.trim() ?? "",
        seoDescription: data?.seoDescription?.trim() ?? "",
        isFeatured: Boolean(data?.isFeatured),
        isBestSeller: Boolean(data?.isBestSeller),
        isNewArrival: Boolean(data?.isNewArrival),
      };

      if (isEditMode && product?._id) {
        await updateProductMutation.mutateAsync({
          id: product._id,
          payload,
        });
      } else {
        await createProductMutation.mutateAsync(payload);
      }

      reset(resetFields);
      setVisible(false);
    } catch (error) {
      console.error("Product submit error:", error);
    }
  };

  const isSubmitting =
    createProductMutation.isPending || updateProductMutation.isPending;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset(resetFields);
    setVisible(false);
  };

  const fields: FormField<ProductFormValues>[] = [
    {
      type: FieldType.TextField,
      name: "name",
      control,
      label: "Product Name",
      required: true,
      placeholder: "Enter product name",
    },

    {
      type: FieldType.TextField,
      name: "slug",
      control,
      label: "Slug",
      required: true,
      placeholder: "Enter URL-friendly slug",
    },

    {
      type: FieldType.TextField,
      name: "productCode",
      control,
      label: "Product Code",
      required: true,
      placeholder: "Enter product code",
    },

    {
      type: FieldType.TextField,
      name: "sku",
      control,
      label: "SKU",
      required: true,
      placeholder: "Enter SKU",
    },

    {
      type: FieldType.Select,
      name: "category",
      control,
      label: "Category",
      required: true,
      emptyOptionLabel: "Select Category",
      options: categoriesOptions,
    },

    {
      type: FieldType.Select,
      name: "subCategory",
      control,
      label: "Sub Category",
      required: true,
      emptyOptionLabel: "Select Sub Category",
      options: subCategoriesOptions,
      disabled: !selectedCategory,
    },

    {
      type: FieldType.TextField,
      name: "grossWeight",
      control,
      label: "Gross Weight",
      required: true,
      inputType: "number",
      inputMode: "decimal",
      slotProps: {
        htmlInput: {
          min: 0,
          step: "0.01",
        },
      },
      valueParser: (value) => (value === "" ? 0 : Number(value)),
    },

    {
      type: FieldType.TextField,
      name: "netWeight",
      control,
      label: "Net Weight",
      required: true,
      inputType: "number",
      inputMode: "decimal",
      slotProps: {
        htmlInput: {
          min: 0,
          step: "0.01",
        },
      },
      valueParser: (value) => (value === "" ? 0 : Number(value)),
    },

    {
      type: FieldType.TextField,
      name: "diamondWeight",
      control,
      label: "Diamond Weight",
      inputType: "number",
      inputMode: "decimal",
      slotProps: {
        htmlInput: {
          min: 0,
          step: "0.01",
        },
      },
      valueParser: (value) => (value === "" ? undefined : Number(value)),
    },

    {
      type: FieldType.TextField,
      name: "diamondPieces",
      control,
      label: "Diamond Pieces",
      inputType: "number",
      inputMode: "numeric",
      slotProps: {
        htmlInput: {
          min: 0,
        },
      },
      valueParser: (value) => (value === "" ? undefined : Number(value)),
    },

    {
      type: FieldType.TextField,
      name: "centerStoneWeight",
      control,
      label: "Center Stone Weight",
      inputType: "number",
      inputMode: "decimal",
      slotProps: {
        htmlInput: {
          min: 0,
          step: "0.01",
        },
      },
      valueParser: (value) => (value === "" ? undefined : Number(value)),
    },

    {
      type: FieldType.TextField,
      name: "centerStonePieces",
      control,
      label: "Center Stone Pieces",
      inputType: "number",
      inputMode: "numeric",
      slotProps: {
        htmlInput: {
          min: 0,
        },
      },
      valueParser: (value) => (value === "" ? undefined : Number(value)),
    },

    {
      type: FieldType.Select,
      name: "goldPurities",
      control,
      label: "Gold Purities",
      options: attributesByType["GOLD_PURITY"] ?? [],
      multiple: true,
    },

    {
      type: FieldType.Select,
      name: "goldColors",
      control,
      label: "Gold Colors",
      options: attributesByType["GOLD_COLOR"] ?? [],
      multiple: true,
    },

    {
      type: FieldType.Select,
      name: "diamondTypes",
      control,
      label: "Diamond Types",
      options: attributesByType["DIAMOND_TYPE"] ?? [],
      multiple: true,
    },

    {
      type: FieldType.Select,
      name: "diamondQualities",
      control,
      label: "Diamond Qualities",
      options: attributesByType["DIAMOND_QUALITY"] ?? [],
      multiple: true,
    },

    {
      type: FieldType.Select,
      name: "diamondColors",
      control,
      label: "Diamond Colors",
      options: attributesByType["DIAMOND_COLOR"] ?? [],
      multiple: true,
    },

    {
      type: FieldType.Select,
      name: "certificates",
      control,
      label: "Certificates",
      options: attributesByType["CERTIFICATE"] ?? [],
      multiple: true,
    },
    {
      type: FieldType.Select,
      name: "availableSizes",
      control,
      label: "Available Sizes",
      options: sizesOptions,
      multiple: true,
      disabled: !selectedCategory || sizesOptions.length === 0,
    },
    {
      type: FieldType.TextField,
      name: "shortDescription",
      control,
      label: "Short Description",
      multiline: true,
      rows: 2,
    },

    {
      type: FieldType.TextField,
      name: "description",
      control,
      label: "Description",
      multiline: true,
      rows: 4,
    },

    {
      type: FieldType.TextField,
      name: "specifications",
      control,
      label: "Specifications",
      multiline: true,
      rows: 4,
    },

    {
      type: FieldType.TextField,
      name: "seoTitle",
      control,
      label: "SEO Title",
    },

    {
      type: FieldType.TextField,
      name: "seoDescription",
      control,
      label: "SEO Description",
      multiline: true,
      rows: 3,
    },

    {
      type: FieldType.Switch,
      name: "isFeatured",
      control,
      label: "Featured",
    },

    {
      type: FieldType.Switch,
      name: "isBestSeller",
      control,
      label: "Best Seller",
    },

    {
      type: FieldType.Switch,
      name: "isNewArrival",
      control,
      label: "New Arrival",
    },
  ];

  return (
    <Dialog open={visible} onClose={handleClose} fullWidth maxWidth="md">
      <AppForm onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? "Update Product" : "Create Product"}
        </DialogTitle>

        <DialogContent dividers>
          <FormLayout
            fields={fields}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
          />
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
                label: isEditMode ? "Update Product" : "Create Product",
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

CreateProductForm.displayName = "CreateProductForm";

export default CreateProductForm;
