import Image from "next/image";
import Link from "next/link";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { RequiredMark } from "@/components/required-mark";
import { PasswordField } from "@/components/password-field";
import { dashboardFor } from "@/lib/data";
import { db } from "@/lib/db";

export const metadata = {
  title: "Sign in | EduMentor",
  description: "Sign in with your matric or FCMS staff number.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string; registered?: string }>;
}) {
  const { error, callbackUrl, registered } = await searchParams;

  async function signInAction(formData: FormData) {
    "use server";
    const identity = String(formData.get("identity") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    // Route to the right console based on role, unless the caller passed an
    // explicit callbackUrl (e.g. they hit /login after being kicked from a
    // protected page and want to return there).
    let redirectTo = callbackUrl;
    if (!redirectTo) {
      const u = await db.user.findUnique({
        where: { identity },
        select: { role: true },
      });
      redirectTo = u ? dashboardFor(u.role) : "/dashboard";
    }
    try {
      await signIn("credentials", {
        identity,
        password,
        redirectTo,
      });
    } catch (e) {
      // signIn throws to perform the redirect on success — let those bubble.
      if (e instanceof AuthError) {
        const reason = e.type === "CredentialsSignin" ? "invalid" : "error";
        const { redirect } = await import("next/navigation");
        redirect(`/login?error=${reason}`);
      }
      throw e;
    }
  }

  const errorCopy =
    error === "invalid"
      ? "Wrong identity or password."
      : error
        ? "Sign-in failed. Try again."
        : null;

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <aside className="hidden lg:flex relative p-12 text-bone flex-col justify-between overflow-hidden">
        <Image
          src="/images/mentor-tutoring.jpg"
          alt="A senior student tutoring a junior over open textbooks"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-black/30" />

        <Link
          href="/"
          className="relative z-10 inline-flex items-center w-fit bg-bone rounded-md px-3 py-2"
        >
          <Image
            src="/logo.png"
            alt="EduMentor"
            width={140}
            height={40}
            className="h-9 w-auto"
          />
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight">
            Take a seat at the desk.
          </h2>
          <p className="mt-4 text-bone/85 max-w-md leading-relaxed text-sm">
            Sign in with the matric on your student card, or the FCMS staff
            number on your lecturer card. The desk arranges itself accordingly.
          </p>
        </div>

        <p className="text-xs text-bone/60 relative z-10">
          © 2026 EduMentor | UiTM, FCMS
        </p>
      </aside>

      <section className="flex flex-col justify-center p-6 sm:p-12 bg-paper">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="EduMentor"
              width={160}
              height={48}
              className="h-11 w-auto"
            />
          </Link>

          <div className="flex border-b border-rule mb-8">
            <span className="flex-1 pb-3 font-semibold text-sm text-ink border-b-2 border-oxblood text-center">
              Sign in
            </span>
            <Link
              href="/register"
              className="flex-1 pb-3 font-semibold text-sm text-ink-muted hover:text-ink text-center"
            >
              Create account
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-6">
            Matric for student. FCMS staff number for lecturer. Type{" "}
            <span className="font-semibold tabular">admin</span> for the registrar account.
          </p>

          {registered ? (
            <div
              role="status"
              className="mb-5 rounded-md border border-fern/40 bg-fern/10 px-3 py-2 text-sm text-fern"
            >
              Account created. Sign in with your matric and password.
            </div>
          ) : null}
          {errorCopy ? (
            <div
              role="alert"
              className="mb-5 rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood"
            >
              {errorCopy}
            </div>
          ) : null}

          <form action={signInAction} className="space-y-4">
            <div>
              <label
                htmlFor="identity"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Identity number<RequiredMark />
              </label>
              <input
                id="identity"
                name="identity"
                type="text"
                required
                placeholder="Matric, staff number, or admin"
                className="input"
                autoComplete="username"
              />
            </div>

            <PasswordField />

            <button type="submit" className="btn btn-primary btn-lg w-full">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            New here?{" "}
            <Link
              href="/register"
              className="text-oxblood hover:text-oxblood-deep font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
