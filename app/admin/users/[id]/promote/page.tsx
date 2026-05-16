import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpCircle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  MENTOR_MIN_CGPA,
  MENTOR_SUBJECT_CAP,
  USERS,
  coursesForMentor,
} from "@/lib/data";

export async function generateStaticParams() {
  return USERS.filter((u) => u.role === "Mentee").map((u) => ({ id: u.id }));
}

export default async function PromoteMenteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = USERS.find((x) => x.id === id);
  if (!u || u.role !== "Mentee") notFound();

  const cgpa = u.cgpa ?? 0;
  const cgpaPass = cgpa >= MENTOR_MIN_CGPA;
  const eligible = u.semester ? coursesForMentor(u.semester) : [];
  const semesterPass = eligible.length > 0;
  const canPromote = cgpaPass && semesterPass;

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[800px] px-6 pt-8 pb-4">
          <div className="text-xs text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/users" className="hover:text-ink">Users</Link>{" / "}
            <Link href={`/admin/users/${u.id}`} className="hover:text-ink">{u.name}</Link>{" / "}
            <span className="text-ink">Promote</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Promote to mentor</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Review eligibility, then pick the subjects {u.name.split(" ")[0]} will mentor.
            A mentor may hold at most {MENTOR_SUBJECT_CAP} subjects.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[800px] px-6 pb-12 space-y-6">
          <div className="card p-5">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-paper-dark text-ink-muted flex items-center justify-center text-sm font-semibold shrink-0">
                {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-ink-muted mt-0.5 tabular">{u.identity}</div>
                <div className="text-xs text-ink-muted mt-2">
                  Semester {u.semester ?? "n/a"}, CGPA {cgpa.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-3">Eligibility check</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                {cgpaPass ? (
                  <CheckCircle2 size={16} className="text-fern shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-oxblood shrink-0 mt-0.5" />
                )}
                <span>
                  CGPA at least {MENTOR_MIN_CGPA.toFixed(2)}{" "}
                  <span className="text-ink-muted tabular">
                    (current {cgpa.toFixed(2)})
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                {semesterPass ? (
                  <CheckCircle2 size={16} className="text-fern shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-oxblood shrink-0 mt-0.5" />
                )}
                <span>
                  Has completed at least one semester{" "}
                  <span className="text-ink-muted">
                    (mentors only handle subjects from semesters they have already passed)
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-1">Pick subjects to mentor</h2>
            <p className="text-xs text-ink-muted mb-4">
              Up to {MENTOR_SUBJECT_CAP} subjects. Only subjects from semesters earlier than{" "}
              {u.semester ? `semester ${u.semester}` : "the student's current semester"} are listed.
            </p>

            {eligible.length === 0 ? (
              <div className="rounded-md border border-saffron/40 bg-saffron/10 p-4 flex items-start gap-3">
                <Info size={16} className="text-saffron shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-ink">No eligible subjects yet.</p>
                  <p className="text-ink-muted mt-1 leading-relaxed">
                    {u.name.split(" ")[0]} is in semester {u.semester}. A mentor must have
                    already passed the subject they mentor, so promotion takes effect once
                    they complete at least one semester. You can still mark them as a
                    candidate, the promotion will apply automatically when subjects open up.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-rule">
                {eligible.map((c) => (
                  <li key={c.id} className="py-3 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`subject-${c.id}`}
                      className="size-4 mt-0.5 accent-oxblood"
                      defaultChecked={
                        eligible.findIndex((x) => x.id === c.id) <
                        MENTOR_SUBJECT_CAP
                      }
                    />
                    <label htmlFor={`subject-${c.id}`} className="flex-1 text-sm cursor-pointer">
                      <div className="font-medium">
                        {c.code}, {c.title}
                      </div>
                      <div className="text-xs text-ink-muted mt-0.5">
                        Semester {c.semester}, current mentor {c.mentor}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-2">Admin note (optional)</h2>
            <textarea
              rows={3}
              placeholder="Reason for promotion, anything the next admin should see."
              className="input text-sm w-full resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href={`/admin/users/${u.id}`} className="btn btn-ghost">
              Cancel
            </Link>
            <Link
              href="/admin/users"
              aria-disabled={!canPromote}
              className={
                canPromote
                  ? "btn btn-primary"
                  : "btn btn-primary opacity-50 pointer-events-none"
              }
            >
              <ArrowUpCircle size={16} />
              Confirm promotion
            </Link>
          </div>

          <p className="text-xs text-ink-muted">
            Demo: this flow does not write to a backend. In production, promotion would
            create a Mentor role on the same account and link the chosen subjects, with
            an audit log of who approved the change.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
