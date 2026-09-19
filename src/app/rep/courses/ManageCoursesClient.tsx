"use client";

import { FormEvent, useState } from "react";
import { addCourse, deleteCourse, type CourseWithCount } from "@/app/actions/courses";

export function ManageCoursesClient({
  initialCourses,
}: {
  initialCourses: CourseWithCount[];
}) {
  const [list, setList] = useState<CourseWithCount[]>(initialCourses);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<number>(200);
  const [semester, setSemester] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!code.trim() || !title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await addCourse({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        level,
        semester,
      });

      if (!res.success || !res.course) {
        setError(res.error || "Failed to add course.");
        setLoading(false);
        return;
      }

      setList((prev) => [
        {
          id: res.course.id,
          code: res.course.code,
          title: res.course.title,
          level: res.course.level,
          semester: res.course.semester,
          slideCount: 0,
        },
        ...prev,
      ]);

      setCode("");
      setTitle("");
    } catch {
      setError("An unexpected error occurred while adding the course.");
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(courseId: string, courseTitle: string) {
    if (!confirm(`Are you sure you want to remove "${courseTitle}"? All associated slides will also be removed.`)) {
      return;
    }

    try {
      const res = await deleteCourse(courseId);
      if (res.success) {
        setList((prev) => prev.filter((item) => item.id !== courseId));
      } else {
        alert(res.error || "Failed to remove course.");
      }
    } catch {
      alert("Error removing course.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={onAdd} className="surface h-fit p-7">
        <h2
          className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
          style={{ letterSpacing: "-0.02em" }}
        >
          Add course
        </h2>

        {error && (
          <div className="mt-4 rounded-[10px] border border-accent/40 bg-accent/10 px-3.5 py-2 text-sm text-ink">
            {error}
          </div>
        )}

        <label className="label mt-5" htmlFor="code">
          Course code
        </label>
        <input
          id="code"
          className="field mb-4"
          placeholder="CS 230"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <label className="label" htmlFor="title">
          Course title
        </label>
        <input
          id="title"
          className="field mb-4"
          placeholder="Algorithms"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="level">
              Level
            </label>
            <select
              id="level"
              className="field"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              <option value={100}>Level 100</option>
              <option value={200}>Level 200</option>
              <option value={300}>Level 300</option>
              <option value={400}>Level 400</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="semester">
              Semester
            </label>
            <select
              id="semester"
              className="field"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Adding to shelf..." : "Add to shelf"}
        </button>
      </form>

      <section className="surface overflow-hidden px-5 sm:px-7">
        <div className="border-b border-[var(--line)] py-5">
          <h2
            className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            Active courses
          </h2>
        </div>
        {list.length === 0 ? (
          <p className="py-12 text-sm text-ink-soft">
            No active courses found. Add one on the left to start organizing slides.
          </p>
        ) : (
          list.map((course) => {
            const digits = course.code.replace(/[^0-9]/g, "").slice(0, 3) || "NEW";
            return (
              <div
                key={course.id}
                className="row-link !cursor-default hover:pl-0 hover:bg-transparent"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                  {digits}
                </span>
                <div>
                  <p className="font-semibold text-ink">{course.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {course.code} · Level {course.level} · Sem {course.semester} · {course.slideCount}{" "}
                    {course.slideCount === 1 ? "slide" : "slides"}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-ink-soft hover:text-accent"
                  onClick={() => onRemove(course.id, course.title)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
