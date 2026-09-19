"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type CourseWithCount = {
  id: string;
  code: string;
  title: string;
  level: number;
  semester: number;
  slideCount: number;
};

/**
 * Retrieves courses filtered by level and semester with slide counts
 */
export async function getCourses(level?: number, semester?: number): Promise<CourseWithCount[]> {
  const whereClause: { level?: number; semester?: number } = {};
  if (level !== undefined) whereClause.level = level;
  if (semester !== undefined) whereClause.semester = semester;

  const courses = await db.course.findMany({
    where: whereClause,
    orderBy: { code: "asc" },
    include: {
      _count: {
        select: { slides: true },
      },
    },
  });

  return courses.map((course) => ({
    id: course.id,
    code: course.code,
    title: course.title,
    level: course.level,
    semester: course.semester,
    slideCount: course._count.slides,
  }));
}

/**
 * Retrieves a single course by its unique ID
 */
export async function getCourseById(courseId: string): Promise<CourseWithCount | null> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      _count: {
        select: { slides: true },
      },
    },
  });

  if (!course) return null;

  return {
    id: course.id,
    code: course.code,
    title: course.title,
    level: course.level,
    semester: course.semester,
    slideCount: course._count.slides,
  };
}

/**
 * Adds a new course (Course Rep only)
 */
export async function addCourse(data: {
  code: string;
  title: string;
  level: number;
  semester: number;
}) {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    return { success: false, error: "Unauthorized: Course Representative login required." };
  }

  const code = data.code.trim().toUpperCase();
  const title = data.title.trim();

  if (!code || !title) {
    return { success: false, error: "Course code and title are required." };
  }

  try {
    const existing = await db.course.findUnique({
      where: { code },
    });

    if (existing) {
      return { success: false, error: `Course code '${code}' already exists.` };
    }

    const course = await db.course.create({
      data: {
        code,
        title,
        level: data.level || 200,
        semester: data.semester || 1,
      },
    });

    revalidatePath("/rep");
    revalidatePath("/rep/courses");
    revalidatePath("/student");

    return { success: true, course };
  } catch (error) {
    console.error("Add course error:", error);
    return { success: false, error: "Failed to add course to database." };
  }
}

/**
 * Removes a course and cascaded slides (Course Rep only)
 */
export async function deleteCourse(courseId: string) {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    return { success: false, error: "Unauthorized: Course Representative login required." };
  }

  try {
    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/rep");
    revalidatePath("/rep/courses");
    revalidatePath("/student");

    return { success: true };
  } catch (error) {
    console.error("Delete course error:", error);
    return { success: false, error: "Failed to delete course." };
  }
}
