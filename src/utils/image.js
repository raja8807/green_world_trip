const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";

export const getImageUrl = (path) => {
  if (!path) return "";

  // Preserve external image URLs
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${CDN_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};
