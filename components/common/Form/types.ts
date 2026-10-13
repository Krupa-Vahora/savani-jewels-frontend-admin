import type { ReactNode } from "react";
import type { ButtonProps, SwitchProps, TextFieldProps } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";

export enum FieldType {
  TextField = "textField",
  Textarea = "textarea",
  Select = "select",
  Switch = "switch",
  Button = "button",
}

type BaseField<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  label?: ReactNode;
  required?: boolean;
  containerClassName?: string;
};

type TextFieldOptions = Omit<
  TextFieldProps,
  "name" | "type" | "value" | "onChange" | "onBlur" | "error" | "helperText" | "inputRef" | "required"
>;

type FieldHelperText = {
  helperText?: ReactNode;
};

export type TextFieldField<TFormValues extends FieldValues> =
  BaseField<TFormValues> &
    TextFieldOptions & FieldHelperText & {
      type: FieldType.TextField;
      inputType?: TextFieldProps["type"];
      valueParser?: (value: string) => unknown;
    };

export type TextareaField<TFormValues extends FieldValues> =
  BaseField<TFormValues> &
    TextFieldOptions & FieldHelperText & {
      type: FieldType.Textarea;
    };

export type SelectOption = {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectField<TFormValues extends FieldValues> =
  BaseField<TFormValues> &
    Omit<TextFieldOptions, "select" | "children"> & FieldHelperText & {
      type: FieldType.Select;
      options: SelectOption[];
      emptyOptionLabel?: string;
      multiple?: boolean;
    };

export type SwitchField<TFormValues extends FieldValues> =
  BaseField<TFormValues> &
    Omit<SwitchProps, "name" | "checked" | "onChange" | "inputRef" | "required"> & {
      type: FieldType.Switch;
      helperText?: ReactNode;
    };

export type ButtonField = Omit<ButtonProps, "children" | "type"> & {
  type: FieldType.Button;
  buttonType?: ButtonProps["type"];
  label: ReactNode;
  containerClassName?: string;
  loading?: boolean;
  loadingText?: ReactNode;
};

export type FormField<TFormValues extends FieldValues> =
  | TextFieldField<TFormValues>
  | TextareaField<TFormValues>
  | SelectField<TFormValues>
  | SwitchField<TFormValues>
  | ButtonField;
