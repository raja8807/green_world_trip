import { compressImageToWebP } from "./imageCompressor";

/**
 * Uploads a single file to Cloudflare R2 via the Next.js API route.
 * Automatically compresses images to WebP (<500KB) before uploading.
 *
 * @param {File} file - The file to upload
 * @param {string} folder - Target folder ('images' | 'gallery' | 'itinerary' | 'destinations' | 'testimonials')
 * @returns {Promise<{ key: string, url: string }>} - Resolves with relative key and full CDN URL
 */
export async function uploadFileToR2(file, folder = "images") {
  if (!file) throw new Error("No file provided for upload.");

  // Compress image to WebP (< 500KB) before sending to server
  const fileToUpload = await compressImageToWebP(file, { maxSizeKB: 500 });

  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to upload image to Cloudflare R2.");
  }

  return {
    key: data.key,
    url: data.url,
  };
}

/**
 * Uploads multiple files to Cloudflare R2 via the Next.js API route.
 * Automatically compresses all images to WebP (<500KB) concurrently before uploading.
 *
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Target folder ('images' | 'gallery' | 'itinerary' | 'destinations' | 'testimonials')
 * @returns {Promise<Array<{ key: string, url: string }>>} - Resolves with array of uploaded file objects
 */
export async function uploadMultipleFilesToR2(files, folder = "gallery") {
  if (!files || files.length === 0) return [];

  // Compress all files to WebP (< 500KB) before uploading
  const compressedFiles = await Promise.all(
    files.map((file) => compressImageToWebP(file, { maxSizeKB: 500 }))
  );

  const formData = new FormData();
  formData.append("folder", folder);

  for (let i = 0; i < compressedFiles.length; i++) {
    formData.append(`file_${i}`, compressedFiles[i]);
  }

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to upload images to Cloudflare R2.");
  }

  return data.results || (data.key ? [{ key: data.key, url: data.url }] : []);
}

/**
 * Deletes a file from Cloudflare R2 bucket via the API route.
 *
 * @param {string} pathOrUrl - S3 Key or CDN URL
 * @returns {Promise<{ success: boolean, deleted?: boolean, error?: string }>}
 */
export async function deleteFileFromR2(pathOrUrl) {
  if (!pathOrUrl) return { success: true };

  try {
    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: pathOrUrl }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting file from Cloudflare R2:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Deletes multiple files from Cloudflare R2 bucket via the API route.
 *
 * @param {string[]} pathsOrUrls - Array of S3 Keys or CDN URLs
 * @returns {Promise<{ success: boolean, deletedKeys?: string[], error?: string }>}
 */
export async function deleteMultipleFilesFromR2(pathsOrUrls) {
  if (!pathsOrUrls || pathsOrUrls.length === 0) return { success: true };

  try {
    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: pathsOrUrls }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting multiple files from Cloudflare R2:", err);
    return { success: false, error: err.message };
  }
}
