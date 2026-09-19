import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export type Role = "STUDENT" | "COURSE_REP";

export type DbUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type DbCourse = {
  id: string;
  code: string;
  title: string;
  level: number;
  semester: number;
  createdAt: string;
  updatedAt: string;
};

export type DbSlide = {
  id: string;
  courseId: string;
  title: string;
  week: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileSizeBytes: number;
  storagePath: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
};

type DbSchema = {
  users: DbUser[];
  courses: DbCourse[];
  slides: DbSlide[];
};

const DB_DIR = path.join(process.cwd(), "storage");
const DB_FILE = path.join(DB_DIR, "database.json");

function ensureDbFile(): DbSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      // If file corrupted, reinitialize
    }
  }

  // Initial Seed Data
  const defaultHash = bcrypt.hashSync("password123", 10);
  const now = new Date().toISOString();

  const initialUsers: DbUser[] = [
    {
      id: "usr_rep_1",
      name: "Alex Vance (Course Rep)",
      email: "rep@university.edu",
      passwordHash: defaultHash,
      role: "COURSE_REP",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_stu_1",
      name: "Sam Jordan",
      email: "student@university.edu",
      passwordHash: defaultHash,
      role: "STUDENT",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const initialCourses: DbCourse[] = [
    { id: "c_cs201", code: "CS 201", title: "Data Structures", level: 200, semester: 1, createdAt: now, updatedAt: now },
    { id: "c_cs205", code: "CS 205", title: "Database Systems", level: 200, semester: 1, createdAt: now, updatedAt: now },
    { id: "c_cs214", code: "CS 214", title: "Computer Networks", level: 200, semester: 2, createdAt: now, updatedAt: now },
    { id: "c_cs101", code: "CS 101", title: "Introduction to Computing", level: 100, semester: 1, createdAt: now, updatedAt: now },
    { id: "c_cs110", code: "CS 110", title: "Programming Fundamentals", level: 100, semester: 2, createdAt: now, updatedAt: now },
    { id: "c_cs301", code: "CS 301", title: "Operating Systems", level: 300, semester: 1, createdAt: now, updatedAt: now },
    { id: "c_cs320", code: "CS 320", title: "Software Engineering", level: 300, semester: 2, createdAt: now, updatedAt: now },
    { id: "c_cs410", code: "CS 410", title: "Distributed Systems", level: 400, semester: 1, createdAt: now, updatedAt: now },
  ];

  const initialSlides: DbSlide[] = [
    {
      id: "s1",
      courseId: "c_cs201",
      title: "Arrays & Linked Lists",
      week: 1,
      fileName: "week-01-arrays.pdf",
      fileType: "PDF",
      fileSize: "2.4 MB",
      fileSizeBytes: 2400000,
      storagePath: "slides/level-200/semester-1/cs-201/week-01/week-01-arrays.pdf",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-02T10:00:00.000Z",
      updatedAt: "2026-09-02T10:00:00.000Z",
    },
    {
      id: "s2",
      courseId: "c_cs201",
      title: "Stacks and Queues",
      week: 2,
      fileName: "week-02-stacks.pptx",
      fileType: "PPTX",
      fileSize: "4.1 MB",
      fileSizeBytes: 4100000,
      storagePath: "slides/level-200/semester-1/cs-201/week-02/week-02-stacks.pptx",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-09T10:00:00.000Z",
      updatedAt: "2026-09-09T10:00:00.000Z",
    },
    {
      id: "s3",
      courseId: "c_cs201",
      title: "Trees & Binary Search",
      week: 3,
      fileName: "week-03-trees.pdf",
      fileType: "PDF",
      fileSize: "3.0 MB",
      fileSizeBytes: 3000000,
      storagePath: "slides/level-200/semester-1/cs-201/week-03/week-03-trees.pdf",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-16T10:00:00.000Z",
      updatedAt: "2026-09-16T10:00:00.000Z",
    },
    {
      id: "s4",
      courseId: "c_cs201",
      title: "Hash Tables",
      week: 4,
      fileName: "week-04-hashing.pdf",
      fileType: "PDF",
      fileSize: "1.8 MB",
      fileSizeBytes: 1800000,
      storagePath: "slides/level-200/semester-1/cs-201/week-04/week-04-hashing.pdf",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-23T10:00:00.000Z",
      updatedAt: "2026-09-23T10:00:00.000Z",
    },
    {
      id: "s5",
      courseId: "c_cs201",
      title: "Graph Traversal",
      week: 5,
      fileName: "week-05-graphs.pptx",
      fileType: "PPTX",
      fileSize: "5.2 MB",
      fileSizeBytes: 5200000,
      storagePath: "slides/level-200/semester-1/cs-201/week-05/week-05-graphs.pptx",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-30T10:00:00.000Z",
      updatedAt: "2026-09-30T10:00:00.000Z",
    },
    {
      id: "s6",
      courseId: "c_cs205",
      title: "Relational Model",
      week: 1,
      fileName: "week-01-relational.pdf",
      fileType: "PDF",
      fileSize: "2.1 MB",
      fileSizeBytes: 2100000,
      storagePath: "slides/level-200/semester-1/cs-205/week-01/week-01-relational.pdf",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-03T10:00:00.000Z",
      updatedAt: "2026-09-03T10:00:00.000Z",
    },
    {
      id: "s7",
      courseId: "c_cs205",
      title: "SQL Queries",
      week: 2,
      fileName: "week-02-sql.pdf",
      fileType: "PDF",
      fileSize: "2.7 MB",
      fileSizeBytes: 2700000,
      storagePath: "slides/level-200/semester-1/cs-205/week-02/week-02-sql.pdf",
      uploadedById: "usr_rep_1",
      createdAt: "2026-09-10T10:00:00.000Z",
      updatedAt: "2026-09-10T10:00:00.000Z",
    },
  ];

  // Provision sample files for local storage driver demo
  for (const s of initialSlides) {
    const filePath = path.join(DB_DIR, s.storagePath);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(
        filePath,
        Buffer.from(`%PDF-1.4\n% SlideShelf Demo File: ${s.title}\nCourse ID: ${s.courseId} Week: ${s.week}\n%%EOF`),
      );
    }
  }

  const initialSchema: DbSchema = {
    users: initialUsers,
    courses: initialCourses,
    slides: initialSlides,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), "utf-8");
  return initialSchema;
}

function saveDb(schema: DbSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), "utf-8");
}

export const db = {
  user: {
    async findUnique(args: { where: { email?: string; id?: string } }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            let query = supabase.from("users").select("*");
            if (args.where.email) {
              query = query.ilike("email", args.where.email.trim());
            } else if (args.where.id) {
              query = query.eq("id", args.where.id);
            }
            const { data, error } = await query.maybeSingle();
            if (!error && data) {
              return {
                id: data.id,
                name: data.name,
                email: data.email,
                passwordHash: data.password_hash,
                role: data.role as Role,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
              };
            }
          } catch (err) {
            console.warn("Supabase user query failed, checking fallback:", err);
          }
        }
      }

      const data = ensureDbFile();
      return (
        data.users.find(
          (u) =>
            (args.where.email && u.email.toLowerCase() === args.where.email.toLowerCase()) ||
            (args.where.id && u.id === args.where.id),
        ) ?? null
      );
    },

    async create(args: {
      data: { name: string; email: string; passwordHash: string; role: Role };
    }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from("users")
              .insert({
                name: args.data.name,
                email: args.data.email.toLowerCase(),
                password_hash: args.data.passwordHash,
                role: args.data.role,
              })
              .select()
              .single();

            if (!error && data) {
              return {
                id: data.id,
                name: data.name,
                email: data.email,
                passwordHash: data.password_hash,
                role: data.role as Role,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
              };
            }
          } catch (err) {
            console.warn("Supabase user insert failed, using fallback:", err);
          }
        }
      }

      const data = ensureDbFile();
      const now = new Date().toISOString();
      const newUser: DbUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...args.data,
        createdAt: now,
        updatedAt: now,
      };
      data.users.push(newUser);
      saveDb(data);
      return newUser;
    },
  },

  course: {
    async findMany(args?: {
      where?: { level?: number; semester?: number };
      orderBy?: { code?: "asc" | "desc" };
      include?: { _count?: { select?: { slides?: boolean } } };
    }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            let query = supabase.from("courses").select("*, slides(count)");
            if (args?.where?.level !== undefined) {
              query = query.eq("level", args.where.level);
            }
            if (args?.where?.semester !== undefined) {
              query = query.eq("semester", args.where.semester);
            }
            query = query.order("code", { ascending: args?.orderBy?.code !== "desc" });

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
              return data.map((c: any) => ({
                id: c.id,
                code: c.code,
                title: c.title,
                level: c.level,
                semester: c.semester,
                createdAt: c.created_at,
                updatedAt: c.updated_at,
                _count: {
                  slides: c.slides?.[0]?.count ?? 0,
                },
              }));
            }
          } catch (err) {
            console.warn("Supabase course query failed, checking fallback:", err);
          }
        }
      }

      const data = ensureDbFile();
      let list = [...data.courses];

      if (args?.where) {
        if (args.where.level !== undefined) {
          list = list.filter((c) => c.level === args.where!.level);
        }
        if (args.where.semester !== undefined) {
          list = list.filter((c) => c.semester === args.where!.semester);
        }
      }

      list.sort((a, b) => a.code.localeCompare(b.code));

      return list.map((c) => ({
        ...c,
        _count: {
          slides: data.slides.filter((s) => s.courseId === c.id).length,
        },
      }));
    },

    async findUnique(args: {
      where: { id?: string; code?: string };
      include?: { _count?: { select?: { slides?: boolean } } };
    }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            let query = supabase.from("courses").select("*, slides(count)");
            if (args.where.id) {
              query = query.eq("id", args.where.id);
            } else if (args.where.code) {
              query = query.ilike("code", args.where.code.trim());
            }
            const { data, error } = await query.maybeSingle();
            if (!error && data) {
              return {
                id: data.id,
                code: data.code,
                title: data.title,
                level: data.level,
                semester: data.semester,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                _count: {
                  slides: data.slides?.[0]?.count ?? 0,
                },
              };
            }
          } catch (err) {
            console.warn("Supabase course findUnique failed:", err);
          }
        }
      }

      const data = ensureDbFile();
      const course =
        data.courses.find(
          (c) =>
            (args.where.id && c.id === args.where.id) ||
            (args.where.code && c.code.toLowerCase() === args.where.code.toLowerCase()),
        ) ?? null;

      if (!course) return null;

      return {
        ...course,
        _count: {
          slides: data.slides.filter((s) => s.courseId === course.id).length,
        },
      };
    },

    async create(args: {
      data: { code: string; title: string; level: number; semester: number };
    }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from("courses")
              .insert({
                code: args.data.code.trim().toUpperCase(),
                title: args.data.title.trim(),
                level: args.data.level,
                semester: args.data.semester,
              })
              .select()
              .single();

            if (!error && data) {
              return {
                id: data.id,
                code: data.code,
                title: data.title,
                level: data.level,
                semester: data.semester,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
              };
            }
          } catch (err) {
            console.warn("Supabase course create failed:", err);
          }
        }
      }

      const data = ensureDbFile();
      const now = new Date().toISOString();
      const newCourse: DbCourse = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...args.data,
        createdAt: now,
        updatedAt: now,
      };
      data.courses.push(newCourse);
      saveDb(data);
      return newCourse;
    },

    async delete(args: { where: { id: string } }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            await supabase.from("courses").delete().eq("id", args.where.id);
            return { id: args.where.id };
          } catch (err) {
            console.warn("Supabase course delete failed:", err);
          }
        }
      }

      const data = ensureDbFile();
      data.courses = data.courses.filter((c) => c.id !== args.where.id);
      data.slides = data.slides.filter((s) => s.courseId !== args.where.id);
      saveDb(data);
      return { id: args.where.id };
    },
  },

  slide: {
    async findMany(args?: {
      where?: { courseId?: string };
      take?: number;
      orderBy?: { week?: "asc" | "desc"; createdAt?: "asc" | "desc" };
      include?: { course?: { select?: { code?: boolean; title?: boolean } } };
    }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            let query = supabase.from("slides").select("*, courses(code, title)");
            if (args?.where?.courseId) {
              query = query.eq("course_id", args.where.courseId);
            }
            if (args?.orderBy?.week) {
              query = query.order("week", { ascending: args.orderBy.week === "asc" });
            } else {
              query = query.order("created_at", { ascending: false });
            }
            if (args?.take) {
              query = query.limit(args.take);
            }

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
              return data.map((s: any) => ({
                id: s.id,
                courseId: s.course_id,
                title: s.title,
                week: s.week,
                fileName: s.file_name,
                fileType: s.file_type,
                fileSize: s.file_size,
                fileSizeBytes: s.file_size_bytes,
                storagePath: s.storage_path,
                uploadedById: s.uploaded_by_id,
                createdAt: new Date(s.created_at),
                updatedAt: new Date(s.updated_at),
                course: {
                  code: s.courses?.code ?? "",
                  title: s.courses?.title ?? "",
                },
              }));
            }
          } catch (err) {
            console.warn("Supabase slide query failed:", err);
          }
        }
      }

      const data = ensureDbFile();
      let list = [...data.slides];

      if (args?.where?.courseId) {
        list = list.filter((s) => s.courseId === args.where!.courseId);
      }

      if (args?.orderBy?.week) {
        list.sort((a, b) => (args.orderBy!.week === "desc" ? b.week - a.week : a.week - b.week));
      } else if (args?.orderBy?.createdAt) {
        list.sort((a, b) =>
          args.orderBy!.createdAt === "desc"
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      }

      if (args?.take) {
        list = list.slice(0, args.take);
      }

      return list.map((s) => {
        const course = data.courses.find((c) => c.id === s.courseId);
        return {
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          course: {
            code: course?.code ?? "",
            title: course?.title ?? "",
          },
        };
      });
    },

    async findUnique(args: { where: { id: string }; include?: { course?: boolean } }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from("slides")
              .select("*, courses(*)")
              .eq("id", args.where.id)
              .maybeSingle();

            if (!error && data) {
              return {
                id: data.id,
                courseId: data.course_id,
                title: data.title,
                week: data.week,
                fileName: data.file_name,
                fileType: data.file_type,
                fileSize: data.file_size,
                fileSizeBytes: data.file_size_bytes,
                storagePath: data.storage_path,
                uploadedById: data.uploaded_by_id,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
                course: data.courses
                  ? {
                      id: data.courses.id,
                      code: data.courses.code,
                      title: data.courses.title,
                      level: data.courses.level,
                      semester: data.courses.semester,
                      createdAt: data.courses.created_at,
                      updatedAt: data.courses.updated_at,
                    }
                  : { id: data.course_id, code: "", title: "", level: 200, semester: 1, createdAt: "", updatedAt: "" },
              };
            }
          } catch (err) {
            console.warn("Supabase slide findUnique failed:", err);
          }
        }
      }

      const data = ensureDbFile();
      const slide = data.slides.find((s) => s.id === args.where.id) ?? null;
      if (!slide) return null;

      const course = data.courses.find((c) => c.id === slide.courseId);
      return {
        ...slide,
        createdAt: new Date(slide.createdAt),
        updatedAt: new Date(slide.updatedAt),
        course: course ?? { id: slide.courseId, code: "", title: "", level: 200, semester: 1, createdAt: "", updatedAt: "" },
      };
    },

    async findFirst(args?: { where?: { courseId?: string; week?: number; title?: string } }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            let query = supabase.from("slides").select("*").limit(1);
            if (args?.where?.courseId) query = query.eq("course_id", args.where.courseId);
            if (args?.where?.week) query = query.eq("week", args.where.week);
            if (args?.where?.title) query = query.ilike("title", args.where.title);

            const { data, error } = await query.maybeSingle();
            if (!error && data) {
              return {
                id: data.id,
                courseId: data.course_id,
                title: data.title,
                week: data.week,
                fileName: data.file_name,
                fileType: data.file_type,
                fileSize: data.file_size,
                fileSizeBytes: data.file_size_bytes,
                storagePath: data.storage_path,
                uploadedById: data.uploaded_by_id,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
              };
            }
          } catch (err) {
            console.warn("Supabase findFirst error:", err);
          }
        }
      }

      const data = ensureDbFile();
      const slide =
        data.slides.find(
          (s) =>
            (!args?.where?.courseId || s.courseId === args.where.courseId) &&
            (!args?.where?.week || s.week === args.where.week) &&
            (!args?.where?.title || s.title.toLowerCase() === args.where.title.toLowerCase()),
        ) ?? null;

      if (!slide) return null;
      return {
        ...slide,
        createdAt: new Date(slide.createdAt),
        updatedAt: new Date(slide.updatedAt),
      };
    },

    async create(args: {
      data: {
        courseId: string;
        title: string;
        week: number;
        fileName: string;
        fileType: string;
        fileSize: string;
        fileSizeBytes: number;
        storagePath: string;
        uploadedById: string;
      };
    }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from("slides")
              .insert({
                course_id: args.data.courseId,
                title: args.data.title,
                week: args.data.week,
                file_name: args.data.fileName,
                file_type: args.data.fileType,
                file_size: args.data.fileSize,
                file_size_bytes: args.data.fileSizeBytes,
                storage_path: args.data.storagePath,
                uploaded_by_id: args.data.uploadedById,
              })
              .select()
              .single();

            if (!error && data) {
              return {
                id: data.id,
                courseId: data.course_id,
                title: data.title,
                week: data.week,
                fileName: data.file_name,
                fileType: data.file_type,
                fileSize: data.file_size,
                fileSizeBytes: data.file_size_bytes,
                storagePath: data.storage_path,
                uploadedById: data.uploaded_by_id,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
              };
            }
          } catch (err) {
            console.warn("Supabase slide insert failed:", err);
          }
        }
      }

      const data = ensureDbFile();
      const now = new Date().toISOString();
      const newSlide: DbSlide = {
        id: `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...args.data,
        createdAt: now,
        updatedAt: now,
      };
      data.slides.push(newSlide);
      saveDb(data);
      return {
        ...newSlide,
        createdAt: new Date(newSlide.createdAt),
        updatedAt: new Date(newSlide.updatedAt),
      };
    },

    async update(args: { where: { id: string }; data: Partial<DbSlide> }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            const updatePayload: any = {};
            if (args.data.fileName) updatePayload.file_name = args.data.fileName;
            if (args.data.fileType) updatePayload.file_type = args.data.fileType;
            if (args.data.fileSize) updatePayload.file_size = args.data.fileSize;
            if (args.data.fileSizeBytes) updatePayload.file_size_bytes = args.data.fileSizeBytes;
            if (args.data.storagePath) updatePayload.storage_path = args.data.storagePath;

            const { data, error } = await supabase
              .from("slides")
              .update(updatePayload)
              .eq("id", args.where.id)
              .select()
              .single();

            if (!error && data) {
              return {
                id: data.id,
                courseId: data.course_id,
                title: data.title,
                week: data.week,
                fileName: data.file_name,
                fileType: data.file_type,
                fileSize: data.file_size,
                fileSizeBytes: data.file_size_bytes,
                storagePath: data.storage_path,
                uploadedById: data.uploaded_by_id,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
              };
            }
          } catch (err) {
            console.warn("Supabase slide update error:", err);
          }
        }
      }

      const data = ensureDbFile();
      const index = data.slides.findIndex((s) => s.id === args.where.id);
      if (index === -1) throw new Error("Slide not found");

      data.slides[index] = {
        ...data.slides[index],
        ...args.data,
        updatedAt: new Date().toISOString(),
      };
      saveDb(data);
      return {
        ...data.slides[index],
        createdAt: new Date(data.slides[index].createdAt),
        updatedAt: new Date(data.slides[index].updatedAt),
      };
    },

    async delete(args: { where: { id: string } }) {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            await supabase.from("slides").delete().eq("id", args.where.id);
            return { id: args.where.id };
          } catch (err) {
            console.warn("Supabase slide delete error:", err);
          }
        }
      }

      const data = ensureDbFile();
      data.slides = data.slides.filter((s) => s.id !== args.where.id);
      saveDb(data);
      return { id: args.where.id };
    },
  },
};
