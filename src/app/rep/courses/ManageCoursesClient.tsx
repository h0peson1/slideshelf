"use client";

import { FormEvent, useState } from "react";
import { addCourse, updateCourse, deleteCourse, type CourseWithCount } from "@/app/actions/courses";

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
  const [lecturerName, setLecturerName] = useState("");
  const [lecturerEmail, setLecturerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingCourse, setEditingCourse] = useState<CourseWithCount | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editLevel, setEditLevel] = useState<number>(200);
  const [editSemester, setEditSemester] = useState<1 | 2>(1);
  const [editLecturerName, setEditLecturerName] = useState("");
  const [editLecturerEmail, setEditLecturerEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
        lecturerName: lecturerName.trim() || undefined,
        lecturerEmail: lecturerEmail.trim() || undefined,
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
          lecturerName: res.course.lecturerName,
          lecturerEmail: res.course.lecturerEmail,
          slideCount: 0,
        },
        ...prev,
      ]);

      setCode("");
      setTitle("");
      setLecturerName("");
      setLecturerEmail("");
    } catch {
      setError("An unexpected error occurred while adding the course.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(course: CourseWithCount) {
    setEditingCourse(course);
    setEditCode(course.code);
    setEditTitle(course.title);
    setEditLevel(course.level);
    setEditSemester((course.semester === 2 ? 2 : 1) as 1 | 2);
    setEditLecturerName(course.lecturerName || "");
    setEditLecturerEmail(course.lecturerEmail || "");
    setEditError(null);
  }

  async function onSaveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editingCourse || !editCode.trim() || !editTitle.trim()) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const res = await updateCourse(editingCourse.id, {
        code: editCode.trim().toUpperCase(),
        title: editTitle.trim(),
        level: editLevel,
        semester: editSemester,
        lecturerName: editLecturerName.trim(),
        lecturerEmail: editLecturerEmail.trim(),
      });

      if (!res.success || !res.course) {
        setEditError(res.error || "Failed to update course.");
        setEditLoading(false);
        return;
      }

      setList((prev) =>
        prev.map((item) =>
          item.id === editingCourse.id
            ? {
                ...item,
                code: res.course.code,
                title: res.course.title,
                level: res.course.level,
                semester: res.course.semester,
                lecturerName: res.course.lecturerName,
                lecturerEmail: res.course.lecturerEmail,
              }
            : item,
        ),
      );

      setEditingCourse(null);
    } catch {
      setEditError("An unexpected error occurred while updating the course.");
    } finally {
      setEditLoading(false);
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
        if (editingCourse?.id === courseId) {
          setEditingCourse(null);
        }
      } else {
        alert(res.error || "Failed to remove course.");
      }
    } catch {
      alert("Error removing course.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Add Course Form */}
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
          placeholder="Algorithms & Complexity"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="mb-4 grid grid-cols-2 gap-3">
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

        <div className="mb-6 border-t border-[var(--line)] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-shelf">
            Lecturer Contact (Optional)
          </p>
          <label className="label" htmlFor="lecturerName">
            Lecturer name
          </label>
          <input
            id="lecturerName"
            className="field mb-3"
            placeholder="e.g. Dr. Kwesi Mensah"
            value={lecturerName}
            onChange={(e) => setLecturerName(e.target.value)}
          />

          <label className="label" htmlFor="lecturerEmail">
            Lecturer email
          </label>
          <input
            id="lecturerEmail"
            type="email"
            className="field"
            placeholder="e.g. lecturer@university.edu"
            value={lecturerEmail}
            onChange={(e) => setLecturerEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Adding to shelf..." : "Add to shelf"}
        </button>
      </form>

      {/* Course List & Edit Modal */}
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
          <div className="divide-y divide-[var(--line)]">
            {list.map((course) => {
              const digits = course.code.replace(/[^0-9]/g, "").slice(0, 3) || "NEW";
              return (
                <div
                  key={course.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4.5"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                      {digits}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{course.title}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        {course.code} · Level {course.level} · Sem {course.semester} · {course.slideCount}{" "}
                        {course.slideCount === 1 ? "slide" : "slides"}
                      </p>
                      {(course.lecturerName || course.lecturerEmail) && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-shelf">
                          <span>👤</span>
                          <span>
                            {course.lecturerName || "Lecturer"}
                            {course.lecturerEmail ? ` · ${course.lecturerEmail}` : ""}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-shelf hover:text-shelf"
                      onClick={() => startEdit(course)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-ink-soft transition hover:text-accent"
                      onClick={() => onRemove(course.id, course.title)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={onSaveEdit}
            className="surface w-full max-w-lg p-6 sm:p-7 shadow-2xl animate-rise"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-shelf">Course settings</p>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink">
                  Edit {editingCourse.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="text-ink-soft hover:text-ink text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="mt-4 rounded-[10px] border border-accent/40 bg-accent/10 px-3.5 py-2 text-sm text-ink">
                {editError}
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="editCode">
                  Course code
                </label>
                <input
                  id="editCode"
                  className="field"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="editTitle">
                  Course title
                </label>
                <input
                  id="editTitle"
                  className="field"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="editLevel">
                  Level
                </label>
                <select
                  id="editLevel"
                  className="field"
                  value={editLevel}
                  onChange={(e) => setEditLevel(Number(e.target.value))}
                >
                  <option value={100}>Level 100</option>
                  <option value={200}>Level 200</option>
                  <option value={300}>Level 300</option>
                  <option value={400}>Level 400</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="editSemester">
                  Semester
                </label>
                <select
                  id="editSemester"
                  className="field"
                  value={editSemester}
                  onChange={(e) => setEditSemester(Number(e.target.value) as 1 | 2)}
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[var(--line)] bg-mist/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-shelf mb-2">
                Lecturer Contact Details
              </p>
              <label className="label" htmlFor="editLecturerName">
                Lecturer name
              </label>
              <input
                id="editLecturerName"
                className="field mb-3 bg-white"
                placeholder="e.g. Dr. Kwesi Mensah"
                value={editLecturerName}
                onChange={(e) => setEditLecturerName(e.target.value)}
              />

              <label className="label" htmlFor="editLecturerEmail">
                Lecturer email
              </label>
              <input
                id="editLecturerEmail"
                type="email"
                className="field bg-white"
                placeholder="e.g. lecturer@university.edu"
                value={editLecturerEmail}
                onChange={(e) => setEditLecturerEmail(e.target.value)}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
                onClick={() => setEditingCourse(null)}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary py-2.5 px-5 disabled:opacity-60"
                disabled={editLoading}
              >
                {editLoading ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

