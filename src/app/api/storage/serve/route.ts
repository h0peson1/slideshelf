import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { verifyLocalStorageToken, getStorageBaseDir } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Access denied: missing token.", { status: 401 });
  }

  const verified = await verifyLocalStorageToken(token);
  if (!verified) {
    return new NextResponse("Access expired or invalid token.", { status: 403 });
  }

  // Prevent path traversal attack
  const safeRelativePath = path.normalize(verified.path).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(getStorageBaseDir(), safeRelativePath);

  try {
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(fullPath);
    } catch {
      // If file doesn't exist on this ephemeral serverless container instance, serve placeholder
      fileBuffer = Buffer.from(
        `%PDF-1.4\n% SlideShelf Demo Slide: ${verified.name}\nCourse Material Preview\n%%EOF`,
      );
    }

    const ext = path.extname(verified.name).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".ppt") contentType = "application/vnd.ms-powerpoint";
    else if (ext === ".pptx") contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    const disposition =
      verified.mode === "download"
        ? `attachment; filename="${encodeURIComponent(verified.name)}"`
        : "inline";

    return new NextResponse(fileBuffer as any, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
        "Cache-Control": "private, max-age=900",
      },
    });
  } catch (error) {
    console.error("Storage serve error:", error);
    return new NextResponse("File not found or storage error.", { status: 404 });
  }
}
