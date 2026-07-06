const jsxbin = require("jsxbin");
const path = require("path");
const fs = require("fs");

export default async function handler(req, res) {
  try {
    const input = path.join(process.cwd(), "script.jsx");
    const outputDir = path.join(process.cwd(), "output");
    const output = path.join(outputDir, "script.jsxbin");

    if (!fs.existsSync(input)) {
      return res.status(404).json({
        success: false,
        message: "Input file not found.",
        input,
      });
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await jsxbin(input, output);

    return res.status(200).json({
      success: true,
      result,
      input,
      output,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
}
