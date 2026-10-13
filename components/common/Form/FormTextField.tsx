"use client";

import { Controller, type FieldValues } from "react-hook-form";
import { TextField } from "@mui/material";

import type { TextFieldField } from "./types";

const FormTextField = <TFormValues extends FieldValues>({
  control,
  name,
  required,
  inputType,
  valueParser,
  ...textFieldProps
}: TextFieldField<TFormValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <TextField
        {...textFieldProps}
        {...field}
        type={inputType}
        value={field.value ?? ""}
        required={required}
        fullWidth={textFieldProps.fullWidth ?? true}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message ?? textFieldProps.helperText}
        onChange={(event) =>
          field.onChange(
            valueParser ? valueParser(event.target.value) : event.target.value,
          )
        }
      />
    )}
  />
);

export default FormTextField;
