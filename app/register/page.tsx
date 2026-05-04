import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ROLES } from "@/lib/data";

export const metadata = {
  title: "Create account | EduMentor",
  description: "Register a new account.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <aside className="hidden lg:flex relative bg-gradient-to-br from-oxblood via-oxblood-deep to-ink p-12 text-bone flex-col justify-between overflow-hidden">
        <Link href="/" className="inline-flex items-center w-fit bg-bone rounded-md px-3 py-2">
          <Image src="/logo.png" alt="EduMentor" width={140} height={40} className="h-9 w-auto" />
        </Link>

        <div className="relative z-10">
          <div className="text-sm font-semibold text-saffron mb-3">Join EduMentor</div>
          <h2 className="text-3xl font-bold leading-tight">
            Open the desk in three minutes.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            Tell us who you are, what you teach or study, and the desk
            arranges itself accordingly.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Free for UiTM staff and students",
              "Approval typically within one academic day",
              "Email confirmation sent on submission",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="size-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(201, 135, 41, 0.25)", color: "var(--color-saffron)" }}>
                  <Check size={12} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs relative z-10" style={{ color: "rgba(255,255,255,0.5)" }}>
          © 2026 EduMentor, UiTM, FCMS
        </p>
      </aside>

      <section className="flex flex-col justify-center p-6 sm:p-12 bg-paper">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="lg:hidden flex justify-center mb-8">
            <Image src="/logo.png" alt="EduMentor" width={160} height={48} className="h-11 w-auto" />
          </Link>

          <div className="flex border-b border-rule mb-8">
            <Link href="/login" className="flex-1 pb-3 font-semibold text-base text-ink-muted hover:text-ink text-center">
              Sign in
            </Link>
            <span className="flex-1 pb-3 font-semibold text-base text-ink border-b-2 border-oxblood text-center">
              Create account
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-ink-muted text-sm mb-8">
            Use your UiTM email and the matric or staff number printed on your card.
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
              <input
                type="text"
                placeholder="Aiman Hakimi"
                className="input"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">UiTM email</label>
              <input
                type="email"
                placeholder="2023607832@student.uitm.edu.my"
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Identity number</label>
              <input
                type="text"
                placeholder="Matric or staff number"
                className="input"
                autoComplete="username"
              />
              <p className="text-xs text-ink-muted mt-1.5">
                Mentee, matric. Mentor, staff number. Admin accounts are issued by registrar.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Choose a strong password"
                className="input"
                autoComplete="new-password"
              />
              <p className="text-xs text-ink-muted mt-1.5">
                Minimum 10 characters with one number.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">I am signing up as</label>
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
              <p className="text-xs text-ink-muted mt-2">
                Mentor and Admin accounts require approval before activation.
              </p>
            </div>

            <label className="flex items-start gap-2 text-sm text-ink-soft cursor-pointer">
              <input type="checkbox" className="size-4 mt-0.5 accent-oxblood" />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-oxblood font-medium">terms of use</Link>{" "}
                and{" "}
                <Link href="#" className="text-oxblood font-medium">privacy policy</Link>.
              </span>
            </label>

            <Link href="/login" className="btn btn-primary btn-lg w-full">
              Create account
            </Link>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-oxblood hover:text-oxblood-deep font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
