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
  let course: any = null;
  try {
    course = await getCourseById(courseId);
  } catch (err) {
    console.error("CourseSlidesPage getCourseById error:", err);
  }
  if (!course) notFound();

  let courseSlides: any[] = [];
  try {
    courseSlides = await getSlidesForCourse(courseId);
  } catch (err) {
    console.error("CourseSlidesPage getSlidesForCourse error:", err);
  }

  let isRep = false;
  try {
    const session = await getSession();
    isRep = session?.role === "COURSE_REP";
  } catch {
    isRep = false;
  }

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

        {/* Lecturer section */}
        {(course.lecturerName || course.lecturerEmail) && (
          <div className="surface mb-8 flex flex-wrap items-center justify-between gap-4 p-5 sm:px-7">
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-base font-bold text-shelf">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-shelf">
                  Course Lecturer
                </p>
                <p className="text-base font-bold text-ink">
                  {course.lecturerName || "Lecturer"}
                </p>
                {course.lecturerEmail && (
                  <p className="text-sm text-ink-soft">
                    {course.lecturerEmail}
                  </p>
                )}
              </div>
            </div>

            {course.lecturerEmail && (
              <a
                href={`mailto:${course.lecturerEmail}?subject=${encodeURIComponent(`${course.code} Course Inquiry — SlideShelf`)}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e07a2f] px-5 text-sm font-bold !text-white shadow-[0_8px_20px_rgba(224,122,47,0.3)] transition hover:bg-[#c86824] hover:shadow-[0_10px_24px_rgba(224,122,47,0.4)] active:scale-[0.98]"
              >
                <svg
                  className="h-4 w-4 shrink-0 !text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span className="!text-white font-bold">Contact Lecturer</span>
              </a>
            )}
          </div>
        )}

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
