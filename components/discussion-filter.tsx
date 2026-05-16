"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type RoomRow = {
  id: string;
  title: string;
  course: string;
  pinned: boolean;
  posts: number;
  members: number;
  excerpt: string;
  last: string;
};

type Filter = "All" | "Pinned" | "My questions";

export function DiscussionFilter({
  rooms,
  myUserId,
  myCourseCodes,
}: {
  rooms: (RoomRow & { starterId: string })[];
  myUserId: string;
  myCourseCodes: string[];
}) {
  const [active, setActive] = useState<Filter>("All");

  const counts = useMemo(
    () => ({
      All: rooms.length,
      Pinned: rooms.filter((r) => r.pinned).length,
      "My questions": rooms.filter((r) => r.starterId === myUserId).length,
    }),
    [rooms, myUserId],
  );

  const filtered = useMemo(() => {
    let list = rooms;
    if (active === "Pinned") list = list.filter((r) => r.pinned);
    if (active === "My questions") list = list.filter((r) => r.starterId === myUserId);
    return list;
  }, [active, rooms, myUserId]);

  // Tip: prefer rooms in courses the user is enrolled in (just for ordering).
  const ordered = useMemo(() => {
    const codes = new Set(myCourseCodes);
    return [...filtered].sort((a, b) => {
      const aMine = codes.has(a.course) ? 0 : 1;
      const bMine = codes.has(b.course) ? 0 : 1;
      if (aMine !== bMine) return aMine - bMine;
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
  }, [filtered, myCourseCodes]);

  return (
    <>
      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {(["All", "Pinned", "My questions"] as Filter[]).map((label) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-ink text-bone"
                  : "bg-bone text-ink-soft border border-rule hover:border-ink"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-60 tabular">
                {counts[label]}
              </span>
            </button>
          );
        })}
      </div>

      {ordered.length === 0 ? (
        <p className="text-sm text-ink-muted">No questions in this view yet.</p>
      ) : (
        <ul className="space-y-3">
          {ordered.map((r) => (
            <li key={r.id}>
              <Link href={`/discussion/${r.id}`} className="card card-hover p-5 block">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <span className="text-xs text-ink-muted tabular">{r.course}</span>
                  {r.pinned ? <span className="badge badge-saffron">Pinned</span> : null}
                </div>
                <h3 className="font-semibold leading-snug">{r.title}</h3>
                <p className="text-sm text-ink-muted mt-1.5 line-clamp-2">{r.excerpt}</p>
                <div className="text-xs text-ink-muted mt-3 flex items-center justify-between">
                  <span>{r.posts} replies, {r.members} in</span>
                  <span>{r.last}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
