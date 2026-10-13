"use client";

import type { ReactNode } from "react";

import { ProductSizeContextProvider } from "./ProductSizesContext";

interface ProductSizesLayoutProps {
  children: ReactNode;
}

const ProductSizesLayout = ({ children }: ProductSizesLayoutProps) => {
  return <ProductSizeContextProvider>{children}</ProductSizeContextProvider>;
};

export default ProductSizesLayout;
