import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

export const isR2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && R2_BUCKET_NAME
);

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : undefined,
  credentials:
    accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined,
});

/**
 * Extracts relative R2 key from a given path or CDN URL
 * @param {string} pathOrUrl
 * @returns {string|null}
 */
export function extractR2Key(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return null;

  let clean = pathOrUrl.trim();
  const cdnUrl = (process.env.NEXT_PUBLIC_CDN_URL || "").trim().replace(/\/+$/, "");

  // If starts with configured CDN URL, remove it
  if (cdnUrl && clean.startsWith(cdnUrl)) {
    clean = clean.substring(cdnUrl.length).replace(/^\/+/, "");
  }

  // If it's a known R2 folder relative path (e.g. images/..., gallery/..., itinerary/...)
  if (/^(images|gallery|itinerary|destinations|testimonials)\/.+/i.test(clean)) {
    return clean;
  }

  // If it's an absolute URL pointing to Cloudflare R2
  if (/^https?:\/\//i.test(clean)) {
    try {
      const urlObj = new URL(clean);
      if (
        urlObj.hostname.includes("r2.dev") ||
        urlObj.hostname.includes("r2.cloudflarestorage.com")
      ) {
        return urlObj.pathname.replace(/^\/+/, "");
      }
    } catch (e) {
      // not a valid URL
    }
    // External images (Unsplash, etc.) should not be deleted from R2
    return null;
  }

  return clean;
}

/**
 * Uploads a buffer directly to Cloudflare R2 bucket
 * @param {Object} options
 * @param {Buffer} options.buffer
 * @param {string} options.key
 * @param {string} options.contentType
 * @returns {Promise<void>}
 */
export async function uploadToR2({ buffer, key, contentType }) {
  if (!isR2Configured) {
    throw new Error(
      "Cloudflare R2 is not fully configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your environment variables."
    );
  }

  if (accountId && accountId.startsWith("cfat_")) {
    throw new Error(
      "Invalid R2_ACCOUNT_ID: An API Token (starting with 'cfat_') was provided instead of your Cloudflare Account ID. Please check your Cloudflare Dashboard (dash.cloudflare.com/<account_id>/r2) for your 32-character Account ID."
    );
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
  });

  return await r2Client.send(command);
}

/**
 * Deletes a single object from Cloudflare R2 bucket
 * @param {string} pathOrUrl - S3 Key or CDN URL
 * @returns {Promise<boolean>}
 */
export async function deleteFromR2(pathOrUrl) {
  if (!isR2Configured) return false;

  const key = extractR2Key(pathOrUrl);
  if (!key) return false;

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch (err) {
    console.error(`Failed to delete object "${key}" from R2:`, err);
    return false;
  }
}

/**
 * Deletes multiple objects from Cloudflare R2 bucket
 * @param {string[]} pathsOrUrls - Array of S3 Keys or CDN URLs
 * @returns {Promise<string[]>} - Array of successfully deleted keys
 */
export async function deleteMultipleFromR2(pathsOrUrls) {
  if (!isR2Configured || !Array.isArray(pathsOrUrls) || pathsOrUrls.length === 0) {
    return [];
  }

  const validKeys = pathsOrUrls
    .map(extractR2Key)
    .filter(Boolean);

  if (validKeys.length === 0) return [];

  try {
    const command = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: validKeys.map((Key) => ({ Key })),
        Quiet: true,
      },
    });

    await r2Client.send(command);
    return validKeys;
  } catch (err) {
    console.error("Failed to delete multiple objects from R2:", err);
    return [];
  }
}
