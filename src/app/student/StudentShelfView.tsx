"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CourseWithCount } from "@/app/actions/courses";

const levels = [100, 200, 300, 400] as const;

type StudentShelfViewProps = {
  initialCourses: CourseWithCount[];
};

export function StudentShelfView({ initialCourses }: StudentShelfViewProps) {
  const [level, setLevel] = useState<(typeof levels)[number]>(200);
  const [semester, setSemester] = useState<1 | 2>(1);

  const filtered = useMemo(
    () =>
      initialCourses.filter(
        (course) => course.level === level && course.semester === semester,
      ),
    [initialCourses, level, semester],
  );

  return (
    <>
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
            {filtered.map((course) => {
              const codeParts = course.code.split(" ");
              const badgeText = codeParts.length > 1 ? codeParts[1] : course.code;
              return (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="row-link"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                    {badgeText}
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-ink">
                      {course.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">
                      {course.code} · {course.slideCount} {course.slideCount === 1 ? "slide" : "slides"}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-shelf">View</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <p className="mt-6 text-sm text-ink-soft">
        {initialCourses.length} courses across the program · synchronized from database
      </p>
    </>
  );
}
