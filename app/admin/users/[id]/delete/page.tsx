import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { USERS } from "@/lib/data";

export async function generateStaticParams() {
  return USERS.map((u) => ({ id: u.id }));
}

export default async function DeleteUserPage(props: PageProps<"/admin/users/[id]/delete">) {
  const { id } = await props.params;
  const u = USERS.find((x) => x.id === id);
  if (!u) notFound();

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[700px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/users" className="hover:text-ink">Users</Link>{" / "}
            <span className="text-ink">Delete</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Delete user</h1>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[700px] px-6 py-10">
          <div className="card p-6 md:p-8" style={{ borderColor: "rgba(122, 31, 31, 0.3)" }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="size-10 rounded-md bg-oxblood/10 text-oxblood flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h2 className="font-semibold text-lg">Delete {u.name}?</h2>
                <p className="text-sm text-ink-muted mt-1">This will permanently remove the account.</p>
              </div>
            </div>

            <div className="bg-paper-dark/40 rounded-md p-4 mb-5 text-sm space-y-1">
              <p><span className="text-ink-muted">Identity:</span> <span className="font-medium tabular">{u.identity}</span></p>
              <p><span className="text-ink-muted">Role:</span> <span className="font-medium">{u.role}</span></p>
              <p><span className="text-ink-muted">Status:</span> <span className="font-medium">{u.status}</span></p>
              <p><span className="text-ink-muted">Joined:</span> <span className="font-medium tabular">{u.joined}</span></p>
            </div>

            <p className="text-sm text-ink-soft leading-relaxed mb-5">
              The user will be signed out of all sessions. Their submissions,
              discussion posts, and reviews will be retained but anonymised.
              Enrolment in active courses will be cancelled.
            </p>

            <label className="flex items-start gap-2 text-sm cursor-pointer mb-5">
              <input type="checkbox" className="size-4 mt-0.5 accent-oxblood" />
              <span>I understand this action cannot be undone.</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/admin/users" className="btn btn-ghost">Cancel</Link>
              <Link
                href="/admin/users"
                className="btn"
                style={{ backgroundColor: "var(--color-oxblood)", color: "var(--color-bone)" }}
              >
                Delete user
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
