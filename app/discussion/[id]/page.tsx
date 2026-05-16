import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin, PinOff } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { postReply, toggleRoomPin } from "@/lib/actions";

export async function generateStaticParams() {
  const rows = await db.discussionRoom.findMany({ select: { id: true } });
  return rows.map((r) => ({ id: r.id }));
}

export default async function DiscussionThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await requireUser();
  const { id } = await params;
  const room = await db.discussionRoom.findUnique({
    where: { id },
    include: {
      course: { select: { code: true, title: true } },
      starter: { select: { name: true, role: true } },
      messages: {
        include: { author: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!room) notFound();

  const canModerate = me.role === "Mentor" || me.role === "Admin";

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/discussion" className="hover:text-ink">Discussion</Link>{" / "}
            <span className="text-ink truncate">{room.title}</span>
          </div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs text-ink-muted">{room.course.code}</span>
            {room.pinned ? (
              <span className="badge badge-saffron inline-flex items-center gap-1">
                <Pin size={10} /> Pinned
              </span>
            ) : null}
            <span className="text-xs text-ink-muted">,</span>
            <span className="text-xs text-ink-muted">
              Started by {room.starter.name}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{room.title}</h1>
          <div className="mt-3 text-xs text-ink-muted">
            {room.posts} replies, {room.members} in
          </div>

          {canModerate ? (
            <form action={toggleRoomPin} className="mt-4">
              <input type="hidden" name="roomId" value={room.id} />
              <button type="submit" className="btn btn-ghost btn-sm">
                {room.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                {room.pinned ? "Unpin" : "Pin"}
              </button>
            </form>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-8 space-y-3">
          {room.messages.length === 0 ? (
            <p className="text-sm text-ink-muted">No replies yet.</p>
          ) : (
            <ul className="space-y-3">
              {room.messages.map((m, i) => (
                <li
                  key={m.id}
                  className={`card p-5 ${m.author.role === "Mentor" ? "border-oxblood/30" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                        m.author.role === "Mentor"
                          ? "bg-oxblood text-bone"
                          : "bg-paper-dark text-ink"
                      }`}
                    >
                      {m.author.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-sm">{m.author.name}</span>
                        {m.author.role === "Mentor" ? (
                          <span className="badge badge-oxblood">Mentor</span>
                        ) : m.author.role === "Mentee" ? (
                          <span className="badge badge-muted">Mentee</span>
                        ) : (
                          <span className="badge badge-saffron">Admin</span>
                        )}
                        <span className="text-xs text-ink-muted">, {m.time}</span>
                        {i === 0 ? (
                          <span className="text-xs text-ink-muted">, original post</span>
                        ) : null}
                      </div>
                      <p className="text-base leading-relaxed whitespace-pre-line">
                        {m.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="card p-5 mt-6">
            <h3 className="font-semibold text-base mb-3">Your reply</h3>
            <form action={postReply} className="space-y-3">
              <input type="hidden" name="roomId" value={room.id} />
              <textarea
                name="body"
                required
                rows={4}
                placeholder="Add to the thread."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
              <div className="flex items-center justify-end">
                <button type="submit" className="btn btn-primary">
                  Post reply
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
