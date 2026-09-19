import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getCourseById } from "@/app/actions/courses";
import { getSlidesForCourse } from "@/app/actions/slides";
import { getSession } from "@/lib/auth";
import { SlideActionButtons } from "./SlideActionButtons";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseSlidesPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  if (!course) notFound();

  const courseSlides = await getSlidesForCourse(courseId);
  const session = await getSession();
  const isRep = session?.role === "COURSE_REP";

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader
        actionHref={isRep ? "/rep" : "/login"}
        actionLabel={isRep ? "Rep desk" : "Rep sign in"}
      />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-shelf"
        >
          ← All courses
        </Link>

        <div className="mt-5 mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-shelf">
            {course.code} · Level {course.level} · Sem {course.semester}
          </p>
          <h1
            className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            {course.title}
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Open a week to preview, or download the file to your device.
          </p>
        </div>

        <section className="surface overflow-hidden px-5 sm:px-7">
          <div className="flex items-baseline justify-between border-b border-[var(--line)] py-5">
            <h2
              className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
              style={{ letterSpacing: "-0.02em" }}
            >
              Available slides
            </h2>
            <p className="text-sm font-medium text-ink-soft">
              {courseSlides.length} {courseSlides.length === 1 ? "file" : "files"}
            </p>
          </div>

          {courseSlides.length === 0 ? (
            <p className="py-12 text-ink-soft">
              No lecture slides yet. Your course representative hasn&apos;t uploaded any slides for this course.
            </p>
          ) : (
            <ul>
              {courseSlides.map((slide) => (
                <li key={slide.id} className="row-link !cursor-default hover:pl-0 hover:bg-transparent">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
                    W{slide.week}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-ink">
                      {slide.title}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {slide.fileType} · {slide.fileSize} · Uploaded{" "}
                      {slide.uploadedAt}
                    </p>
                  </div>
                  <SlideActionButtons slideId={slide.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
