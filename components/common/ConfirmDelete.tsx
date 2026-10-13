"use client";

import React from "react";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/Delete";

export interface ConfirmDeleteProps {
  open: boolean;
  itemName?: string;
  title?: string;
  message?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: "xs" | "sm" | "md";
  disableCloseWhileLoading?: boolean;
}

const ConfirmDelete = ({
  open,
  itemName,
  title = "Delete Item?",
  message,
  onCancel,
  onConfirm,
  loading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
  maxWidth = "xs",
  disableCloseWhileLoading = true,
}: ConfirmDeleteProps) => {
  const handleClose = () => {
    if (disableCloseWhileLoading && loading) {
      return;
    }

    onCancel();
  };

  const defaultMessage = (
    <>
      Are you sure you want to delete{" "}
      {itemName ? <strong>{itemName}</strong> : "this item"}
      ?
      <br />
      This action cannot be undone.
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-delete-description">
          {message ?? defaultMessage}
        </DialogContentText>
      </DialogContent>

      <DialogActions className="px-6 py-4">
        <Button
          type="button"
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <DeleteOutlineIcon />
            )
          }
        >
          {loading ? "Deleting..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
