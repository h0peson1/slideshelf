"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import type { Role } from "@/lib/data";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") === "rep" ? "rep" : "student") as Role;
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const destination = useMemo(
    () => (role === "rep" ? "/rep" : "/student"),
    [role],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    router.push(destination);
  }

  return (
    <form onSubmit={onSubmit} className="surface mx-auto w-full max-w-md p-7 sm:p-8">
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-[12px] bg-mist/70 p-1">
        {(
          [
            { id: "student", label: "Student" },
            { id: "rep", label: "Course rep" },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setRole(option.id)}
            className={`rounded-[10px] px-3 py-2.5 text-sm font-semibold transition ${
              role === option.id
                ? "bg-white text-ink shadow-[0_6px_16px_rgba(16,35,28,0.08)]"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="field mb-4"
        type="email"
        autoComplete="email"
        placeholder={
          role === "rep" ? "courserep@university.edu" : "student@university.edu"
        }
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="label" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        className="field mb-6"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="btn-primary w-full">
        Continue to {role === "rep" ? "rep desk" : "my courses"}
      </button>

      <p className="mt-5 text-center text-sm text-ink-soft">
        Prototype sign-in — any email works for the UI walkthrough.
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/" actionLabel="Back home" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6">
        <div className="mx-auto mb-8 max-w-md text-center">
          <h1
            className="animate-rise font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Sign in to SlideShelf
          </h1>
          <p className="animate-rise-delay-1 mt-3 text-lg text-ink-soft">
            Choose your role, then jump straight into slides or uploads.
          </p>
        </div>
        <div className="animate-rise-delay-2">
          <Suspense fallback={<div className="surface mx-auto h-80 max-w-md" />}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link href="/" className="font-semibold text-shelf underline-offset-2 hover:underline">
            See how it works
          </Link>
        </p>
      </main>
    </div>
  );
}
