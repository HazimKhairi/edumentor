import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { RegisterForm } from "@/components/register-form";

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
            Tell us who you are, capture your face for attendance, and the
            desk arranges itself accordingly.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Free for UiTM students and faculty lecturers",
              "Senior students need CGPA 3.20 or above to mentor",
              "One-time face capture, KYC-style, kept on-device",
              "Approval typically within one academic day",
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
            For UiTM students. Lecturer (admin) accounts are issued by the registrar.
          </p>

          <RegisterForm />

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
