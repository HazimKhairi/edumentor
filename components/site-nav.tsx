import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, Search, ShieldCheck, UserCog } from "lucide-react";
import { NAV } from "@/lib/data";

const CATEGORIES = [
  { label: "Computer Science", href: "/courses?cat=cs" },
  { label: "Mathematics", href: "/courses?cat=math" },
  { label: "Statistics", href: "/courses?cat=stats" },
  { label: "Foundation", href: "/courses?cat=foundation" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 bg-bone/95 backdrop-blur supports-[backdrop-filter]:bg-bone/85 border-b border-rule">
      {/* Top row: logo, search, auth */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="EduMentor"
            width={160}
            height={48}
            className="h-10 md:h-11 w-auto"
            priority
          />
        </Link>

        {/* Categories dropdown trigger (visible md+) */}
        <details className="hidden md:block relative">
          <summary className="list-none cursor-pointer px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink rounded-sm flex items-center gap-1">
            Categories
            <ChevronDown size={14} aria-hidden />
          </summary>
          <div className="absolute top-full left-0 mt-1 w-64 bg-bone border border-rule rounded-md shadow-lg p-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="block px-3 py-2 text-sm hover:bg-paper-dark rounded-sm"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </details>

        {/* Search */}
        <form className="flex-1 max-w-2xl hidden sm:block">
          <label className="relative flex items-center">
            <Search size={16} aria-hidden className="absolute left-3 text-ink-muted" />
            <input
              type="search"
              placeholder="Search courses, mentors, topics"
              className="input pl-9 rounded-full bg-paper-dark/60"
            />
          </label>
        </form>

        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">
            My learning
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Get started
          </Link>

          {/* Account dropdown — gates role-specific consoles behind a
              user menu instead of exposing them as top-level nav items */}
          <details className="relative">
            <summary
              className="list-none cursor-pointer flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-rule hover:border-ink"
              aria-label="Account menu"
            >
              <span className="size-7 rounded-full bg-oxblood text-bone flex items-center justify-center text-xs font-semibold">
                AH
              </span>
              <ChevronDown size={14} className="text-ink-muted" />
            </summary>
            <div className="absolute right-0 top-full mt-1 w-60 bg-bone border border-rule rounded-md shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-rule mb-1">
                <div className="text-sm font-semibold">Aiman Hakimi</div>
                <div className="text-xs text-ink-muted">2023607832, Mentee</div>
              </div>
              <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-paper-dark">
                My learning
              </Link>
              <Link href="/feedback" className="block px-3 py-2 text-sm hover:bg-paper-dark">
                Reviews
              </Link>
              <div className="border-t border-rule my-1" />
              <div className="px-3 pt-2 pb-1 text-xs text-ink-muted uppercase tracking-wide">
                Switch console
              </div>
              <Link href="/mentor" className="px-3 py-2 text-sm hover:bg-paper-dark flex items-center gap-2">
                <UserCog size={14} className="text-ink-muted" /> Mentor console (senior student)
              </Link>
              <Link href="/admin" className="px-3 py-2 text-sm hover:bg-paper-dark flex items-center gap-2">
                <ShieldCheck size={14} className="text-ink-muted" /> Admin console (lecturer)
              </Link>
              <div className="border-t border-rule my-1" />
              <Link href="/login" className="px-3 py-2 text-sm hover:bg-paper-dark flex items-center gap-2 text-ink-muted">
                <LogOut size={14} /> Sign out
              </Link>
            </div>
          </details>
        </div>
      </div>

      {/* Sub-row: section nav (visible md+) */}
      <div className="border-t border-rule hidden md:block">
        <div className="mx-auto max-w-[1400px] px-6 flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-3 py-2.5 text-sm font-medium text-ink-soft hover:text-oxblood transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
