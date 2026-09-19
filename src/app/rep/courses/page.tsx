import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getCourses } from "@/app/actions/courses";
import { getSession } from "@/lib/auth";
import { ManageCoursesClient } from "./ManageCoursesClient";

export default async function ManageCoursesPage() {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    redirect("/login");
  }

  const initialCourses = await getCourses();

  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/rep" actionLabel="Back to desk" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4">
        <Link
          href="/rep"
          className="inline-flex text-sm font-semibold text-ink-soft hover:text-shelf"
        >
          ← Rep desk
        </Link>
        <div className="mt-4 mb-10 max-w-2xl">
          <h1
            className="font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Manage courses
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            Add the courses you represent so slides land on the right shelf.
          </p>
        </div>

        <ManageCoursesClient initialCourses={initialCourses} />
      </main>
    </div>
  );
}
