"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { courses, getCoursesByLevel } from "@/lib/data";

const levels = [100, 200, 300, 400] as const;

export default function StudentBrowsePage() {
  const [level, setLevel] = useState<(typeof levels)[number]>(200);
  const [semester, setSemester] = useState<1 | 2>(1);

  const filtered = useMemo(
    () => getCoursesByLevel(level, semester),
    [level, semester],
  );

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="Sign out" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-shelf">
            Student shelf
          </p>
          <h1
            className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Find your course
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Pick your level and semester, then open the course whose slides you
            need.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Level</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={`min-h-11 rounded-[12px] px-4 text-sm font-semibold transition ${
                    level === item
                      ? "bg-shelf text-white shadow-[0_10px_24px_rgba(15,107,86,0.22)]"
                      : "border border-[var(--line)] bg-white/70 text-ink hover:border-shelf/40"
                  }`}
                >
                  Level {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Semester</p>
            <div className="flex gap-2">
              {[1, 2].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSemester(item as 1 | 2)}
                  className={`min-h-11 rounded-[12px] px-4 text-sm font-semibold transition ${
                    semester === item
                      ? "bg-ink text-paper"
                      : "border border-[var(--line)] bg-white/70 text-ink hover:border-ink/30"
                  }`}
                >
                  Sem {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="surface overflow-hidden px-5 sm:px-7">
          <div className="flex items-baseline justify-between border-b border-[var(--line)] py-5">
            <h2
              className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
              style={{ letterSpacing: "-0.02em" }}
            >
              Level {level} · Semester {semester}
            </h2>
            <p className="text-sm font-medium text-ink-soft">
              {filtered.length} course{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-ink-soft">
              No courses on this shelf yet. Try another level or semester.
            </p>
          ) : (
            <div>
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="row-link"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                    {course.code.split(" ")[1]}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-ink">
                      {course.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">
                      {course.code} · {course.slideCount} slides
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-shelf">View</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <p className="mt-6 text-sm text-ink-soft">
          {courses.length} courses across the program · demo data for UI review
        </p>
      </main>
    </div>
  );
}
