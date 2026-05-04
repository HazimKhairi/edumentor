import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { ATTENDANCE_SESSIONS, ROSTER } from "@/lib/data";

export const metadata = {
  title: "Attendance — EduMentor",
  description: "Roll, called by the camera. Confirmed by the mentor.",
};

const stateTone: Record<string, string> = {
  Live: "bg-oxblood text-bone",
  Closed: "bg-ink text-bone",
};

export default function AttendancePage() {
  const live = ATTENDANCE_SESSIONS.find((s) => s.state === "Live");
  const closed = ATTENDANCE_SESSIONS.filter((s) => s.state === "Closed");
  const checkedCount = ROSTER.filter((r) => r.checked).length;

  return (
    <>
      <SiteNav />

      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Section 05</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              The roll is called
              <br /> by the camera.
            </p>
            <div className="rule mt-6" />
            <dl className="mt-6 space-y-4 text-xs font-medium uppercase tracking-wide">
              <div className="flex justify-between"><dt className="text-ink-muted">Today</dt><dd>Live</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Cohort</dt><dd>{ROSTER.length}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Matched</dt><dd>{checkedCount}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Accuracy</dt><dd>98.4%</dd></div>
            </dl>
          </aside>

          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              The{" "}
              <span className="display-italic text-oxblood">roll.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Open the camera and the system will tick names off the
              roster. The mentor confirms the list before it is filed.
              Mentees may correct their own row in the next sixty
              minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Live session */}
      {live ? (
        <section className="border-b border-rule">
          <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <RuleLabel numeral="Now" label="Live recognition" caption={live.room} />
              <div className="mt-8 relative aspect-[5/4] border border-ink bg-bone overflow-hidden">
                <div className="absolute inset-0 hatched opacity-[0.06]" />
                <div className="absolute inset-6 border border-ink/30">
                  {[
                    { x: 6, y: 12, w: 22, h: 28, name: "Aiman Hakimi", id: "2023607832", ok: true },
                    { x: 36, y: 10, w: 22, h: 30, name: "Nur Sofea", id: "2023608112", ok: true },
                    { x: 68, y: 16, w: 20, h: 26, name: "Faris Adlan", id: "2023611901", ok: true },
                    { x: 10, y: 56, w: 22, h: 28, name: "Liyana Aziz", id: "2023612200", ok: false },
                    { x: 42, y: 60, w: 22, h: 28, name: "Hafiz Ridzwan", id: "2023612555", ok: true },
                    { x: 70, y: 58, w: 20, h: 26, name: "Iman Yusoff", id: "2023612823", ok: false },
                  ].map((b) => (
                    <div
                      key={b.id}
                      className={`absolute border ${b.ok ? "border-oxblood" : "border-ink-muted border-dashed"}`}
                      style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
                    >
                      <div className={`absolute -top-5 left-0 right-0 flex items-center justify-between text-xs font-medium uppercase tracking-wider ${b.ok ? "text-oxblood" : "text-ink-muted"}`}>
                        <span>{b.name}</span>
                        <span>{b.ok ? "OK" : "?"}</span>
                      </div>
                      <div className="absolute -bottom-4 left-0 text-xs font-medium text-ink-muted">{b.id}</div>
                      <span className={`absolute -left-1 -top-1 size-2 border-l border-t ${b.ok ? "border-oxblood" : "border-ink-muted"}`} />
                      <span className={`absolute -right-1 -top-1 size-2 border-r border-t ${b.ok ? "border-oxblood" : "border-ink-muted"}`} />
                      <span className={`absolute -left-1 -bottom-1 size-2 border-l border-b ${b.ok ? "border-oxblood" : "border-ink-muted"}`} />
                      <span className={`absolute -right-1 -bottom-1 size-2 border-r border-b ${b.ok ? "border-oxblood" : "border-ink-muted"}`} />
                    </div>
                  ))}
                </div>
                <div className="absolute top-3 left-4 text-xs font-medium uppercase tracking-wider text-ink-muted flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-oxblood blink" />
                  Recognising · {checkedCount}/{ROSTER.length} matched
                </div>
                <div className="absolute bottom-3 right-4 text-xs font-medium uppercase tracking-wider text-ink-muted">
                  {live.room} · {live.time}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors">
                  File the roll →
                </button>
                <button className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-ink hover:text-bone transition-colors">
                  Re-scan
                </button>
                <button className="link-reveal text-xs font-medium uppercase tracking-wider ml-2">
                  Manual override
                </button>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 md:border-l md:border-rule md:pl-6">
              <RuleLabel numeral="Roster" label={`${live.course} cohort`} caption={`${ROSTER.length} students`} />
              <ul className="mt-8 border-t border-ink">
                {ROSTER.map((s, i) => (
                  <li key={s.id} className="grid grid-cols-12 gap-3 items-center border-b border-rule py-3">
                    <span className="col-span-1 numeral">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                    <div className="col-span-7">
                      <div className="text-[14px]">{s.name}</div>
                      <div className="text-xs text-ink-muted mt-0.5">{s.matric}</div>
                    </div>
                    <div className="col-span-4 text-right">
                      {s.checked ? (
                        <span className="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium uppercase tracking-wider bg-ink text-bone">
                          ✓ Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium uppercase tracking-wider bg-bone border border-rule text-ink-muted">
                          — Awaiting
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* History */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <RuleLabel numeral="Section B" label="Sessions on file" caption={`${closed.length} entries`} />
          <ul className="mt-10 border-t border-ink">
            {closed.map((s) => {
              const pct = Math.round((s.present / s.expected) * 100);
              return (
                <li key={s.id} className="grid grid-cols-12 gap-4 items-baseline border-b border-rule py-5">
                  <div className="col-span-2 numeral">{s.date}</div>
                  <div className="col-span-2 numeral">{s.time}</div>
                  <div className="col-span-3">
                    <div className="numeral">{s.course}</div>
                    <div className="text-[13px] mt-1">{s.room}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="numeral">Attendance</div>
                    <div className="display text-[24px] leading-none mt-1 tracking-[-0.02em]">
                      {s.present}<span className="text-ink-muted text-[18px]">/{s.expected}</span>{" "}
                      <span className="display-italic text-oxblood text-[18px]">{pct}%</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-medium uppercase tracking-wider ${stateTone[s.state]}`}>
                      {s.state}
                    </span>
                    <Link href="#" className="block mt-2 link-reveal text-xs font-medium uppercase tracking-wider">
                      Audit →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
