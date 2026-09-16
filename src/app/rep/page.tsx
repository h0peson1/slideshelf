import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { courses, slides } from "@/lib/data";

export default function RepDashboardPage() {
  const managed = courses.filter((course) => course.level === 200);
  const recent = slides.slice(0, 5);

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="Sign out" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
          <Link href="/rep/upload" className="btn-primary shrink-0">
            Upload a slide
          </Link>
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
              {managed.map((course) => (
                <div key={course.id} className="row-link !cursor-default hover:pl-0 hover:bg-transparent">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-sm font-bold text-shelf">
                    {course.code.split(" ")[1]}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-ink">
                      {course.title}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {course.code} · {course.slideCount} slides on shelf
                    </p>
                  </div>
                  <Link
                    href={`/rep/upload?course=${course.id}`}
                    className="text-sm font-semibold text-shelf"
                  >
                    Add slide
                  </Link>
                </div>
              ))}
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
              {recent.map((slide) => (
                <div
                  key={slide.id}
                  className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-4 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-ink">{slide.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      Week {slide.week} · {slide.fileType} · {slide.fileSize}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-3 text-sm font-semibold">
                    <button type="button" className="text-ink-soft hover:text-ink">
                      Edit
                    </button>
                    <button type="button" className="text-accent hover:opacity-80">
                      Replace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
