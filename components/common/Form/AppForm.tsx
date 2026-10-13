"use client";

import type { FormHTMLAttributes, ReactNode } from "react";

interface AppFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

const AppForm = ({ children, ...formProps }: AppFormProps) => (
  <form {...formProps}>{children}</form>
);

export default AppForm;
