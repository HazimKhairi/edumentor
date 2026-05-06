import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/lib/data";

const COLS = [
  {
    title: "Learn",
    links: [
      { label: "Browse courses", href: "/courses" },
      { label: "My dashboard", href: "/dashboard" },
      { label: "Discussion rooms", href: "/discussion" },
      { label: "Assignments", href: "/assignments" },
    ],
  },
  {
    title: "Mentor",
    links: [
      { label: "Become a mentor (CGPA 3.20+)", href: "/register" },
      { label: "Mentor handbook", href: "#" },
      { label: "Lecturer console", href: "/admin" },
      { label: "Community guidelines", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our mission", href: "#" },
      { label: "Reports & impact", href: "/reports" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-paper-dark/50 border-t border-rule">
      <div className="mx-auto max-w-[1400px] px-6 py-14 grid grid-cols-12 gap-8">
        {/* Brand */}
        <div className="col-span-12 md:col-span-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="EduMentor" width={200} height={60} className="h-14 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-sm">
            A learning platform for mentor-led classrooms. Built for UiTM,
            open to any cohort that wants to share a syllabus, a discussion,
            and an honest review.
          </p>
          <form className="mt-6 flex items-center gap-2 max-w-sm">
            <input
              type="email"
              placeholder="you@uitm.edu.my"
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-xs text-ink-muted">
            One letter a week. Class digests and recommended reading.
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title} className="col-span-6 md:col-span-2 md:col-start-auto">
            <h4 className="text-sm font-semibold text-ink mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-muted hover:text-oxblood transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-12 md:col-span-2">
          <h4 className="text-sm font-semibold text-ink mb-4">Sections</h4>
          <ul className="space-y-2">
            {NAV.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-muted hover:text-oxblood transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ink-muted">
          <div>© 2026 EduMentor | A learning platform for UiTM, FCMS</div>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-ink">Privacy</Link>
            <Link href="#" className="hover:text-ink">Terms</Link>
            <Link href="#" className="hover:text-ink">Conduct</Link>
            <Link href="#" className="hover:text-ink">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
