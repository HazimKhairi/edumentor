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

const errorCopy: Record<string, string> = {
  missing: "Capture a face first, then click Save.",
  invalid: "The capture failed to parse, try again.",
};

export default async function FaceProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const me = await requireUser();
  const { error, saved } = await searchParams;

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
            Your face descriptor (128 numbers, not a photo) lets the camera
            recognise you at attendance. Capture once, the result is saved to
            your account.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[800px] px-6 pb-12">
          {saved ? (
            <div className="mb-4 rounded-md border border-fern/40 bg-fern/10 px-3 py-2 text-sm text-fern">
              Saved. You can now confirm attendance from the live session.
            </div>
          ) : null}
          {error && errorCopy[error] ? (
            <div className="mb-4 rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
              {errorCopy[error]}
            </div>
          ) : null}

          <FaceSelfEnrol matric={me.identity} alreadyEnrolled={alreadyEnrolled} />

          <p className="text-xs text-ink-muted mt-6 leading-relaxed">
            Runs entirely in your browser via face-api.js. The 128-number
            descriptor is sent to the server only after you click Save, and
            stored as a Bytes column on your User row. The original photo
            never leaves this device.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
