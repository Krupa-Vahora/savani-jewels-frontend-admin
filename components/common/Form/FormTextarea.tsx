"use client";

import type { FieldValues } from "react-hook-form";

import FormTextField from "./FormTextField";
import { FieldType, type TextareaField } from "./types";

const FormTextarea = <TFormValues extends FieldValues>(
  props: TextareaField<TFormValues>,
) => (
  <FormTextField
    {...props}
    type={FieldType.TextField}
    multiline
    minRows={props.minRows ?? 3}
  />
);

export default FormTextarea;
