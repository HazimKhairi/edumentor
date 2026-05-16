import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { requireRole } from "@/lib/session";
import { createRubric } from "@/lib/actions";

export const metadata = {
  title: "Add rubric | Admin",
};

const STARTER_ITEMS = [
  "Pacing of lectures",
  "Clarity of explanation",
  "Quality of feedback on work",
  "Availability outside class",
  "Fairness in grading",
];

export default async function AddEvaluationPage() {
  await requireRole("Admin");

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/evaluations" className="hover:text-ink">Evaluations</Link>{" / "}
            <span className="text-ink">Add rubric</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Create evaluation rubric</h1>
          <p className="mt-2 text-ink-soft">
            Author the questions mentees use to review their mentor or the course this term.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form action={createRubric} className="card p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Rubric title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="End-of-term mentor evaluation"
                className="input"
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Target</label>
                <select name="target" className="input">
                  <option>Mentor</option>
                  <option>Mentee</option>
                  <option>Course</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Rating scale</label>
                <select name="scale" className="input" defaultValue="5">
                  <option value="3">1 to 3</option>
                  <option value="4">1 to 4</option>
                  <option value="5">1 to 5</option>
                  <option value="10">1 to 10</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rubric items</label>
              <ul className="space-y-2 mb-3">
                {STARTER_ITEMS.map((it, i) => (
                  <li key={i} className="card p-3 flex items-center gap-3">
                    <span className="text-xs text-ink-muted tabular w-6">{i + 1}</span>
                    <input
                      type="text"
                      name="items"
                      defaultValue={it}
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
              <button type="submit" className="btn btn-primary">Save rubric</button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
