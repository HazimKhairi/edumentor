import Link from "next/link";
import { NAV, SUBJECT } from "@/lib/data";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      {/* Folio strip */}
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          <div className="flex items-center gap-6">
            <span className="font-mono">Vol. I — Issue 04</span>
            <span className="hidden md:inline font-mono">{SUBJECT.semester}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline font-mono">Kuala Lumpur, MY</span>
            <span className="inline-flex items-center gap-2 font-mono">
              <span className="size-1.5 rounded-full bg-oxblood blink" />
              Live now
            </span>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-6 pt-6 pb-3">
        <Link href="/" className="group flex items-end gap-3">
          <span className="display text-[44px] leading-none tracking-[-0.04em]">
            Edu<span className="display-italic text-oxblood">Mentor</span>
          </span>
          <span className="hidden md:inline-block translate-y-[-4px] border-l border-rule pl-3 text-[10px] uppercase tracking-[0.22em] font-mono text-ink-muted">
            The Mentorship
            <br />
            Periodical
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-muted">
          <kbd className="rounded-sm border border-rule bg-bone px-1.5 py-0.5 text-[10px]">⌘</kbd>
          <kbd className="rounded-sm border border-rule bg-bone px-1.5 py-0.5 text-[10px]">K</kbd>
          <span>Search the desk</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="link-reveal text-[11px] font-mono uppercase tracking-[0.22em]"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] text-bone hover:bg-oxblood hover:border-oxblood transition-colors"
          >
            Begin enrolment
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Nav rail */}
      <nav className="border-t border-b border-rule">
        <div className="mx-auto flex max-w-[1400px] items-stretch overflow-x-auto px-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[12px] font-mono uppercase tracking-[0.2em] text-ink-soft hover:bg-bone hover:text-ink transition-colors border-r border-rule last:border-r-0"
            >
              <span className="text-[10px] text-ink-muted">{item.numeral}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-3 px-4 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
            <span>Today</span>
            <span className="text-ink">04 May 2026</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
