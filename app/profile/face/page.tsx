import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaceSelfEnrol } from "@/components/face-self-enrol";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Capture my face | EduMentor",
  description: "Re-capture your face descriptor for attendance.",
};

function errorMessage(error: string | undefined): string | null {
  if (!error) return null;
  if (error === "missing") return "Capture your face first, then click Save.";
  if (error === "invalid") return "Something went wrong reading the capture, please try again.";
  if (error === "mismatch") {
    return "That doesn't look like the same person we have on record. Only you can replace your own face.";
  }
  return "Save failed, please try again.";
}

export default async function FaceProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const me = await requireUser();
  const { error, saved } = await searchParams;
  const errorText = errorMessage(error);

  // Pull the descriptor flag without shipping the BLOB bytes to the client.
  const row = await db.user.findUnique({
    where: { id: me.id },
    select: { faceDescriptor: true },
  });
  const alreadyEnrolled = Boolean(row?.faceDescriptor);

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[800px] px-6 pt-8 pb-4">
          <div className="text-xs text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/dashboard" className="hover:text-ink">Dashboard</Link>{" / "}
            <span className="text-ink">Capture face</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Capture your face</h1>
          <p className="mt-2 text-sm text-ink-muted max-w-2xl leading-relaxed">
            Save your face once so the classroom camera can recognise you at
            attendance. We do not keep your photo, only a private pattern that
            identifies you. Nobody sees this except the system.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[800px] px-6 pb-12">
          {saved ? (
            <div className="mb-4 rounded-md border border-fern/40 bg-fern/10 px-3 py-2 text-sm text-fern">
              Saved. The classroom camera can recognise you now.
            </div>
          ) : null}
          {errorText ? (
            <div className="mb-4 rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
              {errorText}
            </div>
          ) : null}

          <FaceSelfEnrol matric={me.identity} alreadyEnrolled={alreadyEnrolled} />

          <p className="text-xs text-ink-muted mt-6 leading-relaxed">
            The camera runs only in your browser. We never store the photo
            itself, only a private pattern we use to recognise you. Nothing
            is sent to us until you tap Save.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
