/**
 * Utility to compress images to WebP format targeting < 500KB before upload.
 */

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas conversion to WebP failed."));
      },
      type,
      quality
    );
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Compresses an image file to WebP format, ensuring the final size is below 500KB
 * while preserving high visual quality.
 *
 * @param {File} file - The original image file
 * @param {Object} [options]
 * @param {number} [options.maxSizeKB=500] - Target max size in KB (default: 500)
 * @param {number} [options.maxWidth=2560] - Max dimension for width (default: 2560)
 * @param {number} [options.maxHeight=2560] - Max dimension for height (default: 2560)
 * @returns {Promise<File>} - The compressed WebP file
 */
export async function compressImageToWebP(
  file,
  { maxSizeKB = 500, maxWidth = 2560, maxHeight = 2560 } = {}
) {
  // If not in a browser environment or not an image, return original
  if (typeof window === "undefined" || !file || !file.type.startsWith("image/")) {
    return file;
  }

  // If already a webp and already below 500KB, skip re-encoding
  const maxSizeBytes = maxSizeKB * 1024;
  if (file.type === "image/webp" && file.size <= maxSizeBytes) {
    return file;
  }

  try {
    const img = await loadImage(file);
    let { naturalWidth: width, naturalHeight: height } = img;

    // Scale down dimensions if excessively large
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: true });
    // Enable high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    // Start with high visual quality (0.86)
    let quality = 0.86;
    let blob = await canvasToBlob(canvas, "image/webp", quality);

    // Iteratively adjust quality if output is larger than 500KB
    let attempts = 0;
    while (blob.size > maxSizeBytes && quality > 0.5 && attempts < 6) {
      quality -= 0.08;
      attempts++;
      blob = await canvasToBlob(canvas, "image/webp", quality);
    }

    // If still above 500KB (e.g., highly textured raw photo), scale dimensions slightly
    if (blob.size > maxSizeBytes) {
      const scaledCanvas = document.createElement("canvas");
      scaledCanvas.width = Math.round(width * 0.85);
      scaledCanvas.height = Math.round(height * 0.85);
      const sCtx = scaledCanvas.getContext("2d");
      sCtx.imageSmoothingEnabled = true;
      sCtx.imageSmoothingQuality = "high";
      sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      blob = await canvasToBlob(scaledCanvas, "image/webp", 0.78);
    }

    // Determine clean webp filename
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const webpFileName = `${nameWithoutExt}.webp`;

    return new File([blob], webpFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn("Client-side image compression fallback to original:", err);
    return file;
  }
}
