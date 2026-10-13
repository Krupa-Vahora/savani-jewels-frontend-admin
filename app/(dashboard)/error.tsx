"use client";

import { useEffect } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 5,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <ErrorOutlineOutlinedIcon
          sx={{
            fontSize: 64,
            color: "error.main",
            mb: 2,
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          Something went wrong
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          We could not load this page. Please try again.
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => reset()}
        >
          Try Again
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
