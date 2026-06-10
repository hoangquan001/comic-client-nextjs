/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs-extra");

async function copyFolder(sourceDir, destinationDir) {
  try {
    await fs.copy(sourceDir, destinationDir);
    console.log(`Copied all files from ${sourceDir} to ${destinationDir}`);
  } catch (err) {
    console.error("Error copying folder:", err);
  }
}

// Ví dụ:
copyFolder("sitemap/generated", "dist/comic-client/browser");
