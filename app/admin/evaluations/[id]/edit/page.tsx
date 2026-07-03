import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { updateRubric } from "@/lib/actions";
import { RequiredMark } from "@/components/required-mark";

export const metadata = {
  title: "Edit rubric | Admin",
};

export default async function EditEvaluationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole("Admin");
  const { id } = await params;
  const { error } = await searchParams;
  const rubric = await db.evaluationRubric.findUnique({ where: { id } });
  if (!rubric) notFound();

  const items = Array.isArray(rubric.items) ? (rubric.items as string[]) : [];
  // Keep a couple of spare rows so items can be added on edit too.
  const rows = [...items, "", ""];

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/evaluations" className="hover:text-ink">Evaluations</Link>{" / "}
            <span className="text-ink">Edit</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit evaluation rubric</h1>
          <p className="mt-2 text-ink-soft">
            Update the questions mentees use to review their mentor or the course this term.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form action={updateRubric} className="card p-6 md:p-8 space-y-6">
            <input type="hidden" name="id" value={rubric.id} />

            {error === "missing" ? (
              <div className="rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
                A title and at least one rubric item are required.
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium mb-1.5">Rubric title<RequiredMark /></label>
              <input
                type="text"
                name="title"
                required
                defaultValue={rubric.title}
                placeholder="End-of-term mentor evaluation"
                className="input"
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Target</label>
                <select name="target" className="input" defaultValue={rubric.target}>
                  <option>Mentor</option>
                  <option>Mentee</option>
                  <option>Course</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Rating scale</label>
                <select name="scale" className="input" defaultValue={String(rubric.scale)}>
                  <option value="3">1 to 3</option>
                  <option value="4">1 to 4</option>
                  <option value="5">1 to 5</option>
                  <option value="10">1 to 10</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={rubric.active} className="size-4" />
              Active this term
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Rubric items</label>
              <ul className="space-y-2 mb-3">
                {rows.map((it, i) => (
                  <li key={i} className="card p-3 flex items-center gap-3">
                    <span className="text-xs text-ink-muted tabular w-6">{i + 1}</span>
                    <input
                      type="text"
                      name="items"
                      defaultValue={it}
                      placeholder="Add an item"
                      className="input py-1.5 text-sm border-transparent hover:border-rule focus:border-ink"
                    />
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ink-muted">
                Edit, blank lines are dropped on save.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/admin/evaluations" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
