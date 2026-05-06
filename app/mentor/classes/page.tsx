import Link from "next/link";
import { Plus, Camera, Video } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CLASSES } from "@/lib/data";

export const metadata = {
  title: "Manage classes | Mentor",
};

const stateBadge: Record<string, string> = {
  Live: "badge badge-oxblood",
  Scheduled: "badge badge-saffron",
  Closed: "badge badge-muted",
};

export default function MentorClassesPage() {
  const live = CLASSES.find((c) => c.state === "Live");
  const upcoming = CLASSES.filter((c) => c.state === "Scheduled");

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <span className="text-ink">Classes</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Classes</h1>
              <p className="mt-2 text-ink-soft">
                {live ? "1 live now, " : ""}{upcoming.length} upcoming sessions.
              </p>
            </div>
            <Link href="/mentor/classes/new" className="btn btn-primary">
              <Plus size={16} /> Create class
            </Link>
          </div>
        </div>
      </section>

      {live ? (
        <section>
          <div className="mx-auto max-w-[1400px] px-6 py-8">
            <div className="card p-6 flex items-center gap-6 flex-wrap" style={{ borderColor: "rgba(122,31,31,0.3)" }}>
              <span className="badge badge-oxblood">
                <span className="size-1.5 rounded-full bg-oxblood blink mr-1" /> Live now
              </span>
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-semibold text-lg">{live.course}, {live.topic}</h2>
                <p className="text-sm text-ink-muted">{live.room} | {live.time} | {live.date} | {live.format}</p>
              </div>
              {live.meetingLink ? (
                <a
                  href={live.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <Video size={16} /> Join Google Meet
                </a>
              ) : null}
              <Link href="/attendance" className="btn btn-primary">
                <Camera size={16} /> Open attendance
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <h2 className="text-xl font-bold mb-6">All sessions</h2>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Topic</th>
                  <th className="px-4 py-3 font-semibold">Format</th>
                  <th className="px-4 py-3 font-semibold">Room / Link</th>
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {CLASSES.map((c) => (
                  <tr key={c.id} className="hover:bg-paper-dark/30">
                    <td className="px-4 py-3 tabular">{c.date}</td>
                    <td className="px-4 py-3 tabular">{c.time}</td>
                    <td className="px-4 py-3 font-medium">{c.course}</td>
                    <td className="px-4 py-3">{c.topic}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.format}</td>
                    <td className="px-4 py-3 text-ink-muted">
                      {c.meetingLink ? (
                        <a
                          href={c.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-oxblood font-medium hover:text-oxblood-deep"
                        >
                          <Video size={12} /> Google Meet
                        </a>
                      ) : (
                        c.room
                      )}
                    </td>
                    <td className="px-4 py-3"><span className={stateBadge[c.state]}>{c.state}</span></td>
                    <td className="px-4 py-3 text-right">
                      {c.state === "Live" ? (
                        <Link href="/attendance" className="text-sm text-oxblood font-medium hover:text-oxblood-deep">Open</Link>
                      ) : c.state === "Scheduled" ? (
                        <Link href="#" className="text-sm text-ink-muted hover:text-ink">Edit</Link>
                      ) : (
                        <Link href="/reports" className="text-sm text-ink-muted hover:text-ink">View</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
