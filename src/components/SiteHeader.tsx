import Link from "next/link";

type SiteHeaderProps = {
  compact?: boolean;
  actionHref?: string;
  actionLabel?: string;
};

export function SiteHeader({
  compact = false,
  actionHref = "/login",
  actionLabel = "Sign in",
}: SiteHeaderProps) {
  return (
    <header
      className={`mx-auto flex w-full max-w-6xl items-center justify-between px-5 ${
        compact ? "py-5" : "py-6"
      }`}
    >
      <Link href="/" className="group flex items-baseline gap-2">
        <span
          className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink"
          style={{ letterSpacing: "-0.03em" }}
        >
          SlideShelf
        </span>
        <span className="hidden text-sm font-medium text-ink-soft sm:inline">
          Lecture slides, organized
        </span>
      </Link>
      <Link href={actionHref} className="btn-secondary">
        {actionLabel}
      </Link>
    </header>
  );
}
