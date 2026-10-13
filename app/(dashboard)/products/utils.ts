import { ProductMedia } from '@/types/products';

export const getId = (value: unknown): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "_id" in value) {
    return String((value as { _id: string })._id);
  }

  return "";
};

export const getIds = (values: unknown): string[] => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((value) => getId(value)).filter(Boolean);
};

export const normalizeMedia = (
  values: unknown,
): Array<ProductMedia > => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((item, index) => ({
    url:
      typeof item === "object" && item && "url" in item
        ? String((item as { url?: string }).url ?? "")
        : "",

    alt:
      typeof item === "object" && item && "alt" in item
        ? String((item as { alt?: string }).alt ?? "")
        : "",

    isPrimary:
      typeof item === "object" && item && "isPrimary" in item
        ? Boolean((item as { isPrimary?: boolean }).isPrimary)
        : index === 0,

    displayOrder:
      typeof item === "object" && item && "displayOrder" in item
        ? Number((item as { displayOrder?: number }).displayOrder ?? index + 1)
        : index + 1,
  }));
};

export const emptyMediaItem = {
  url: "",
  alt: "",
  isPrimary: false,
  displayOrder: 1,
};

export const booleanOptions = [
  { value: "all", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const productTagOptions = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "bestSeller",
    label: "Best Seller",
  },
  {
    value: "newArrival",
    label: "New Arrival",
  },
];

export const SIZE_CATEGORY_MAP: Record<string, string | null> = {
  rings: "Ring",
  ring: "Ring",

  bangles: "Bangle",
  bangle: "Bangle",

  bracelets: "Bracelet",
  bracelet: "Bracelet",

  earrings: null,
  earring: null,

  necklace: null,
  necklaces: null,

  pendant: null,
  pendants: null,

  mangalsutra: null,
  mangalsutras: null,
};
