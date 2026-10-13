"use client";

import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AppEmptyContainerProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

const AppEmptyContainer = ({
  title = "No data found",
  description,
  action,
}: AppEmptyContainerProps) => {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title} !!
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
};

export default AppEmptyContainer;
