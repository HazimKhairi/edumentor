import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { COURSES } from "@/lib/data";

export async function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }));
}

export default async function EditCoursePage(props: PageProps<"/admin/courses/[id]/edit">) {
  const { id } = await props.params;
  const c = COURSES.find((x) => x.id === id);
  if (!c) notFound();

  return (
    <>
      <SiteNav />
      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/courses" className="hover:text-ink">Courses</Link>{" / "}
            <span className="text-ink">Edit {c.code}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit course</h1>
          <p className="mt-2 text-ink-soft">{c.code}, {c.title}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form className="card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium mb-1.5">Course code</label>
                <input type="text" defaultValue={c.code} className="input" />
              </div>
              <div className="col-span-12 md:col-span-8">
                <label className="block text-sm font-medium mb-1.5">Course title</label>
                <input type="text" defaultValue={c.title} className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Abstract</label>
              <textarea
                rows={4}
                defaultValue={c.abstract}
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Mentor</label>
                <select className="input" defaultValue={c.mentor}>
                  <option>Dr. Aishah Mokhtar</option>
                  <option>Encik Faiz Rashid</option>
                  <option>Pn. Liyana Hashim</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Cohort</label>
                <input type="text" defaultValue={c.cohort} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Sessions</label>
                <input type="number" defaultValue={c.sessions} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Capacity</label>
                <input type="number" defaultValue={c.capacity} className="input" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Pace</label>
                <input type="text" defaultValue={c.pace} className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Course progress</label>
              <input type="number" defaultValue={c.progress} className="input max-w-[160px]" />
              <p className="text-xs text-ink-muted mt-1.5">% of syllabus completed this term.</p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-rule">
              <Link href={`/admin/courses/${c.id}/delete`} className="text-sm text-oxblood hover:text-oxblood-deep font-medium">
                Delete this course
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/admin/courses" className="btn btn-ghost">Cancel</Link>
                <Link href="/admin/courses" className="btn btn-primary">Save changes</Link>
              </div>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
