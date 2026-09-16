"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { courses } from "@/lib/data";

function UploadForm() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("course") ?? "cs201";
  const [courseId, setCourseId] = useState(preset);
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("6");
  const [fileName, setFileName] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const selected = useMemo(
    () => courses.find((course) => course.id === courseId),
    [courseId],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setDone(true);
    window.setTimeout(() => router.push("/rep"), 1200);
  }

  return (
    <form onSubmit={onSubmit} className="surface mx-auto w-full max-w-xl p-7 sm:p-8">
      {done ? (
        <div className="py-10 text-center">
          <p
            className="font-[family-name:var(--font-display)] text-3xl font-bold text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            Shelved.
          </p>
          <p className="mt-3 text-ink-soft">
            Students can open this slide from {selected?.title ?? "the course"}{" "}
            now.
          </p>
        </div>
      ) : (
        <>
          <label className="label" htmlFor="course">
            Course
          </label>
          <select
            id="course"
            className="field mb-4"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            {courses
              .filter((course) => course.level === 200)
              .map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.title}
                </option>
              ))}
          </select>

          <label className="label" htmlFor="title">
            Slide title
          </label>
          <input
            id="title"
            className="field mb-4"
            placeholder="e.g. Recursion & Divide-and-Conquer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="label" htmlFor="week">
            Week
          </label>
          <input
            id="week"
            className="field mb-4"
            type="number"
            min={1}
            max={16}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            required
          />

          <p className="label">Lecture file</p>
          <label className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-shelf/35 bg-mist/50 px-4 py-10 text-center transition hover:bg-mist">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileName(file ? file.name : null);
              }}
            />
            <span className="font-semibold text-ink">
              {fileName ?? "Drop PDF or PPTX here"}
            </span>
            <span className="mt-2 text-sm text-ink-soft">
              Stored in Google Cloud Storage · metadata stays in the database
              {!fileName ? " · optional in this UI prototype" : ""}
            </span>
          </label>

          <button type="submit" className="btn-primary w-full" disabled={!title.trim()}>
            Upload to shelf
          </button>
        </>
      )}
    </form>
  );
}

export default function UploadPage() {
  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/rep" actionLabel="Back to desk" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <div className="mx-auto mb-8 max-w-xl">
          <Link
            href="/rep"
            className="inline-flex text-sm font-semibold text-ink-soft hover:text-shelf"
          >
            ← Rep desk
          </Link>
          <h1
            className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Upload a lecture slide
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Choose the course, name the week, and place the file on the shelf.
          </p>
        </div>
        <Suspense fallback={<div className="surface mx-auto h-96 max-w-xl" />}>
          <UploadForm />
        </Suspense>
      </main>
    </div>
  );
}
