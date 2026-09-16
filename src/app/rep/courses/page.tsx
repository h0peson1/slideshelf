"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { courses, type Course } from "@/lib/data";

export default function ManageCoursesPage() {
  const [list, setList] = useState<Course[]>(
    courses.filter((course) => course.level === 200),
  );
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState<1 | 2>(1);

  function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!code.trim() || !title.trim()) return;
    setList((prev) => [
      {
        id: `new-${Date.now()}`,
        code: code.trim().toUpperCase(),
        title: title.trim(),
        level: 200,
        semester,
        slideCount: 0,
      },
      ...prev,
    ]);
    setCode("");
    setTitle("");
  }

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/rep" actionLabel="Back to desk" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <Link
          href="/rep"
          className="inline-flex text-sm font-semibold text-ink-soft hover:text-shelf"
        >
          ← Rep desk
        </Link>
        <div className="mt-4 mb-10 max-w-2xl">
          <h1
            className="font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Manage courses
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Add the courses you represent so slides land on the right shelf.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={onAdd} className="surface h-fit p-7">
            <h2
              className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
              style={{ letterSpacing: "-0.02em" }}
            >
              Add course
            </h2>
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
            <label className="label" htmlFor="semester">
              Semester
            </label>
            <select
              id="semester"
              className="field mb-6"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
            <button type="submit" className="btn-primary w-full">
              Add to shelf
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
            {list.map((course) => (
              <div key={course.id} className="row-link !cursor-default hover:pl-0 hover:bg-transparent">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                  {course.code.replace(/[^0-9]/g, "").slice(0, 3) || "NEW"}
                </span>
                <div>
                  <p className="font-semibold text-ink">{course.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {course.code} · Sem {course.semester} · {course.slideCount}{" "}
                    slides
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-ink-soft hover:text-accent"
                  onClick={() =>
                    setList((prev) => prev.filter((item) => item.id !== course.id))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
