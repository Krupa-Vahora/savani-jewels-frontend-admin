"use client";

import { ProductsContextProvider } from "./ProductsContext";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProductsContextProvider>{children}</ProductsContextProvider>;
}
