"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  validateSlideFile,
  uploadSlideFile,
  deleteSlideFile,
  getSignedSlideUrl,
} from "@/lib/storage";

export type SlideItem = {
  id: string;
  courseId: string;
  title: string;
  week: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
};

/**
 * Retrieves slides for a specific course ordered by week
 */
export async function getSlidesForCourse(courseId: string): Promise<SlideItem[]> {
  const slides = await db.slide.findMany({
    where: { courseId },
    orderBy: { week: "asc" },
  });

  return slides.map((slide) => ({
    id: slide.id,
    courseId: slide.courseId,
    title: slide.title,
    week: slide.week,
    fileName: slide.fileName,
    fileType: slide.fileType,
    fileSize: slide.fileSize,
    uploadedAt: slide.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));
}

/**
 * Retrieves recent slides across all courses (for Rep Desk)
 */
export async function getRecentSlides(limit = 6) {
  const slides = await db.slide.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        select: { code: true, title: true },
      },
    },
  });

  return slides.map((slide) => ({
    id: slide.id,
    courseId: slide.courseId,
    courseCode: slide.course.code,
    courseTitle: slide.course.title,
    title: slide.title,
    week: slide.week,
    fileName: slide.fileName,
    fileType: slide.fileType,
    fileSize: slide.fileSize,
    uploadedAt: slide.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));
}

/**
 * Secure file upload with storage streaming, database metadata saving, and rollback on error
 */
export async function uploadSlide(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    return { success: false, error: "Unauthorized: Only Course Representatives can upload slides." };
  }

  const courseId = formData.get("courseId") as string;
  const title = (formData.get("title") as string)?.trim();
  const weekNumber = parseInt(formData.get("week") as string, 10);
  const file = formData.get("file") as File | null;

  if (!courseId || !title || isNaN(weekNumber)) {
    return { success: false, error: "Course, slide title, and valid week number are required." };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "Please choose a lecture file (.pdf, .ppt, or .pptx) to upload." };
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return { success: false, error: "Selected course does not exist." };
  }

  // File validation
  const validation = validateSlideFile(file.name, file.type, file.size);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Format human-readable file size
  const sizeMB = file.size / (1024 * 1024);
  const formattedSize = sizeMB >= 1 ? `${sizeMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to GCS / local storage driver
  let storagePath: string;
  try {
    const uploadResult = await uploadSlideFile({
      buffer,
      fileName: file.name,
      fileType: file.type,
      courseCode: course.code,
      level: course.level,
      semester: course.semester,
      week: weekNumber,
    });
    storagePath = uploadResult.storagePath;
  } catch (storageError) {
    console.error("Storage upload failure:", storageError);
    return { success: false, error: "Failed to upload file to cloud storage. Please try again." };
  }

  // Save metadata to PostgreSQL with atomic rollback on error
  try {
    const slide = await db.slide.create({
      data: {
        courseId: course.id,
        title,
        week: weekNumber,
        fileName: file.name,
        fileType: validation.detectedType,
        fileSize: formattedSize,
        fileSizeBytes: file.size,
        storagePath,
        uploadedById: session.id,
      },
    });

    revalidatePath("/rep");
    revalidatePath("/student");
    revalidatePath(`/student/courses/${course.id}`);

    return { success: true, slide };
  } catch (dbError) {
    console.error("Database insert error, rolling back storage file:", dbError);
    // Atomic cleanup: remove orphaned file from storage
    await deleteSlideFile(storagePath);
    return { success: false, error: "Database error while shelving slide. The storage upload was safely rolled back." };
  }
}

/**
 * Deletes a slide from database and storage
 */
export async function deleteSlide(slideId: string) {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    return { success: false, error: "Unauthorized: Course Representative login required." };
  }

  try {
    const slide = await db.slide.findUnique({
      where: { id: slideId },
    });

    if (!slide) {
      return { success: false, error: "Slide not found." };
    }

    // Delete from storage
    await deleteSlideFile(slide.storagePath);

    // Delete from DB
    await db.slide.delete({
      where: { id: slideId },
    });

    revalidatePath("/rep");
    revalidatePath("/student");
    revalidatePath(`/student/courses/${slide.courseId}`);

    return { success: true };
  } catch (error) {
    console.error("Delete slide error:", error);
    return { success: false, error: "Failed to delete slide." };
  }
}

/**
 * Replaces a slide's file with a new upload while preserving metadata
 */
export async function replaceSlideFile(slideId: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    return { success: false, error: "Unauthorized: Course Representative login required." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "Please choose a replacement file." };
  }

  const existingSlide = await db.slide.findUnique({
    where: { id: slideId },
    include: { course: true },
  });

  if (!existingSlide) {
    return { success: false, error: "Slide not found." };
  }

  const validation = validateSlideFile(file.name, file.type, file.size);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const sizeMB = file.size / (1024 * 1024);
  const formattedSize = sizeMB >= 1 ? `${sizeMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload new file
  const uploadResult = await uploadSlideFile({
    buffer,
    fileName: file.name,
    fileType: file.type,
    courseCode: existingSlide.course.code,
    level: existingSlide.course.level,
    semester: existingSlide.course.semester,
    week: existingSlide.week,
  });

  const oldStoragePath = existingSlide.storagePath;

  try {
    await db.slide.update({
      where: { id: slideId },
      data: {
        fileName: file.name,
        fileType: validation.detectedType,
        fileSize: formattedSize,
        fileSizeBytes: file.size,
        storagePath: uploadResult.storagePath,
      },
    });

    // Delete old file
    await deleteSlideFile(oldStoragePath);

    revalidatePath("/rep");
    revalidatePath(`/student/courses/${existingSlide.courseId}`);

    return { success: true };
  } catch (error) {
    console.error("Replace slide error, rolling back new upload:", error);
    await deleteSlideFile(uploadResult.storagePath);
    return { success: false, error: "Failed to update slide in database. Upload rolled back." };
  }
}

/**
 * Generates a signed temporary URL for viewing or downloading a slide
 */
export async function getSlideSignedUrl(slideId: string, mode: "view" | "download" = "view") {
  const slide = await db.slide.findUnique({
    where: { id: slideId },
  });

  if (!slide) {
    return { success: false, error: "Slide not found." };
  }

  try {
    const url = await getSignedSlideUrl(slide.storagePath, slide.fileName, mode);
    return { success: true, url, fileName: slide.fileName };
  } catch (error) {
    console.error("Signed URL generation error:", error);
    return { success: false, error: "Could not generate secure slide access link." };
  }
}
