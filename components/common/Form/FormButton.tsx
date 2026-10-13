"use client";

import { CircularProgress, Button } from "@mui/material";

import type { ButtonField } from "./types";

const FormButton = ({
  label,
  loading = false,
  disabled,
  buttonType,
  loadingText,
  ...buttonProps
}: ButtonField) => (
  <Button {...buttonProps} type={buttonType} disabled={disabled || loading}>
    {loading && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />}
    {loading ? (loadingText ?? label) : label}
  </Button>
);

export default FormButton;
