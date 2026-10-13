"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProductById } from "@/queries/products";
import ProductDetails from "../components/ProductDetails";

const ProductDetailsPage = () => {
  const params = useParams();

  const productId = params?.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
  });

  if (isLoading) {
    return <div>Loading product...</div>;
  }

  if (isError || !data?.data) {
    return <div>Product not found.</div>;
  }

  return <ProductDetails product={data.data} />;
};

export default ProductDetailsPage;
