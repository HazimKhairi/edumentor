import Link from "next/link";
import { Plus, X } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Add assignment | Mentor",
};

const STARTER_RUBRIC = [
  { key: "Correctness", weight: 40 },
  { key: "Clarity of writing", weight: 25 },
  { key: "Completeness", weight: 20 },
  { key: "Formatting and notation", weight: 15 },
];

export default function AddAssignmentPage() {
  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <Link href="/mentor/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">New</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Create an assignment</h1>
          <p className="mt-2 text-ink-soft">
            Junior students enrolled in the selected course will be notified when this is published.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form className="card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Code</label>
                <input type="text" placeholder="PS-04" className="input" />
              </div>
              <div className="col-span-12 md:col-span-9">
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input type="text" placeholder="Relations, equivalence classes, partitions" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Course</label>
                <select className="input">
                  <option>MAT CS110, Discrete Structures</option>
                  <option>CSC 234, Algorithms in Practice</option>
                  <option>MAT 210, Linear Algebra for ML</option>
                  <option>STA 116, Statistical Reasoning</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Type</label>
                <select className="input">
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
                placeholder="Describe what junior students need to do, what to submit, and what success looks like."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Issued</label>
                <input type="date" className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Due</label>
                <input type="date" className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Weight</label>
                <input type="number" defaultValue={10} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Late penalty</label>
                <input type="text" defaultValue="-2 points/day" className="input" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Grading rubric</label>
                <span className="text-xs text-ink-muted">Total must equal 100%</span>
              </div>
              <ul className="space-y-2 mb-3">
                {STARTER_RUBRIC.map((r, i) => (
                  <li key={i} className="card p-3 flex items-center gap-3">
                    <span className="text-xs text-ink-muted tabular w-6">{i + 1}</span>
                    <input type="text" defaultValue={r.key} className="input py-1.5 text-sm border-transparent hover:border-rule focus:border-ink flex-1" />
                    <input type="number" defaultValue={r.weight} className="input py-1.5 text-sm w-20" />
                    <span className="text-xs text-ink-muted">%</span>
                    <button type="button" className="size-8 rounded-sm hover:bg-paper-dark text-ink-muted flex items-center justify-center" aria-label="Remove">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-ghost btn-sm">
                <Plus size={14} /> Add criterion
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Submission format</label>
              <div className="flex flex-wrap gap-2">
                {["PDF", "LaTeX source", "Code repo", "Slides", "Video"].map((f, i) => (
                  <label key={f} className="cursor-pointer">
                    <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                    <span className="px-3 py-1.5 rounded-full text-sm border border-rule peer-checked:bg-ink peer-checked:text-bone peer-checked:border-ink">
                      {f}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Publish immediately and notify junior students</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/mentor/assignments" className="btn btn-ghost">Cancel</Link>
              <Link href="/mentor/assignments" className="btn btn-primary">Save assignment</Link>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
