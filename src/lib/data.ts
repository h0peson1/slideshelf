export type Role = "student" | "rep";

export type Course = {
  id: string;
  code: string;
  title: string;
  level: 100 | 200 | 300 | 400;
  semester: 1 | 2;
  slideCount: number;
};

export type Slide = {
  id: string;
  courseId: string;
  title: string;
  week: number;
  fileName: string;
  fileType: "PDF" | "PPTX";
  fileSize: string;
  uploadedAt: string;
};

export const courses: Course[] = [
  {
    id: "cs201",
    code: "CS 201",
    title: "Data Structures",
    level: 200,
    semester: 1,
    slideCount: 8,
  },
  {
    id: "cs205",
    code: "CS 205",
    title: "Database Systems",
    level: 200,
    semester: 1,
    slideCount: 6,
  },
  {
    id: "cs214",
    code: "CS 214",
    title: "Computer Networks",
    level: 200,
    semester: 2,
    slideCount: 5,
  },
  {
    id: "cs101",
    code: "CS 101",
    title: "Introduction to Computing",
    level: 100,
    semester: 1,
    slideCount: 7,
  },
  {
    id: "cs110",
    code: "CS 110",
    title: "Programming Fundamentals",
    level: 100,
    semester: 2,
    slideCount: 9,
  },
  {
    id: "cs301",
    code: "CS 301",
    title: "Operating Systems",
    level: 300,
    semester: 1,
    slideCount: 4,
  },
  {
    id: "cs320",
    code: "CS 320",
    title: "Software Engineering",
    level: 300,
    semester: 2,
    slideCount: 6,
  },
  {
    id: "cs410",
    code: "CS 410",
    title: "Distributed Systems",
    level: 400,
    semester: 1,
    slideCount: 3,
  },
];

export const slides: Slide[] = [
  {
    id: "s1",
    courseId: "cs201",
    title: "Arrays & Linked Lists",
    week: 1,
    fileName: "week-01-arrays.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedAt: "Sep 2, 2026",
  },
  {
    id: "s2",
    courseId: "cs201",
    title: "Stacks and Queues",
    week: 2,
    fileName: "week-02-stacks.pptx",
    fileType: "PPTX",
    fileSize: "4.1 MB",
    uploadedAt: "Sep 9, 2026",
  },
  {
    id: "s3",
    courseId: "cs201",
    title: "Trees & Binary Search",
    week: 3,
    fileName: "week-03-trees.pdf",
    fileType: "PDF",
    fileSize: "3.0 MB",
    uploadedAt: "Sep 16, 2026",
  },
  {
    id: "s4",
    courseId: "cs201",
    title: "Hash Tables",
    week: 4,
    fileName: "week-04-hashing.pdf",
    fileType: "PDF",
    fileSize: "1.8 MB",
    uploadedAt: "Sep 23, 2026",
  },
  {
    id: "s5",
    courseId: "cs201",
    title: "Graph Traversal",
    week: 5,
    fileName: "week-05-graphs.pptx",
    fileType: "PPTX",
    fileSize: "5.2 MB",
    uploadedAt: "Sep 30, 2026",
  },
  {
    id: "s6",
    courseId: "cs205",
    title: "Relational Model",
    week: 1,
    fileName: "week-01-relational.pdf",
    fileType: "PDF",
    fileSize: "2.1 MB",
    uploadedAt: "Sep 3, 2026",
  },
  {
    id: "s7",
    courseId: "cs205",
    title: "SQL Queries",
    week: 2,
    fileName: "week-02-sql.pdf",
    fileType: "PDF",
    fileSize: "2.7 MB",
    uploadedAt: "Sep 10, 2026",
  },
];

export function getCourse(id: string) {
  return courses.find((course) => course.id === id);
}

export function getSlidesForCourse(courseId: string) {
  return slides
    .filter((slide) => slide.courseId === courseId)
    .sort((a, b) => a.week - b.week);
}

export function getCoursesByLevel(level: number, semester?: number) {
  return courses.filter(
    (course) =>
      course.level === level &&
      (semester === undefined || course.semester === semester),
  );
}
