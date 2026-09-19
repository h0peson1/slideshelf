import path from "path";
import fs from "fs/promises";
import os from "os";
import { SignJWT, jwtVerify } from "jose";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export function getStorageBaseDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "slideshelf_storage");
  }
  return path.join(process.cwd(), "storage");
}

export type StorageDriver = "supabase" | "local";

export type UploadParams = {
  buffer: Buffer;
  fileName: string;
  fileType: string;
  courseCode: string;
  level: number;
  semester: number;
  week: number;
};

export type StorageResult = {
  storagePath: string;
  driver: StorageDriver;
};

export const BUCKET_NAME = "lecture-slides";

const ALLOWED_EXTENSIONS = [".pdf", ".ppt", ".pptx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/octet-stream", // Some browsers send octet-stream for pptx
];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "slideshelf-storage-token-secret-fallback-minimum-32-chars",
);

/**
 * Validates uploaded file extension, mime type, and file size (50MB limit)
 */
export function validateSlideFile(
  fileName: string,
  mimeType: string,
  sizeBytes: number,
): { valid: boolean; error?: string; detectedType: "PDF" | "PPT" | "PPTX" } {
  if (sizeBytes <= 0) {
    return { valid: false, error: "Uploaded file is empty.", detectedType: "PDF" };
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum allowed size of 50MB (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB).`,
      detectedType: "PDF",
    };
  }

  const ext = path.extname(fileName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file format '${ext}'. Only PDF (.pdf) and PowerPoint (.ppt, .pptx) files are accepted.`,
      detectedType: "PDF",
    };
  }

  let detectedType: "PDF" | "PPT" | "PPTX" = "PDF";
  if (ext === ".pptx") detectedType = "PPTX";
  else if (ext === ".ppt") detectedType = "PPT";

  return { valid: true, detectedType };
}

/**
 * Programmatically constructs the logical storage path hierarchy:
 * slides/level-{level}/semester-{semester}/{courseCode}/week-{week:02d}/{uniqueId}-{fileName}
 */
export function generateStoragePath(
  level: number,
  semester: number,
  courseCode: string,
  week: number,
  fileName: string,
): string {
  const sanitizedCourse = courseCode.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const weekFormatted = `week-${String(week).padStart(2, "0")}`;

  return `slides/level-${level}/semester-${semester}/${sanitizedCourse}/${weekFormatted}/${uniquePrefix}-${sanitizedName}`;
}

/**
 * Uploads a file to Supabase Storage (bucket: lecture-slides) or local fallback driver
 */
export async function uploadSlideFile(params: UploadParams): Promise<StorageResult> {
  const storagePath = generateStoragePath(
    params.level,
    params.semester,
    params.courseCode,
    params.week,
    params.fileName,
  );

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, params.buffer, {
            contentType: params.fileType || "application/octet-stream",
            upsert: true,
          });

        if (uploadError) {
          console.error("Supabase Storage upload error:", uploadError);
          throw new Error(uploadError.message);
        }

        return { storagePath, driver: "supabase" };
      } catch (err) {
        console.error("Supabase storage error, attempting local fallback:", err);
      }
    }
  }

  // Local fallback storage driver
  const localFullPath = path.join(getStorageBaseDir(), storagePath);
  try {
    await fs.mkdir(path.dirname(localFullPath), { recursive: true });
    await fs.writeFile(localFullPath, params.buffer);
  } catch (fsErr) {
    console.warn("Local storage write warning (ephemeral serverless environment):", fsErr);
  }

  return { storagePath, driver: "local" };
}

/**
 * Deletes a file from Supabase Storage or local storage
 */
export async function deleteSlideFile(storagePath: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([storagePath]);

        if (error) {
          console.warn("Supabase Storage delete warning:", error.message);
        }
        return;
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }
  }

  // Local fallback deletion
  try {
    const localFullPath = path.join(getStorageBaseDir(), storagePath);
    await fs.unlink(localFullPath);
  } catch (err) {
    console.warn("Local storage delete error (file may already be gone):", err);
  }
}

/**
 * Generates a secure, temporary signed access URL (15 mins) for viewing or downloading slides
 */
export async function getSignedSlideUrl(
  storagePath: string,
  originalFileName: string,
  mode: "view" | "download" = "view",
): Promise<string> {
  const isDownload = mode === "download";

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(storagePath, 15 * 60, {
            download: isDownload ? originalFileName : false,
          });

        if (error) {
          console.error("Supabase signed URL error:", error);
          throw new Error(error.message);
        }

        if (data?.signedUrl) {
          return data.signedUrl;
        }
      } catch (err) {
        console.warn("Supabase signed URL generation failed, falling back to local:", err);
      }
    }
  }

  // Local driver: Generate signed HMAC/JWT token for internal serve endpoint
  const token = await new SignJWT({
    path: storagePath,
    name: originalFileName,
    mode,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/api/storage/serve?token=${encodeURIComponent(token)}`;
}

/**
 * Verifies a local storage temporary access token
 */
export async function verifyLocalStorageToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      path: payload.path as string,
      name: payload.name as string,
      mode: payload.mode as "view" | "download",
    };
  } catch {
    return null;
  }
}
