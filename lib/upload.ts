// File upload helper. Saves a Web `File` from a form action to disk under
// public/uploads/<subdir>/, returns the display name + public URL path.

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Single-cell limits so the demo doesn't run out of disk on a misclick.
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

// Allow common document + image types for the demo. Tighten in production.
const ALLOWED_EXT = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".md",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".zip",
  ".csv",
  ".xlsx",
  ".pptx",
]);

export type SavedFile = {
  fileName: string; // original name shown in UI
  filePath: string; // public-relative path, e.g. "/uploads/submissions/abc.pdf"
};

function safeBase(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
}

// Saves the file to public/uploads/<subdir>/. Returns null if no file was
// provided (empty FormData entry). Throws on size or type violation.
export async function saveUploadedFile(
  file: File | null,
  subdir: "submissions" | "discussion",
): Promise<SavedFile | null> {
  if (!file || typeof file === "string") return null;
  if (file.size === 0) return null;
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `File is ${(file.size / 1024 / 1024).toFixed(1)} MB, limit is ${MAX_FILE_BYTES / 1024 / 1024} MB.`,
    );
  }
  const original = file.name || "upload";
  const ext = path.extname(original).toLowerCase();
  if (ext && !ALLOWED_EXT.has(ext)) {
    throw new Error(`File type "${ext}" is not allowed.`);
  }

  const id = crypto.randomBytes(6).toString("hex");
  const base = safeBase(path.basename(original, ext)) || "file";
  const stored = `${id}-${base}${ext || ""}`;

  const targetDir = path.join(process.cwd(), "public", "uploads", subdir);
  await fs.mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, stored);

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(targetPath, bytes);

  return {
    fileName: original,
    filePath: `/uploads/${subdir}/${stored}`,
  };
}
