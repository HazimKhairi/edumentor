import Image from "next/image";
import Link from "next/link";
import { ROLES } from "@/lib/data";

export const metadata = {
  title: "Sign in — EduMentor",
  description: "Sign in or create an account to continue.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <aside className="hidden lg:flex relative bg-gradient-to-br from-oxblood via-oxblood-deep to-ink p-12 text-bone flex-col justify-between overflow-hidden">
        <Link href="/" className="inline-flex items-center w-fit bg-bone rounded-md px-3 py-2">
          <Image src="/logo.png" alt="EduMentor" width={140} height={40} className="h-9 w-auto" />
        </Link>

        <div className="relative z-10">
          <div className="text-sm font-semibold text-saffron mb-3">Welcome back</div>
          <h2 className="display text-5xl leading-tight">
            Take a seat at the{" "}
            <span className="display-italic text-saffron">desk.</span>
          </h2>
          <p className="mt-5 text-bone/80 max-w-md leading-relaxed">
            Pick the role written on your card. The desk arranges itself
            accordingly — admins see the catalogue, mentors see the cohort,
            mentees see the reading.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            <div>
              <div className="display text-3xl">158</div>
              <div className="text-xs text-bone/60 mt-1">Active mentees</div>
            </div>
            <div>
              <div className="display text-3xl">12</div>
              <div className="text-xs text-bone/60 mt-1">Mentors</div>
            </div>
            <div>
              <div className="display text-3xl">4.6<span className="text-saffron">★</span></div>
              <div className="text-xs text-bone/60 mt-1">Avg. rating</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-bone/50 relative z-10">
          © 2026 EduMentor — UiTM, FCMS
        </p>

        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#fff" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </aside>

      <section className="flex flex-col justify-center p-6 sm:p-12 bg-paper">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="lg:hidden flex justify-center mb-8">
            <Image src="/logo.png" alt="EduMentor" width={160} height={48} className="h-11 w-auto" />
          </Link>

          <div className="flex border-b border-rule mb-8">
            <button className="flex-1 pb-3 font-semibold text-base text-ink border-b-2 border-oxblood">
              Sign in
            </button>
            <button className="flex-1 pb-3 font-semibold text-base text-ink-muted hover:text-ink">
              Sign up
            </button>
          </div>

          <h1 className="display text-3xl mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-8">
            Sign in with your matric or staff number to continue.
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Identity number</label>
              <input
                type="text"
                placeholder="e.g. 2023607832"
                defaultValue="2023607832"
                className="input"
                autoComplete="username"
              />
              <p className="text-xs text-ink-muted mt-1.5">
                Matric (mentee), staff number (mentor), or admin ID.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-ink">Password</label>
                <Link href="#" className="text-xs text-oxblood hover:text-oxblood-deep font-medium">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                defaultValue="passpassword"
                className="input"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Sign in as</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <label
                    key={r.key}
                    className="relative flex flex-col items-center gap-1 p-3 rounded-md border border-rule cursor-pointer hover:border-ink has-[:checked]:border-oxblood has-[:checked]:bg-oxblood/[0.04] transition-colors"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.key}
                      defaultChecked={r.key === "Mentee"}
                      className="sr-only"
                    />
                    <span className="text-xs text-ink-muted font-semibold">{r.abbr}</span>
                    <span className="text-sm font-medium">{r.key}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
              <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
              <span>Keep me signed in for 90 minutes</span>
            </label>

            <Link href="/dashboard" className="btn btn-primary btn-lg w-full">
              Sign in →
            </Link>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rule" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-paper px-3 text-ink-muted">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="btn btn-ghost text-sm">UiTM SSO</button>
              <button type="button" className="btn btn-ghost text-sm">Google</button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            New here?{" "}
            <Link href="#" className="text-oxblood hover:text-oxblood-deep font-semibold">
              Apply for an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
