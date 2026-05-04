import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { ROLES, SUBJECT } from "@/lib/data";

export const metadata = {
  title: "Sign in — EduMentor",
  description: "Open the desk. Pick a role and begin.",
};

const ROLE_HREF: Record<string, string> = {
  Admin: "/dashboard?role=admin",
  Mentor: "/dashboard?role=mentor",
  Mentee: "/dashboard?role=mentee",
};

export default function LoginPage() {
  return (
    <>
      <SiteNav />

      {/* Masthead */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / The desk</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              A quiet entrance,
              <br /> with three doors.
            </p>
            <div className="rule mt-6" />
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              Sign in with your matric or staff number. We do not keep
              your password — only the discipline of the choice you made
              when you wrote it.
            </p>
            <ul className="mt-6 space-y-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
              <li className="flex items-center justify-between">
                <span>SSO</span>
                <span className="text-ink">UiTM</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Session</span>
                <span className="text-ink">90 minutes</span>
              </li>
              <li className="flex items-center justify-between">
                <span>2FA</span>
                <span className="text-ink">Optional</span>
              </li>
            </ul>
          </aside>

          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              Sign{" "}
              <span className="display-italic text-oxblood">in,</span>
              <br />
              take a seat.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Three roles share this folio. Choose the one written on
              your card. The desk will arrange itself accordingly —
              admins receive the catalogue, mentors receive the cohort,
              mentees receive the reading.
            </p>
          </div>
        </div>
      </section>

      {/* THREE ROLES */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <RuleLabel
            numeral="Step 01"
            label="Choose a role"
            caption="A · M · S"
          />
          <div className="mt-12 grid grid-cols-12 gap-6">
            {ROLES.map((role, idx) => (
              <article
                key={role.key}
                className="col-span-12 md:col-span-4 deck p-8 flex flex-col"
              >
                <div className="flex items-baseline justify-between">
                  <span className="numeral">№ 0{idx + 1}</span>
                  <span className="numeral text-oxblood">{role.abbr}</span>
                </div>
                <h2 className="display mt-6 text-[64px] leading-[0.9] tracking-[-0.04em]">
                  {role.key}
                </h2>
                <p className="mt-3 eyebrow-italic text-[17px] text-ink-soft">
                  {role.oneLiner}
                </p>

                <ul className="mt-6 divide-y divide-rule border-y border-rule">
                  {role.duties.map((d, i) => (
                    <li
                      key={d}
                      className="flex items-baseline gap-3 py-2.5 text-[13px]"
                    >
                      <span className="numeral shrink-0 w-6">0{i + 1}</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Link
                    href={ROLE_HREF[role.key]}
                    className="inline-flex w-full items-center justify-between border border-ink bg-ink px-5 py-3 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors"
                  >
                    <span>Enter as {role.key.toLowerCase()}</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <div className="mt-3 numeral">
                    {role.key === "Admin" && "Restricted · Faculty staff"}
                    {role.key === "Mentor" && "Approved by faculty"}
                    {role.key === "Mentee" && "Open enrolment"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SIGN-IN FORM */}
      <section className="border-b border-rule bg-paper-dark/40">
        <div className="mx-auto max-w-[1400px] px-6 py-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <RuleLabel numeral="Step 02" label="Identify yourself" />
            <h2 className="display mt-8 text-[72px] leading-[0.9] tracking-[-0.04em]">
              Your card,
              <br />
              <span className="display-italic text-oxblood">please.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft max-w-md">
              Use the matric number printed on your student card, or the
              staff number issued by the registrar. Forgotten passwords
              are reset by the librarian on duty.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-soft">
              <li className="flex items-baseline gap-3 border-b border-rule pb-3">
                <span className="numeral shrink-0">A</span>
                <span>Mentees: matric number, e.g. <span className="font-mono text-ink">2023607832</span></span>
              </li>
              <li className="flex items-baseline gap-3 border-b border-rule pb-3">
                <span className="numeral shrink-0">B</span>
                <span>Mentors: staff number, e.g. <span className="font-mono text-ink">FCMS-184</span></span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="numeral shrink-0">C</span>
                <span>Admins: registrar will provide on first login.</span>
              </li>
            </ul>
          </div>

          <form className="col-span-12 md:col-span-7 md:pl-6 border-l border-rule">
            <div className="bg-bone border border-ink p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="numeral">Sign-in form</div>
                  <div className="display text-[28px] leading-tight tracking-[-0.025em] mt-1">
                    The {SUBJECT.code} desk
                  </div>
                </div>
                <div className="numeral text-right">
                  Form 2A<br />Rev. May 26
                </div>
              </div>

              <fieldset className="space-y-6">
                <div>
                  <label className="label block mb-2">Identity number</label>
                  <input
                    type="text"
                    placeholder="2023607832"
                    defaultValue="2023607832"
                    className="w-full border-b border-ink bg-transparent py-3 text-[20px] font-mono outline-none placeholder:text-ink-muted/60 focus:border-oxblood transition-colors"
                  />
                  <div className="numeral mt-2">
                    Type the digits as printed on your card.
                  </div>
                </div>

                <div>
                  <label className="label block mb-2">Passphrase</label>
                  <input
                    type="password"
                    placeholder="• • • • • • • •"
                    defaultValue="passpassword"
                    className="w-full border-b border-ink bg-transparent py-3 text-[20px] font-mono tracking-[0.4em] outline-none focus:border-oxblood transition-colors"
                  />
                  <div className="numeral mt-2">
                    Forgotten? <span className="text-ink underline-offset-4 underline">Speak to the registrar.</span>
                  </div>
                </div>

                <div>
                  <label className="label block mb-3">Role for this session</label>
                  <div className="grid grid-cols-3 gap-0 border border-ink">
                    {ROLES.map((r, i) => (
                      <label
                        key={r.key}
                        className={`relative flex flex-col items-center gap-1 px-2 py-4 cursor-pointer ${i !== 0 ? "border-l border-ink" : ""} has-[:checked]:bg-ink has-[:checked]:text-bone transition-colors`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.key}
                          defaultChecked={r.key === "Mentee"}
                          className="sr-only"
                        />
                        <span className="numeral">{r.abbr}</span>
                        <span className="text-[14px] font-medium">{r.key}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft cursor-pointer">
                    <input type="checkbox" className="size-3 accent-ink" defaultChecked />
                    <span>Remember this desk</span>
                  </label>
                  <span className="numeral">Session 90m</span>
                </div>
              </fieldset>

              <div className="rule-thick mt-8" />

              <div className="mt-6 flex items-center justify-between gap-3">
                <Link
                  href="/"
                  className="link-reveal text-xs font-medium uppercase tracking-wider text-ink-soft"
                >
                  ← Back to masthead
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 border border-ink bg-ink px-6 py-3 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors"
                >
                  Open the desk
                  <span aria-hidden>→</span>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-xs font-medium uppercase tracking-wider text-ink-muted border-t border-rule pt-4">
                <div>
                  <div>Method</div>
                  <div className="text-ink mt-1">Password</div>
                </div>
                <div>
                  <div>Encryption</div>
                  <div className="text-ink mt-1">TLS 1.3</div>
                </div>
                <div className="text-right">
                  <div>Issued</div>
                  <div className="text-ink mt-1">04 May 26</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* HELP STRIP */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="label">Help</div>
            <div className="display text-[40px] leading-none mt-3 tracking-[-0.03em]">
              The librarian
              <br />
              <span className="display-italic">on duty.</span>
            </div>
          </div>
          {[
            { n: "01", t: "First sign-in", b: "Use the temporary passphrase mailed to your UiTM address. The system will ask you to set a new one." },
            { n: "02", t: "Lost device", b: "We can revoke a session from the registrar console. Visit Block A reception with your card." },
            { n: "03", t: "Become a mentor", b: "Apply through the faculty portal. Approval takes one academic day." },
          ].map((h) => (
            <div key={h.n} className="col-span-12 md:col-span-3 border-l border-rule pl-6">
              <div className="numeral">{h.n}</div>
              <div className="mt-2 eyebrow-italic text-[18px] text-ink">{h.t}</div>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{h.b}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
