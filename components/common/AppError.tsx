"use client";

import { Alert, Box, Button, type AlertProps } from "@mui/material";

interface AppErrorProps {
  message?: string;
  retry?: () => void;
  retryLabel?: string;
  severity?: AlertProps["severity"];
}

const AppError = ({
  message = "Something went wrong.",
  retry,
  retryLabel = "Try Again",
  severity = "error",
}: AppErrorProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Alert
        severity={severity}
        action={
          retry ? (
            <Button color="inherit" size="small" onClick={retry}>
              {retryLabel}
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Box>
  );
};

export default AppError;
