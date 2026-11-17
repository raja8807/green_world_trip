import { deleteFromR2, deleteMultipleFromR2 } from "@/lib/r2Client";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed. Use POST or DELETE." });
  }

  try {
    const { key, keys } = req.body || {};

    if (keys && Array.isArray(keys)) {
      const deletedKeys = await deleteMultipleFromR2(keys);
      return res.status(200).json({
        success: true,
        deletedKeys,
        count: deletedKeys.length,
      });
    }

    if (key) {
      const deleted = await deleteFromR2(key);
      return res.status(200).json({
        success: true,
        deleted,
        key,
      });
    }

    return res.status(400).json({ error: "No key or keys provided for deletion." });
  } catch (error) {
    console.error("Cloudflare R2 delete error:", error);
    return res.status(500).json({
      error: error.message || "Failed to delete file from Cloudflare R2.",
    });
  }
}
