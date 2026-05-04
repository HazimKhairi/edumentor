import Link from "next/link";
import { ArrowRight, BookOpen, Users, ClipboardList, FileBarChart } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { COURSES, USERS, EVALUATION_RUBRICS, STATS } from "@/lib/data";

export const metadata = {
  title: "Admin console | EduMentor",
  description: "Steward the academic record.",
};

const TILES = [
  {
    href: "/admin/courses",
    icon: BookOpen,
    title: "Manage courses",
    desc: "Add, edit, or remove courses from the catalogue.",
  },
  {
    href: "/admin/users",
    icon: Users,
    title: "Manage users",
    desc: "Audit accounts, suspend, or remove users.",
  },
  {
    href: "/admin/evaluations",
    icon: ClipboardList,
    title: "Evaluation rubrics",
    desc: "Author the questions used in mentor reviews.",
  },
  {
    href: "/reports",
    icon: FileBarChart,
    title: "View reports",
    desc: "Term metrics, audits, and broadsheet exports.",
  },
];

export default function AdminLanding() {
  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <span className="text-ink">Admin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin console</h1>
          <p className="mt-2 text-ink-soft">
            Steward of the academic record. Manage courses, users, rubrics, and reports.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Total courses</div>
            <div className="text-3xl font-bold mt-1">{COURSES.length}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Total users</div>
            <div className="text-3xl font-bold mt-1">{USERS.length}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Active rubrics</div>
            <div className="text-3xl font-bold mt-1">{EVALUATION_RUBRICS.filter((r) => r.active).length}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Attendance accuracy</div>
            <div className="text-3xl font-bold mt-1">{STATS[3].value}</div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 pb-16">
          <h2 className="text-xl font-bold mb-6">Quick actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TILES.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="card card-hover p-6 flex items-start gap-4 group"
                >
                  <span className="size-12 rounded-md bg-oxblood/10 text-oxblood flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1 group-hover:text-oxblood transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{t.desc}</p>
                  </div>
                  <ArrowRight size={18} className="text-ink-muted group-hover:text-oxblood mt-1 shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
