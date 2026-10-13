"use client";

import type { ReactNode } from "react";

import { ProductAttributeContextProvider } from "./ProductAttributesContext";

interface ProductAttributesLayoutProps {
  children: ReactNode;
}

const ProductAttributesLayout = ({
  children,
}: ProductAttributesLayoutProps) => {
  return (
    <ProductAttributeContextProvider>
      {children}
    </ProductAttributeContextProvider>
  );
};

export default ProductAttributesLayout;
