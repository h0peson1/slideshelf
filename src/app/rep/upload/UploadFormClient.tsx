"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { CourseWithCount } from "@/app/actions/courses";
import { uploadSlide } from "@/app/actions/slides";

type UploadFormClientProps = {
  courses: CourseWithCount[];
};

export function UploadFormClient({ courses }: UploadFormClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("course") ?? (courses[0]?.id ?? "");

  const [courseId, setCourseId] = useState(preset);
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const selected = useMemo(
    () => courses.find((course) => course.id === courseId) ?? courses[0],
    [courseId, courses],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Please select a lecture file (.pdf, .ppt, or .pptx) to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("courseId", courseId || courses[0]?.id || "");
    formData.append("title", title);
    formData.append("week", week);
    formData.append("file", file);

    try {
      const res = await uploadSlide(formData);
      if (res.success) {
        setDone(true);
        window.setTimeout(() => {
          router.push("/rep");
          router.refresh();
        }, 1400);
      } else {
        setError(res.error || "Failed to upload slide.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected network or storage error occurred.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface mx-auto w-full max-w-xl p-7 sm:p-8">
      {done ? (
        <div className="py-10 text-center animate-rise">
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
          {error && (
            <div className="mb-5 rounded-[10px] border border-accent/40 bg-accent/10 px-3.5 py-2.5 text-sm font-medium text-ink">
              {error}
            </div>
          )}

          <label className="label" htmlFor="course">
            Course
          </label>
          <select
            id="course"
            className="field mb-4"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            disabled={loading}
          >
            {courses.length === 0 ? (
              <option value="">No courses available</option>
            ) : (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.title} (Level {course.level})
                </option>
              ))
            )}
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
            disabled={loading}
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
            disabled={loading}
          />

          <p className="label">Lecture file</p>
          <label className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-shelf/35 bg-mist/50 px-4 py-10 text-center transition hover:bg-mist">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx"
              className="sr-only"
              disabled={loading}
              onChange={(e) => {
                const picked = e.target.files?.[0];
                setFile(picked ?? null);
                if (picked) setError(null);
              }}
            />
            <span className="font-semibold text-ink">
              {file ? file.name : "Drop PDF or PPTX here, or click to browse"}
            </span>
            <span className="mt-2 text-sm text-ink-soft">
              {file
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload`
                : "Stored securely in cloud storage · metadata recorded in PostgreSQL"}
            </span>
          </label>

          <button
            type="submit"
            className="btn-primary w-full disabled:opacity-60"
            disabled={!title.trim() || !file || loading}
          >
            {loading ? "Uploading to shelf..." : "Upload to shelf"}
          </button>
        </>
      )}
    </form>
  );
}
