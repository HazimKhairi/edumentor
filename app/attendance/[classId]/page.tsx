import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Radio, Video } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaceAttendance } from "@/components/face-attendance";
import { MenteeAttendanceConfirm } from "@/components/mentee-attendance-confirm";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import {
  attendanceRecordsForSession,
  courseIdsForUser,
  getRosterForSession,
} from "@/lib/queries";
import { closeClassAttendance, openClassAttendance } from "@/lib/actions";

export const dynamic = "force-dynamic";

const formatLabel: Record<string, string> = {
  InPerson: "In person",
  Online: "Online",
  Hybrid: "Hybrid",
};

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const me = await requireUser();
  const { classId } = await params;

  const klass = await db.classSession.findUnique({
    where: { id: classId },
    include: {
      course: {
        select: {
          id: true,
          code: true,
          title: true,
          enrollments: {
            where: { asRole: "Mentor" },
            include: { user: { select: { name: true } } },
            take: 1,
          },
        },
      },
    },
  });
  if (!klass) notFound();

  // Scope: must belong to the class's course (admin bypasses).
  if (me.role !== "Admin") {
    const myCourseIds = await courseIdsForUser(me.id, me.role);
    if (!myCourseIds.includes(klass.courseId)) notFound();
  }

  const mentorName = klass.course.enrollments[0]?.user.name ?? "—";

  // Find the attendance session tied to this class. Prefer the direct classId
  // link (set when the mentor opens attendance); fall back to a course + time +
  // room match for legacy rows that predate the FK.
  const attendanceSession =
    (await db.attendanceSession.findFirst({
      where: { classId: klass.id },
      orderBy: { createdAt: "desc" },
    })) ??
    (klass.state === "Live"
      ? await db.attendanceSession.findFirst({
          where: { courseId: klass.courseId, state: "Live" },
        })
      : await db.attendanceSession.findFirst({
          where: {
            courseId: klass.courseId,
            time: klass.time,
            room: klass.room,
          },
          orderBy: { createdAt: "desc" },
        }));

  const isLive = klass.state === "Live" && attendanceSession?.state === "Live";

  // Live capture props (same shape /attendance builds).
  const roster = isLive ? await getRosterForSession(attendanceSession!.id) : [];
  const liveProps = isLive
    ? {
        id: attendanceSession!.id,
        course: klass.course.code,
        room: klass.room,
        date: klass.date.toISOString().slice(0, 10),
        time: klass.time,
        expected: attendanceSession!.expected,
      }
    : null;

  let myDescriptor: number[] | null = null;
  let initiallyVerified = false;
  if (isLive && me.role === "Mentee") {
    myDescriptor = roster.find((r) => r.id === me.id)?.descriptor ?? null;
    const existing = await db.menteeAttendance.findUnique({
      where: {
        sessionId_menteeId: { sessionId: attendanceSession!.id, menteeId: me.id },
      },
    });
    initiallyVerified = Boolean(existing?.menteeConfirmed && existing?.mentorVerified);
  }

  // Closed/scheduled results roster.
  const records = attendanceSession
    ? await attendanceRecordsForSession(attendanceSession.id)
    : [];

  const canManage =
    me.role === "Admin" ||
    (me.role === "Mentor" &&
      (await db.enrollment.findUnique({
        where: {
          userId_courseId_asRole: {
            userId: me.id,
            courseId: klass.courseId,
            asRole: "Mentor",
          },
        },
      })) != null);

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="text-xs text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/attendance" className="hover:text-ink">Attendance</Link>{" / "}
            <span className="text-ink">{klass.topic}</span>
          </div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-ink-muted">{klass.course.code}</span>
            {isLive ? (
              <span className="badge badge-oxblood inline-flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> Live
              </span>
            ) : (
              <span className="badge badge-muted">{klass.state}</span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{klass.topic}</h1>
        </div>
      </section>

      {/* Class info */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
              <CalendarClock size={13} /> When
            </div>
            <div className="text-sm font-medium tabular">
              {klass.date.toISOString().slice(0, 10)}, {klass.time}
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
              <MapPin size={13} /> Where
            </div>
            <div className="text-sm font-medium">
              {formatLabel[klass.format] ?? klass.format}, {klass.room}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted mb-1">Mentor</div>
            <div className="text-sm font-medium">{mentorName}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted mb-1">Course</div>
            <div className="text-sm font-medium">{klass.course.title}</div>
          </div>
        </div>

        {klass.meetingLink ? (
          <div className="mx-auto max-w-[1200px] px-6 pb-2">
            <a
              href={klass.meetingLink}
              target="_blank"
              rel="noopener"
              className="btn btn-primary btn-sm"
            >
              <Video size={15} /> Join Google Meet
            </a>
          </div>
        ) : null}

        {/* Mentor open/close controls */}
        {canManage ? (
          <div className="mx-auto max-w-[1200px] px-6 py-2 flex gap-2">
            {klass.state !== "Live" ? (
              <form action={openClassAttendance}>
                <input type="hidden" name="classId" value={klass.id} />
                <button type="submit" className="btn btn-primary btn-sm">
                  Open attendance
                </button>
              </form>
            ) : (
              <form action={closeClassAttendance}>
                <input type="hidden" name="classId" value={klass.id} />
                <button type="submit" className="btn btn-ghost btn-sm">
                  Close attendance
                </button>
              </form>
            )}
          </div>
        ) : null}
      </section>

      {/* Live capture or results */}
      {isLive ? (
        me.role === "Mentor" || me.role === "Admin" ? (
          <FaceAttendance roster={roster} session={liveProps!} />
        ) : (
          <MenteeAttendanceConfirm
            session={liveProps!}
            myUserId={me.id}
            myMatric={me.identity}
            myName={me.name}
            myDescriptor={myDescriptor}
            initiallyVerified={initiallyVerified}
          />
        )
      ) : (
        <section className="border-t border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-8">
            <h2 className="font-semibold text-sm mb-3">Attendance roster</h2>
            {records.length === 0 ? (
              <div className="card p-5 text-sm text-ink-muted">
                {klass.state === "Scheduled"
                  ? "This class hasn't started. The mentor opens attendance when it begins."
                  : "No attendance was recorded for this class."}
              </div>
            ) : (
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {records.map((r) => {
                  const counted = r.menteeConfirmed && r.mentorVerified;
                  return (
                    <li key={r.menteeId} className="px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{r.mentee.name}</div>
                        <div className="text-xs text-ink-muted tabular">{r.mentee.identity}</div>
                      </div>
                      <span className={r.menteeConfirmed ? "badge badge-fern" : "badge badge-muted"}>
                        Mentee {r.menteeConfirmed ? "OK" : "no"}
                      </span>
                      <span className={r.mentorVerified ? "badge badge-fern" : "badge badge-saffron"}>
                        Mentor {r.mentorVerified ? "OK" : "pending"}
                      </span>
                      <span className={counted ? "badge badge-oxblood" : "badge badge-muted"}>
                        {counted ? "Counted" : "Incomplete"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  );
}
