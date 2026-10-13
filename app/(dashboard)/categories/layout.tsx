"use client";

import { ReactNode } from "react";
import { CategoryContextProvider } from "./CategoriesContext";

interface CategoriesLayoutProps {
  children: ReactNode;
}

const CategoriesLayout = ({ children }: CategoriesLayoutProps) => {
  return <CategoryContextProvider>{children}</CategoryContextProvider>;
};

export default CategoriesLayout;
