import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getCourses } from "@/app/actions/courses";
import { getRecentSlides } from "@/app/actions/slides";
import { getSession } from "@/lib/auth";
import { RepSlideItem } from "./RepSlideItem";

export default async function RepDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    redirect("/login");
  }

  const allCourses = await getCourses();
  const managed = allCourses;
  const recent = await getRecentSlides(6);

  const totalSlides = allCourses.reduce((acc, c) => acc + c.slideCount, 0);

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="Sign out" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-shelf">
              Course rep desk
            </p>
            <h1
              className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Keep the shelf current
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              Upload once per lecture. Edit details, replace files, or remove
              outdated slides without leaving the desk.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/rep/courses" className="btn-secondary shrink-0">
              Manage courses
            </Link>
            <Link href="/rep/upload" className="btn-primary shrink-0">
              Upload a slide
            </Link>
          </div>
        </div>

        {/* Database Metrics Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Total Courses
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-ink">
              {allCourses.length}
            </p>
          </div>
          <div className="surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Total Slides on Shelf
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-shelf">
              {totalSlides}
            </p>
          </div>
          <div className="surface col-span-2 p-5 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Active Rep Desk
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-ink truncate">
              {managed.length} {managed.length === 1 ? "Course" : "Courses"} Active
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="surface overflow-hidden px-5 sm:px-7">
            <div className="flex items-baseline justify-between border-b border-[var(--line)] py-5">
              <h2
                className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
                style={{ letterSpacing: "-0.02em" }}
              >
                Your courses
              </h2>
              <Link
                href="/rep/courses"
                className="text-sm font-semibold text-shelf hover:underline"
              >
                Manage
              </Link>
            </div>
            <div>
              {managed.length === 0 ? (
                <p className="py-10 text-sm text-ink-soft">
                  No courses added for this desk yet. Click &quot;Manage&quot; to add your courses.
                </p>
              ) : (
                managed.map((course) => {
                  const codeParts = course.code.split(" ");
                  const badgeText = codeParts.length > 1 ? codeParts[1] : course.code;
                  return (
                    <div
                      key={course.id}
                      className="row-link !cursor-default hover:pl-0 hover:bg-transparent"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                        {badgeText}
                      </span>
                      <div>
                        <p className="text-base font-semibold text-ink">
                          {course.title}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {course.code} · {course.slideCount}{" "}
                          {course.slideCount === 1 ? "slide" : "slides"} on shelf
                        </p>
                      </div>
                      <Link
                        href={`/rep/upload?course=${course.id}`}
                        className="text-sm font-semibold text-shelf hover:underline"
                      >
                        Add slide
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="surface overflow-hidden px-5 sm:px-7">
            <div className="border-b border-[var(--line)] py-5">
              <h2
                className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
                style={{ letterSpacing: "-0.02em" }}
              >
                Recently shelved
              </h2>
            </div>
            <div>
              {recent.length === 0 ? (
                <p className="py-10 text-sm text-ink-soft">
                  No slides uploaded yet. Use the &quot;Upload a slide&quot; button to add lecture files.
                </p>
              ) : (
                recent.map((slide) => (
                  <RepSlideItem key={slide.id} slide={slide} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
