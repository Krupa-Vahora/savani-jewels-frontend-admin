"use client";

import { ReactNode } from "react";
import { SubCategoriesContextProvider } from "./SubCategoriesContext";

interface SubCategoriesLayoutProps {
  children: ReactNode;
}

const SubCategoriesLayout = ({ children }: SubCategoriesLayoutProps) => {
  return (
    <SubCategoriesContextProvider>{children}</SubCategoriesContextProvider>
  );
};

export default SubCategoriesLayout;
