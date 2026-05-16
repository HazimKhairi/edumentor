import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata = {
  title: "Evaluation rubrics | Admin",
};

export default async function AdminEvaluationsPage() {
  await requireRole("Admin");
  const rubrics = await db.evaluationRubric.findMany({
    orderBy: [{ active: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <span className="text-ink">Evaluations</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Evaluation rubrics</h1>
              <p className="mt-2 text-ink-soft">
                {rubrics.length} rubrics, {rubrics.filter((r) => r.active).length} active.
              </p>
            </div>
            <Link href="/admin/evaluations/new" className="btn btn-primary">
              <Plus size={16} /> Add rubric
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {rubrics.map((r) => {
            const items = Array.isArray(r.items) ? (r.items as string[]) : [];
            return (
              <article key={r.id} className="card p-6">
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <span className="badge badge-saffron">{r.target}</span>
                  {r.active ? (
                    <span className="badge badge-fern">Active</span>
                  ) : (
                    <span className="badge badge-muted">Draft</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg leading-snug">{r.title}</h3>
                <p className="text-xs text-ink-muted mt-1">
                  {items.length} items, scale 1 to {r.scale}
                </p>

                <ul className="mt-4 space-y-2 text-sm">
                  {items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-ink-muted mt-2 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-rule flex items-center justify-end gap-2">
                  <Link href="/admin/evaluations/new" className="btn btn-ghost btn-sm">
                    <Pencil size={14} /> Edit
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
