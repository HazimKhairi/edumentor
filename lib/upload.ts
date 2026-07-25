// File upload helper. Saves a Web `File` from a form action to Vercel Blob
// under <subdir>/, returns the display name + public Blob URL.

import { del, put } from "@vercel/blob";
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
  filePath: string; // public Blob URL, e.g. "https://<store>.public.blob.vercel-storage.com/submissions/abc.pdf"
};

function safeBase(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
}

// Saves the file to Vercel Blob under <subdir>/. Returns null if no file was
// provided (empty FormData entry). Throws on size or type violation.
export async function saveUploadedFile(
  file: File | null,
  subdir: "submissions" | "discussion" | "transcripts",
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

  const blob = await put(`${subdir}/${stored}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    fileName: original,
    filePath: blob.url,
  };
}

// Deletes a previously saved file from Blob storage. Safe to call with a
// missing/already-deleted URL.
export async function deleteUploadedFile(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // missing file is fine, demo-friendly
  }
}
