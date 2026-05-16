import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { RegisterForm } from "@/components/register-form";
import { db } from "@/lib/db";

export const metadata = {
  title: "Create account | EduMentor",
  description: "Register a new account.",
};

export default async function RegisterPage() {
  const courses = await db.course.findMany({
    select: { id: true, code: true, title: true, semester: true },
    orderBy: { semester: "asc" },
  });
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden lg:flex sticky top-0 h-screen relative p-10 text-bone flex-col justify-between overflow-hidden">
        <Image
          src="/images/teacher-classroom.jpg"
          alt="Malaysian students with their teachers"
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-black/25" />

        <Link href="/" className="relative z-10 inline-flex items-center w-fit bg-bone rounded-md px-3 py-2">
          <Image src="/logo.png" alt="EduMentor" width={140} height={40} className="h-9 w-auto" />
        </Link>

        <div className="relative z-10">
          <div className="text-sm font-semibold text-saffron mb-3">Join EduMentor</div>
          <h2 className="text-3xl font-bold leading-tight">
            Open the desk in three minutes.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-bone/85">
            Tell us who you are, capture your face for attendance, and the
            desk arranges itself accordingly.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Free for UiTM students and faculty lecturers",
              "Mentors need CGPA 3.20 or above and must have passed the subject",
              "One-time face capture, kept private on your device",
              "Approval typically within one academic day",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span
                  className="size-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(201, 135, 41, 0.3)", color: "var(--color-saffron)" }}
                >
                  <Check size={12} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs relative z-10 text-bone/60">
          © 2026 EduMentor, UiTM, FCMS
        </p>
      </aside>

      <section className="flex flex-col p-6 sm:p-10 bg-paper">
        <div className="w-full max-w-2xl mx-auto">
          <Link href="/" className="lg:hidden flex justify-center mb-6">
            <Image src="/logo.png" alt="EduMentor" width={160} height={48} className="h-10 w-auto" />
          </Link>

          <div className="flex border-b border-rule mb-5">
            <Link href="/login" className="flex-1 pb-2.5 font-semibold text-sm text-ink-muted hover:text-ink text-center">
              Sign in
            </Link>
            <span className="flex-1 pb-2.5 font-semibold text-sm text-ink border-b-2 border-oxblood text-center">
              Create account
            </span>
          </div>

          <h1 className="text-xl font-bold mb-1">Create your account</h1>
          <p className="text-ink-muted text-xs mb-5">
            For UiTM students. Lecturer (admin) accounts are issued by the registrar.
          </p>

          <RegisterForm courses={courses} />

          <p className="mt-5 text-center text-xs text-ink-muted">
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
