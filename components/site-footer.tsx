import Image from "next/image";
import Link from "next/link";

// Every link below points to a real route in this app. Add only after the
// matching page exists.
const COLS = [
  {
    title: "Learn",
    links: [
      { label: "Browse courses", href: "/courses" },
      { label: "My dashboard", href: "/dashboard" },
      { label: "Discussion rooms", href: "/discussion" },
      { label: "Assignments", href: "/assignments" },
      { label: "Attendance", href: "/attendance" },
      { label: "Reviews", href: "/feedback" },
    ],
  },
  {
    title: "Mentor",
    links: [
      { label: "Become a mentor (CGPA 3.20+)", href: "/register" },
      { label: "Mentor console", href: "/mentor" },
      { label: "Schedule a class", href: "/mentor/classes/new" },
      { label: "Create an assignment", href: "/mentor/assignments/new" },
    ],
  },
  {
    title: "Admin",
    links: [
      { label: "Admin console", href: "/admin" },
      { label: "Manage users", href: "/admin/users" },
      { label: "Manage courses", href: "/admin/courses" },
      { label: "Evaluation rubrics", href: "/admin/evaluations" },
      { label: "Reports", href: "/reports" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Capture face", href: "/profile/face" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-paper-dark/50 border-t border-rule">
      <div className="mx-auto max-w-[1400px] px-6 py-14 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="EduMentor"
              width={200}
              height={60}
              className="h-14 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-sm">
            A learning platform for mentor-led classrooms. Built for UiTM,
            open to any cohort that wants to share a syllabus, a discussion,
            and an honest review.
          </p>
          <p className="mt-6 text-xs text-ink-muted">
            Faculty of Computer &amp; Mathematical Sciences, UiTM
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title} className="col-span-6 md:col-span-2">
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
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ink-muted">
          <div>© 2026 EduMentor | A learning platform for UiTM, FCMS</div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-ink">Home</Link>
            <Link href="/courses" className="hover:text-ink">Courses</Link>
            <Link href="/login" className="hover:text-ink">Sign in</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
