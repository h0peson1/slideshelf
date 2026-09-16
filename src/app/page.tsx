import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="relative isolate min-h-screen overflow-hidden">
        {/* Full-bleed visual plane */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a3b] via-[#0f6b56] to-[#08362d]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.28), transparent 42%), radial-gradient(circle at 82% 68%, rgba(224,122,47,0.32), transparent 38%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          {/* Shelf rows as edge-to-edge atmospheric content */}
          <div className="animate-shelf absolute inset-y-0 right-0 hidden w-full max-w-xl flex-col justify-center gap-3 px-6 opacity-90 sm:px-10 lg:flex lg:max-w-[46%] lg:pr-16">
            {[
              { week: "W1", title: "Arrays & Linked Lists", meta: "PDF · 2.4 MB" },
              { week: "W2", title: "Stacks and Queues", meta: "PPTX · 4.1 MB" },
              { week: "W3", title: "Trees & Binary Search", meta: "PDF · 3.0 MB" },
              { week: "W4", title: "Hash Tables", meta: "PDF · 1.8 MB" },
              { week: "W5", title: "Graph Traversal", meta: "PPTX · 5.2 MB" },
            ].map((item, index) => (
              <div
                key={item.week}
                className="animate-float flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-[2px]"
                style={{ animationDelay: `${index * 0.28}s` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e07a2f] text-xs font-bold text-white">
                  {item.week}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/65">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Soft fade so copy stays readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08362d] via-[#0a4a3b]/88 to-transparent lg:via-[#0a4a3b]/75" />
        </div>

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span
              className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-white"
              style={{ letterSpacing: "-0.03em" }}
            >
              SlideShelf
            </span>
            <span className="hidden text-sm font-medium text-white/65 sm:inline">
              Lecture slides, organized
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
          >
            Sign in
          </Link>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl items-center px-5 pb-16 pt-6">
          <section className="relative z-10 max-w-xl">
            <p
              className="animate-rise font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
              style={{ letterSpacing: "-0.045em" }}
            >
              SlideShelf
            </p>
            <h1
              className="animate-rise-delay-1 mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug text-white sm:text-3xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Upload lecture slides once. Students find them whenever exams hit.
            </h1>
            <p className="animate-rise-delay-1 mt-4 max-w-md text-lg leading-relaxed text-white/75">
              Stop resending the same PDFs on WhatsApp. Course reps shelve slides
              by level, course, and week — students browse and download on demand.
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e07a2f] px-5 font-semibold text-white shadow-[0_12px_28px_rgba(224,122,47,0.28)] transition hover:bg-[#c86824]"
              >
                Get the slides
              </Link>
              <Link
                href="/login?role=rep"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
              >
                I&apos;m the course rep
              </Link>
            </div>
          </section>
        </main>
      </div>

      <section className="atmosphere border-t border-[var(--line)] bg-white/50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
          {[
            {
              title: "One upload",
              copy: "Course reps add a slide once with title, week, and file. Done.",
            },
            {
              title: "Clear shelves",
              copy: "Students pick level and semester, then open the course they need.",
            },
            {
              title: "Exam-ready access",
              copy: "Open or download anytime — no chasing the rep in the group chat.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2
                className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink"
                style={{ letterSpacing: "-0.02em" }}
              >
                {item.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
