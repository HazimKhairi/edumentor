import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// SV Syaza: the footer should point out to real institutional pages, not back
// into the app. These are live UiTM portals, opened in a new tab.
const COLS = [
  {
    title: "UiTM",
    links: [
      { label: "Official website", href: "https://www.uitm.edu.my/en/" },
      { label: "iStudent Portal", href: "https://istudent.uitm.edu.my/" },
      { label: "i-Learn", href: "https://i-learn.uitm.edu.my/" },
      { label: "MyStudent", href: "https://mystudent.uitm.edu.my/" },
    ],
  },
  {
    title: "Student services",
    links: [
      { label: "PTAR Library", href: "https://mobileptar.uitm.edu.my/" },
      { label: "Student Affairs (HEP)", href: "https://hep.uitm.edu.my/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-paper-dark/50 border-t border-rule">
      <div className="mx-auto max-w-[1400px] px-6 py-14 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-6">
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
          <div key={col.title} className="col-span-6 md:col-span-3">
            <h4 className="text-sm font-semibold text-ink mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-oxblood transition-colors"
                  >
                    {l.label}
                    <ExternalLink size={12} className="opacity-60" />
                  </a>
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
