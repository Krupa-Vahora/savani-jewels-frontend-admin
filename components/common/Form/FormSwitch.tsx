"use client";

import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  type SwitchProps,
} from "@mui/material";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { ReactNode } from "react";

export interface FormSwitchProps<TFormValues extends FieldValues> extends Omit<
  SwitchProps,
  "name" | "checked" | "value" | "onChange" | "onBlur"
> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: ReactNode;
  required?: boolean;
  helperText?: ReactNode;
}

const FormSwitch = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  required,
  helperText,
  disabled,
  ...switchProps
}: FormSwitchProps<TFormValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <FormControl error={Boolean(error)} required={required} disabled={disabled}>
      <FormControlLabel
        label={label}
        control={
          <Switch
            {...switchProps}
            {...field}
            checked={Boolean(field.value)}
            disabled={disabled}
            onChange={(event) => {
              field.onChange(event.target.checked);
            }}
          />
        }
      />

      {(error?.message || helperText) && (
        <FormHelperText>{error?.message ?? helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormSwitch;
