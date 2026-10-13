import { Avatar, Box, Typography } from "@mui/material";

interface ImagePreviewProps {
  title: string;
  url?: string;
  alt?: string;
  banner?: boolean;
}

export const ImagePreview = ({
  title,
  url,
  alt,
  banner = false,
}: ImagePreviewProps) => {
  return (
    <div>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mb: 1,
          display: "block",
        }}
      >
        {title}
      </Typography>

      {url ? (
        <Avatar
          src={url}
          alt={alt || title}
          variant="rounded"
          sx={{
            width: "100%",
            height: banner ? 180 : 220,
            borderRadius: 2,
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            height: banner ? 180 : 220,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">No image available</Typography>
        </Box>
      )}
    </div>
  );
};
