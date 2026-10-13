"use client";

import { useRef } from "react";
import { Button, Chip, Divider, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

import type { Product } from "@/types/products";
import CreateProductForm, { CreateProductFormRef } from "./CreateProductForm";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const router = useRouter();

  const editModalRef = useRef<CreateProductFormRef>(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/products")}
            />

            <div>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {product.productCode}
              </Typography>
            </div>
          </div>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => editModalRef.current?.openModal()}
          >
            Edit Product
          </Button>
        </div>

        {/* Basic Information */}
        <Paper className="p-5">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Basic Information
          </Typography>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Product Name" value={product.name} />

            <DetailItem label="Product Code" value={product.productCode} />

            <DetailItem label="SKU" value={product.sku} />

            <DetailItem
              label="Category"
              value={
                typeof product.category === "object"
                  ? product.category?.name
                  : "-"
              }
            />

            <DetailItem
              label="Sub Category"
              value={
                typeof product.subCategory === "object"
                  ? product.subCategory?.name
                  : "-"
              }
            />

            <DetailItem label="Slug" value={product.slug} />
          </div>
        </Paper>

        {/* Weight Information */}
        <Paper className="p-5">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Weight Information
          </Typography>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              label="Gross Weight"
              value={`${product.grossWeight ?? 0} g`}
            />

            <DetailItem
              label="Net Weight"
              value={`${product.netWeight ?? 0} g`}
            />

            <DetailItem
              label="Diamond Weight"
              value={
                product.diamondWeight != null
                  ? `${product.diamondWeight} ct`
                  : "-"
              }
            />

            <DetailItem
              label="Diamond Pieces"
              value={product.diamondPieces ?? "-"}
            />

            <DetailItem
              label="Center Stone Weight"
              value={
                product.centerStoneWeight != null
                  ? `${product.centerStoneWeight} ct`
                  : "-"
              }
            />

            <DetailItem
              label="Center Stone Pieces"
              value={product.centerStonePieces ?? "-"}
            />
          </div>
        </Paper>

        {/* Attributes */}
        <Paper className="p-5">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product Attributes
          </Typography>

          <Divider className="my-4" />

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <AttributeSection
              title="Gold Purities"
              values={product.goldPurities}
            />

            <AttributeSection title="Gold Colors" values={product.goldColors} />

            <AttributeSection
              title="Diamond Types"
              values={product.diamondTypes}
            />

            <AttributeSection
              title="Diamond Qualities"
              values={product.diamondQualities}
            />

            <AttributeSection
              title="Diamond Colors"
              values={product.diamondColors}
            />

            <AttributeSection
              title="Certificates"
              values={product.certificates}
            />

            <AttributeSection
              title="Available Sizes"
              values={product.availableSizes}
            />
          </div>
        </Paper>

        {/* Product Tags */}
        <Paper className="p-5">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product Tags
          </Typography>

          <Divider className="my-4" />

          <div className="flex gap-2">
            {product.isFeatured && <Chip label="Featured" color="primary" />}

            {product.isBestSeller && (
              <Chip label="Best Seller" color="success" />
            )}

            {product.isNewArrival && (
              <Chip label="New Arrival" color="secondary" />
            )}

            {!product.isFeatured &&
              !product.isBestSeller &&
              !product.isNewArrival && (
                <Typography color="text.secondary">No tags</Typography>
              )}
          </div>
        </Paper>

        {/* Description */}
        {(product?.shortDescription || product?.description) && (
          <Paper className="p-5">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Description
            </Typography>

            <Divider className="my-4" />

            <Typography variant="body1">
              {product?.shortDescription || "-"}
            </Typography>

            <Typography
              variant="body1"
              className="mt-4"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {product?.description || "-"}
            </Typography>
          </Paper>
        )}

        {/* Specifications */}
        {product?.specifications && (
          <Paper className="p-5">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Specifications
            </Typography>

            <Divider className="my-4" />

            <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
              {product?.specifications || "-"}
            </Typography>
          </Paper>
        )}
        {/* SEO */}
        {(product.seoTitle || product.seoDescription) && (
          <Paper className="p-5">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              SEO
            </Typography>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DetailItem label="SEO Title" value={product.seoTitle} />

              <DetailItem
                label="SEO Description"
                value={product.seoDescription}
              />
            </div>
          </Paper>
        )}
      </div>

      {/* Existing Product Form */}
      <CreateProductForm ref={editModalRef} product={product} />
    </>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  return (
    <div>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value || "-"}
      </Typography>
    </div>
  );
};

const AttributeSection = ({
  title,
  values,
}: {
  title: string;
  values?: any[];
}) => {
  return (
    <div className="flex items-center gap-2">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
        className="whitespace-nowrap"
      >
        {title}:
      </Typography>

      <div className="flex flex-wrap items-center gap-1.5">
        {values?.length ? (
          values.map((item) => (
            <Chip
              key={item?._id ?? item}
              label={item?.value ?? item?.name ?? item}
              size="small"
              variant="outlined"
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
