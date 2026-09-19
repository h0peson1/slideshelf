import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getCourses } from "@/app/actions/courses";
import { getSession } from "@/lib/auth";
import { UploadFormClient } from "./UploadFormClient";

export default async function UploadPage() {
  const session = await getSession();
  if (!session || session.role !== "COURSE_REP") {
    redirect("/login");
  }

  const courses = await getCourses();

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
          <UploadFormClient courses={courses} />
        </Suspense>
      </main>
    </div>
  );
}
