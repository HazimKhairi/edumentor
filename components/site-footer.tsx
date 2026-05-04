import Image from "next/image";
import Link from "next/link";
import { NAV, SUBJECT } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t-2 border-ink bg-paper">
      {/* Colophon header */}
      <div className="border-b border-rule">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 py-6 text-xs font-medium uppercase tracking-wider text-ink-muted">
          <div className="col-span-6 md:col-span-3">
            <div className="text-ink">Colophon</div>
          </div>
          <div className="col-span-6 md:col-span-3">
            Set in Fraunces &amp; Manrope
          </div>
          <div className="hidden md:block md:col-span-3">
            Printed in browser, MY
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            ISSN 2026 / 04
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-y-12 gap-x-6 px-6 py-16">
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-end gap-5">
            <span className="relative size-20 shrink-0 overflow-hidden border border-ink bg-bone">
              <Image
                src="/logo.jpeg"
                alt="EduMentor"
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <div className="display text-[88px] leading-[0.85] tracking-[-0.045em]">
              Edu<span className="display-italic text-oxblood">Mentor</span>
            </div>
          </div>
          <p className="mt-6 max-w-md text-ink-soft text-base leading-relaxed">
            An editorial periodical for mentor-led classrooms. Designed
            for{" "}
            <span className="eyebrow-italic">{SUBJECT.code}</span>{" "}
            and the cohort that gathers around it. Read the desk, mark
            attendance, settle the assignment, leave a kindly review.
          </p>

          <div className="mt-8 flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
            <Link href="/login" className="link-reveal">Sign in</Link>
            <span className="text-ink-muted">/</span>
            <Link href="/login" className="link-reveal">Apply as mentor</Link>
            <span className="text-ink-muted">/</span>
            <a href="#" className="link-reveal">Press kit</a>
          </div>
        </div>

        <div className="col-span-6 md:col-span-2 md:col-start-7">
          <div className="label mb-4">Sections</div>
          <ul className="space-y-2 text-[14px]">
            {NAV.map((item) => (
              <li key={item.href} className="flex items-baseline gap-3">
                <span className="numeral">{item.numeral}</span>
                <Link href={item.href} className="link-reveal">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-6 md:col-span-2">
          <div className="label mb-4">Roles</div>
          <ul className="space-y-2 text-[14px]">
            <li className="flex items-baseline gap-3"><span className="numeral">A</span><span>Admin</span></li>
            <li className="flex items-baseline gap-3"><span className="numeral">M</span><span>Mentor</span></li>
            <li className="flex items-baseline gap-3"><span className="numeral">S</span><span>Mentee</span></li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="label mb-4">Subscribe to the broadsheet</div>
          <form className="flex items-center gap-0 border-b border-ink">
            <input
              type="email"
              placeholder="your.name@uitm.edu.my"
              className="flex-1 bg-transparent py-2 text-[14px] outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-ink hover:text-oxblood transition-colors"
            >
              Send →
            </button>
          </form>
          <p className="mt-3 text-xs text-ink-muted leading-relaxed">
            One letter per week. The class digest, with notes from the
            mentors&apos; desk and a single recommended reading.
          </p>
        </div>
      </div>

      {/* Sign-off */}
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-5 text-xs font-medium uppercase tracking-wider text-ink-muted md:flex-row md:items-center md:justify-between">
          <div>© 2026 EduMentor Periodical — All rights typeset</div>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Conduct</span>
            <span>Accessibility</span>
            <span className="text-ink">v 0.1 — Draft proof</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
