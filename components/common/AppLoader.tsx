"use client";

import { Box, CircularProgress, type BoxProps } from "@mui/material";

interface AppLoaderProps extends BoxProps {
  size?: number;
  minHeight?: number | string;
}

const AppLoader = ({
  size = 40,
  minHeight = 200,
  ...props
}: AppLoaderProps) => {
  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
        ...props.sx,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default AppLoader;
