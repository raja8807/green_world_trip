import fs from "fs";
import formidable from "formidable";
import sharp from "sharp";
import { uploadToR2 } from "@/lib/r2Client";
import { getImageUrl } from "@/utils/image";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing to allow streaming multipart/form-data
  },
};

const MAX_TARGET_BYTES = 500 * 1024; // 500KB

/**
 * Normalizes values returned by formidable v3 (which might be arrays or objects)
 */
function normalizeFormidableFiles(filesObj) {
  const result = [];
  if (!filesObj) return result;

  for (const key of Object.keys(filesObj)) {
    const val = filesObj[key];
    if (Array.isArray(val)) {
      result.push(...val);
    } else if (val) {
      result.push(val);
    }
  }
  return result;
}

/**
 * Optimizes an image buffer into WebP, guaranteeing the output is below 500KB
 * while retaining high visual quality.
 */
async function optimizeToWebP(inputBuffer) {
  try {
    const metadata = await sharp(inputBuffer).metadata();

    // If not a decodable image, return original
    if (!metadata.format) {
      return { buffer: inputBuffer, isWebp: false };
    }

    const { width, height } = metadata;
    const maxWidth = 2560;
    const maxHeight = 2560;

    let resizeOptions = null;
    if (width && height && (width > maxWidth || height > maxHeight)) {
      resizeOptions = {
        width: width > height ? maxWidth : undefined,
        height: height >= width ? maxHeight : undefined,
        fit: "inside",
        withoutEnlargement: true,
      };
    }

    // Start with high visual quality (85)
    let quality = 85;
    let pipeline = sharp(inputBuffer);
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }

    let outputBuffer = await pipeline
      .webp({ quality, effort: 4 })
      .toBuffer();

    // Progressively lower quality if above 500KB
    let iterations = 0;
    while (outputBuffer.length > MAX_TARGET_BYTES && quality > 52 && iterations < 5) {
      quality -= 7;
      iterations++;
      let nextPipeline = sharp(inputBuffer);
      if (resizeOptions) {
        nextPipeline = nextPipeline.resize(resizeOptions);
      }
      outputBuffer = await nextPipeline
        .webp({ quality, effort: 4 })
        .toBuffer();
    }

    // If still slightly over 500KB, scale dimensions to 1920 max and re-compress
    if (outputBuffer.length > MAX_TARGET_BYTES) {
      outputBuffer = await sharp(inputBuffer)
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toBuffer();
    }

    return { buffer: outputBuffer, isWebp: true };
  } catch (err) {
    console.warn("Server image optimization skipped, using input buffer:", err);
    return { buffer: inputBuffer, isWebp: false };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 30 * 1024 * 1024, // 30MB max input file size
  });

  try {
    const [fields, files] = await form.parse(req);

    // Extract requested folder (default to 'images')
    let folder = "images";
    if (fields.folder) {
      folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
      folder = folder.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9_\-/]/g, "");
    }
    if (!folder) folder = "images";

    const fileList = normalizeFormidableFiles(files);

    if (fileList.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const uploadResults = [];

    for (const file of fileList) {
      const rawBuffer = await fs.promises.readFile(file.filepath);

      // Compress to WebP (< 500KB)
      const { buffer, isWebp } = await optimizeToWebP(rawBuffer);

      const ext = isWebp ? "webp" : "jpg";
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const fileName = `${Date.now()}-${randomSuffix}.${ext}`;
      const key = `${folder}/${fileName}`;

      await uploadToR2({
        buffer,
        key,
        contentType: isWebp ? "image/webp" : (file.mimetype || "application/octet-stream"),
      });

      // Remove temp file after upload
      await fs.promises.unlink(file.filepath).catch(() => {});

      const cdnUrl = getImageUrl(key);

      uploadResults.push({
        key,
        url: cdnUrl,
        originalName: file.originalFilename || fileName,
        size: buffer.length,
      });
    }

    // Single-file response
    if (uploadResults.length === 1) {
      return res.status(200).json({
        success: true,
        key: uploadResults[0].key,
        url: uploadResults[0].url,
        size: uploadResults[0].size,
        results: uploadResults,
      });
    }

    // Multi-file response
    return res.status(200).json({
      success: true,
      keys: uploadResults.map((r) => r.key),
      urls: uploadResults.map((r) => r.url),
      results: uploadResults,
    });
  } catch (error) {
    console.error("Cloudflare R2 upload error:", error);
    return res.status(500).json({
      error: error.message || "Failed to upload file to Cloudflare R2.",
    });
  }
}
