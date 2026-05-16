import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getAssignmentsView } from "@/lib/queries";

export async function generateStaticParams() {
  const rows = await db.assignment.findMany({ select: { id: true } });
  return rows.map((a) => ({ id: a.id }));
}

export default async function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["Mentor", "Admin"]);
  const { id } = await params;
  const all = await getAssignmentsView();
  const a = all.find((x) => x.id === id);
  if (!a) notFound();

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <Link href="/mentor/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">Edit {a.code}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit assignment</h1>
          <p className="mt-2 text-ink-soft">{a.code}, {a.title}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form className="card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Code</label>
                <input type="text" defaultValue={a.code} className="input" />
              </div>
              <div className="col-span-12 md:col-span-9">
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input type="text" defaultValue={a.title} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Course</label>
                <select className="input" defaultValue={a.course}>
                  <option>MAT CS110</option>
                  <option>CSC 234</option>
                  <option>MAT 210</option>
                  <option>STA 116</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Type</label>
                <select className="input" defaultValue={a.type}>
                  <option>Problem Set</option>
                  <option>Lab</option>
                  <option>Essay</option>
                  <option>Quiz</option>
                  <option>Project</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Brief</label>
              <textarea
                rows={5}
                defaultValue={a.note}
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Issued</label>
                <input type="text" defaultValue={a.issued} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Due</label>
                <input type="text" defaultValue={a.due} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Weight</label>
                <input type="number" defaultValue={a.weight} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select className="input" defaultValue={a.status}>
                  <option>Open</option>
                  <option>Closing soon</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-rule">
              <Link href={`/mentor/assignments/${a.id}/delete`} className="text-sm text-oxblood hover:text-oxblood-deep font-medium">
                Delete this assignment
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/mentor/assignments" className="btn btn-ghost">Cancel</Link>
                <Link href="/mentor/assignments" className="btn btn-primary">Save changes</Link>
              </div>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
