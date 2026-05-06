import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Add course | Admin",
};

export default function AddCoursePage() {
  return (
    <>
      <SiteNav />
      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/courses" className="hover:text-ink">Courses</Link>{" / "}
            <span className="text-ink">Add course</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Add a new course</h1>
          <p className="mt-2 text-ink-soft">
            Add a course to the catalogue. Junior students can enrol once published, and a senior mentor will be assigned.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form className="card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium mb-1.5">Course code</label>
                <input type="text" placeholder="MAT CS110" className="input" />
                <p className="text-xs text-ink-muted mt-1.5">Use the official UiTM code.</p>
              </div>
              <div className="col-span-12 md:col-span-8">
                <label className="block text-sm font-medium mb-1.5">Course title</label>
                <input type="text" placeholder="Discrete Structures for Computing" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Abstract</label>
              <textarea
                rows={4}
                placeholder="Short description shown on the catalogue card."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Senior student mentor</label>
                <select className="input">
                  <option>Select mentor</option>
                  <option>Adam Iskandar Razak</option>
                  <option>Nadia Aiman Zulkifli</option>
                  <option>Daniel Hakimi Othman</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Cohort</label>
                <input type="text" placeholder="B.Sc. CS, Year 1" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Sessions</label>
                <input type="number" defaultValue={24} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Capacity</label>
                <input type="number" defaultValue={60} className="input" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Pace</label>
                <input type="text" placeholder="Tue & Thu, 14:00" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Card colour</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "oxblood", c: "#4f46e5" },
                  { v: "fern", c: "#0ea5e9" },
                  { v: "saffron", c: "#a855f7" },
                  { v: "ink", c: "#1e293b" },
                ].map((p, i) => (
                  <label key={p.v} className="cursor-pointer">
                    <input type="radio" name="colour" value={p.v} defaultChecked={i === 0} className="sr-only peer" />
                    <span
                      className="size-9 rounded-md inline-block border-2 border-rule peer-checked:border-ink"
                      style={{ backgroundColor: p.c }}
                      aria-label={p.v}
                    />
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Publish immediately to the catalogue</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/admin/courses" className="btn btn-ghost">Cancel</Link>
              <Link href="/admin/courses" className="btn btn-primary">Save course</Link>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
