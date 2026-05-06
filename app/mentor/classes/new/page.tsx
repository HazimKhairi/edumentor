import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Create class | Mentor",
};

export default function NewClassPage() {
  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <Link href="/mentor/classes" className="hover:text-ink">Classes</Link>{" / "}
            <span className="text-ink">New</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Schedule a class</h1>
          <p className="mt-2 text-ink-soft">
            Add a peer-led session to the timetable. Junior students in your cohort will see it on their dashboard.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form className="card p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Course</label>
              <select className="input">
                <option>MAT CS110, Discrete Structures</option>
                <option>CSC 234, Algorithms in Practice</option>
                <option>MAT 210, Linear Algebra for ML</option>
                <option>STA 116, Statistical Reasoning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Topic</label>
              <input type="text" placeholder="Strong induction on trees" className="input" />
              <p className="text-xs text-ink-muted mt-1.5">
                One sentence describing the focus of this session.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Date</label>
                <input type="date" className="input" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Start time</label>
                <input type="time" defaultValue="14:00" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Duration</label>
                <select className="input" defaultValue="120">
                  <option value="60">1 hour</option>
                  <option value="90">1 hour 30 minutes</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Room</label>
                <input type="text" placeholder="BD-3, Block A" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Format</label>
              <div className="flex flex-wrap gap-2">
                {["In person", "Online", "Hybrid"].map((f, i) => (
                  <label key={f} className="cursor-pointer">
                    <input type="radio" name="format" defaultChecked={i === 0} className="sr-only peer" />
                    <span className="px-3 py-1.5 rounded-full text-sm border border-rule peer-checked:bg-ink peer-checked:text-bone peer-checked:border-ink">
                      {f}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Notes for junior students</label>
              <textarea
                rows={3}
                placeholder="What to bring, what to read beforehand, etc."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Enable face-recognition attendance for this session</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Notify enrolled junior students by email</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/mentor/classes" className="btn btn-ghost">Cancel</Link>
              <Link href="/mentor/classes" className="btn btn-primary">Schedule class</Link>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
