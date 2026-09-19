import { SiteHeader } from "@/components/SiteHeader";
import { getCourses } from "@/app/actions/courses";
import { getSession } from "@/lib/auth";
import { StudentShelfView } from "./StudentShelfView";

export default async function StudentBrowsePage() {
  const initialCourses = await getCourses();
  const session = await getSession();
  const isRep = session?.role === "COURSE_REP";

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader
        actionHref={isRep ? "/rep" : "/login"}
        actionLabel={isRep ? "Rep desk" : "Rep sign in"}
      />
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

        <StudentShelfView initialCourses={initialCourses} />
      </main>
    </div>
  );
}
