"use client";

import {
  Alert,
  Snackbar,
  type AlertColor,
  type SnackbarProps,
} from "@mui/material";

interface AppSnackbarProps extends Omit<SnackbarProps, "message"> {
  message?: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

const AppSnackbar = ({
  message,
  severity = "success",
  autoHideDuration = 4000,
  open,
  onClose,
  ...props
}: AppSnackbarProps) => {
  const handleAlertClose = () => {
    onClose?.({} as Event, "clickaway");
  };

  return (
    <Snackbar
      {...props}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleAlertClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
