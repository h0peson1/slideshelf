"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/rep";

  const [email, setEmail] = useState("rep@university.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "rep" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      router.push(from || "/rep");
      router.refresh();
    } catch {
      setError("Network or server error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface mx-auto w-full max-w-md p-7 sm:p-8">
      <div className="mb-6 flex items-center justify-between rounded-[12px] bg-mist/70 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-shelf">
          Course Rep Desk
        </span>
        <span className="text-xs font-medium text-ink-soft">
          Administrator Access
        </span>
      </div>

      {error && (
        <div className="mb-5 rounded-[10px] border border-accent/40 bg-accent/10 px-3.5 py-2.5 text-sm font-medium text-ink">
          {error}
        </div>
      )}

      <label className="label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="field mb-4"
        type="email"
        autoComplete="email"
        placeholder="courserep@university.edu"
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

      <button
        type="submit"
        className="btn-primary w-full disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Enter Course Rep Desk"}
      </button>

      <div className="mt-6 border-t border-[var(--line)] pt-5 text-center">
        <p className="text-xs text-ink-soft">
          Default Course Rep: <span className="font-semibold text-ink">rep@university.edu</span> / password123
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          Looking for lecture slides?{" "}
          <Link href="/student" className="font-semibold text-shelf underline-offset-2 hover:underline">
            Browse slides directly →
          </Link>
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader actionHref="/student" actionLabel="Browse slides" />
      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6">
        <div className="mx-auto mb-8 max-w-md text-center">
          <h1
            className="animate-rise font-[family-name:var(--font-display)] text-4xl font-bold text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Course Rep Sign In
          </h1>
          <p className="animate-rise-delay-1 mt-3 text-lg text-ink-soft">
            Manage your courses, shelve new lecture slides, and keep files up to date.
          </p>
        </div>
        <div className="animate-rise-delay-2">
          <Suspense fallback={<div className="surface mx-auto h-80 max-w-md" />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
