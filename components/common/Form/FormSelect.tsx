"use client";

import { Controller, type FieldValues } from "react-hook-form";
import {
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";

import type { SelectField } from "./types";

const FormSelect = <TFormValues extends FieldValues>({
  control,
  name,
  required,
  options,
  emptyOptionLabel,
  multiple,
  ...selectProps
}: SelectField<TFormValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <TextField
        {...selectProps}
        {...field}
        select
        multiple={multiple}
        value={field.value ?? (multiple ? [] : "")}
        required={required}
        fullWidth={selectProps.fullWidth ?? true}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message ?? selectProps.helperText}
        onChange={(event) => {
          const nextValue = event.target.value;

          field.onChange(
            multiple && typeof nextValue === "string"
              ? nextValue.split(",")
              : nextValue,
          );
        }}
        slotProps={{
          ...selectProps.slotProps,
          select: {
            ...selectProps.slotProps?.select,
            renderValue:
              selectProps.slotProps?.select?.renderValue ??
              ((selected) => {
                if (multiple) {
                  const selectedValues = Array.isArray(selected)
                    ? selected
                    : selected == null || selected === ""
                      ? []
                      : [selected];

                  const selectedOptions = options.filter((option) =>
                    selectedValues.some(
                      (value) => String(value) === String(option.value),
                    ),
                  );

                  if (!selectedOptions.length) {
                    return "";
                  }

                  return (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {selectedOptions.map((option, index) => (
                        <Box component="span" key={String(option.value)}>
                          {option.label}
                          {index < selectedOptions.length - 1 ? ", " : ""}
                        </Box>
                      ))}
                    </Box>
                  );
                }

                const selectedOption = options.find(
                  (option) => String(option.value) === String(selected),
                );

                return selectedOption?.label ?? "";
              }),
          },
        }}
      >
        {!multiple && emptyOptionLabel ? (
          <MenuItem value="">{emptyOptionLabel}</MenuItem>
        ) : null}
        {options?.map((option) => (
          <MenuItem
            key={String(option?.value)}
            value={option?.value}
            disabled={option?.disabled}
          >
            {multiple ? (
              <Checkbox
                checked={
                  Array.isArray(field.value)
                    ? field?.value?.some(
                        (value) => String(value) === String(option.value),
                      )
                    : false
                }
                sx={{ mr: 1 }}
              />
            ) : null}

            <ListItemText primary={option?.label} />
          </MenuItem>
        ))}
      </TextField>
    )}
  />
);

export default FormSelect;
