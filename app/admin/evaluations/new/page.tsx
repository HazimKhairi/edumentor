import Link from "next/link";
import { Plus, X } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

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

export default function AddEvaluationPage() {
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
          <form className="card p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Rubric title</label>
              <input
                type="text"
                placeholder="End-of-term mentor evaluation"
                className="input"
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Target</label>
                <select className="input">
                  <option>Mentor</option>
                  <option>Mentee</option>
                  <option>Course</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Rating scale</label>
                <select className="input" defaultValue="5">
                  <option value="3">1 to 3</option>
                  <option value="4">1 to 4</option>
                  <option value="5">1 to 5</option>
                  <option value="10">1 to 10</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Rubric items</label>
                <span className="text-xs text-ink-muted">Drag to reorder</span>
              </div>
              <ul className="space-y-2 mb-3">
                {STARTER_ITEMS.map((it, i) => (
                  <li key={i} className="card p-3 flex items-center gap-3">
                    <span className="text-xs text-ink-muted tabular w-6">{i + 1}</span>
                    <input type="text" defaultValue={it} className="input py-1.5 text-sm border-transparent hover:border-rule focus:border-ink" />
                    <button type="button" className="size-8 rounded-sm hover:bg-paper-dark text-ink-muted flex items-center justify-center" aria-label="Remove">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-ghost btn-sm">
                <Plus size={14} /> Add item
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Open-ended prompts</label>
              <div className="space-y-2">
                <input type="text" defaultValue="A kind word about your mentor" className="input" />
                <input type="text" defaultValue="A useful criticism" className="input" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Activate this rubric for the current term</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Allow anonymous submissions</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/admin/evaluations" className="btn btn-ghost">Cancel</Link>
              <Link href="/admin/evaluations" className="btn btn-primary">Save rubric</Link>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
