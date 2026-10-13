"use client";

import type { FieldValues } from "react-hook-form";

import FormButton from "./FormButton";
import FormSelect from "./FormSelect";
import FormSwitch from "./FormSwitch";
import FormTextField from "./FormTextField";
import FormTextarea from "./FormTextarea";
import { FieldType, type FormField } from "./types";

interface FormLayoutProps<TFormValues extends FieldValues> {
  fields: FormField<TFormValues>[];
  className?: string;
}

const FormLayout = <TFormValues extends FieldValues>({
  fields,
  className,
}: FormLayoutProps<TFormValues>) => (
  <div className={className}>
    {fields.map((field, index) => {
      const key = "name" in field ? field.name : `button-${index}`;

      switch (field.type) {
        case FieldType.TextField: {
          const { containerClassName, ...fieldProps } = field;
          return (
            <div key={key} className={containerClassName}>
              <FormTextField {...fieldProps} />
            </div>
          );
        }
        case FieldType.Textarea: {
          const { containerClassName, ...fieldProps } = field;
          return (
            <div key={key} className={containerClassName}>
              <FormTextarea {...fieldProps} />
            </div>
          );
        }
        case FieldType.Select: {
          const { containerClassName, ...fieldProps } = field;
          return (
            <div key={key} className={containerClassName}>
              <FormSelect {...fieldProps} />
            </div>
          );
        }
        case FieldType.Switch: {
          const { containerClassName, type: _type, ...fieldProps } = field;
          return (
            <div key={key} className={containerClassName}>
              <FormSwitch {...fieldProps} />
            </div>
          );
        }
        case FieldType.Button: {
          const { containerClassName, ...fieldProps } = field;
          return (
            <div key={key} className={containerClassName}>
              <FormButton {...fieldProps} />
            </div>
          );
        }
      }
    })}
  </div>
);

export default FormLayout;
