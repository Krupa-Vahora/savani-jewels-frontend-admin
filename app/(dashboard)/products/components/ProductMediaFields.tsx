"use client";

import {
  Control,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import { Button, IconButton, Switch, TextField } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { ProductFormValues } from "@/validations/products";

interface Props {
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

const EMPTY_MEDIA = {
  url: "",
  alt: "",
  isPrimary: false,
  displayOrder: 1,
};

const ProductMediaFields = ({ control, setValue }: Props) => {
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control,
    name: "videos",
  });

  const images = useWatch({
    control,
    name: "images",
  });

  const videos = useWatch({
    control,
    name: "videos",
  });

  const setPrimaryImage = (index: number) => {
    images?.forEach((_, imageIndex) => {
      setValue(`images.${imageIndex}.isPrimary`, imageIndex === index, {
        shouldDirty: true,
      });
    });
  };

  const setPrimaryVideo = (index: number) => {
    videos?.forEach((_, videoIndex) => {
      setValue(`videos.${videoIndex}.isPrimary`, videoIndex === index, {
        shouldDirty: true,
      });
    });
  };

  return (
    <div className="col-span-2 mt-6 space-y-8">
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Product Images</h3>

          <Button
            type="button"
            startIcon={<AddIcon />}
            onClick={() =>
              appendImage({
                ...EMPTY_MEDIA,
                displayOrder: imageFields.length + 1,
              })
            }
          >
            Add Image
          </Button>
        </div>

        <div className="space-y-4">
          {imageFields?.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3"
            >
              <TextField
                fullWidth
                label="Image URL"
                value={images?.[index]?.url ?? ""}
                onChange={(event) =>
                  setValue(`images.${index}.url`, event.target.value, {
                    shouldDirty: true,
                  })
                }
              />

              <TextField
                fullWidth
                label="Alt Text"
                value={images?.[index]?.alt ?? ""}
                onChange={(event) =>
                  setValue(`images.${index}.alt`, event.target.value, {
                    shouldDirty: true,
                  })
                }
              />

              <Switch
                checked={images?.[index]?.isPrimary ?? false}
                onChange={() => setPrimaryImage(index)}
              />

              <IconButton color="error" onClick={() => removeImage(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      {/* VIDEOS */}

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Product Videos</h3>

          <Button
            type="button"
            startIcon={<AddIcon />}
            onClick={() =>
              appendVideo({
                ...EMPTY_MEDIA,
                displayOrder: videoFields.length + 1,
              })
            }
          >
            Add Video
          </Button>
        </div>

        <div className="space-y-4">
          {videoFields?.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3"
            >
              <TextField
                fullWidth
                label="Video URL"
                value={videos?.[index]?.url ?? ""}
                onChange={(event) =>
                  setValue(`videos.${index}.url`, event.target.value, {
                    shouldDirty: true,
                  })
                }
              />

              <TextField
                fullWidth
                label="Alt Text"
                value={videos?.[index]?.alt ?? ""}
                onChange={(event) =>
                  setValue(`videos.${index}.alt`, event.target.value, {
                    shouldDirty: true,
                  })
                }
              />

              <Switch
                checked={videos?.[index]?.isPrimary ?? false}
                onChange={() => setPrimaryVideo(index)}
              />

              <IconButton color="error" onClick={() => removeVideo(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductMediaFields;
