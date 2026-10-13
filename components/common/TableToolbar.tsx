"use client";

import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

interface ToolbarFilterOption {
  value: string;
  label: string;
}

interface SingleToolbarFilter {
  key: string;
  label: string;
  value: string;
  options: ToolbarFilterOption[];
  multiple?: false;
  onChange: (value: string) => void;
}

export interface MultiToolbarFilter {
  key: string;
  label: string;
  value: string[];
  options: ToolbarFilterOption[];
  multiple: true;
  onChange: (value: string[]) => void;
}

type ToolbarFilter = SingleToolbarFilter | MultiToolbarFilter;

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  filters?: ToolbarFilter[];
  onAdd?: () => void;
  addButtonLabel?: string;
}

const TableToolbar = ({
  searchValue,
  onSearchChange,
  filters,
  onRefresh,
  onAdd,
  addButtonLabel,
}: TableToolbarProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TextField
          size="small"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search ..."
          sx={{ minWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      {filters?.map((filter) => (
        <FormControl key={filter.key} size="small" sx={{ minWidth: 170 }}>
          <InputLabel id={`${filter.key}-filter-label`}>
            {filter.label}
          </InputLabel>

          <Select
            labelId={`${filter.key}-filter-label`}
            value={filter.value}
            label={filter.label}
            multiple={Boolean(filter.multiple)}
            onChange={(event) => {
              if (filter.multiple) {
                const value = event.target.value;

                filter.onChange(
                  Array.isArray(value) ? value : value ? value.split(",") : [],
                );

                return;
              }

              filter.onChange(event.target.value as string);
            }}
            renderValue={(selected) => {
              if (Array.isArray(selected)) {
                return selected
                  .map(
                    (value) =>
                      filter.options.find((option) => option.value === value)
                        ?.label ?? value,
                  )
                  .join(", ");
              }

              return (
                filter.options.find((option) => option.value === selected)
                  ?.label ?? selected
              );
            }}
          >
            {filter.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onAdd && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
            {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
