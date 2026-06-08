import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// Server-side: return the signed-in user's DB record, or null.
export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return db.user.findUnique({ where: { id: session.user.id } });
}

// Same but redirects to /login when no session. Use in pages that require auth.
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

// Require a specific role (or one of several). Redirects to /dashboard if signed
// in but wrong role, or /login if not signed in at all.
export async function requireRole(allowed: Role | Role[]) {
  const user = await requireUser();
  const list = Array.isArray(allowed) ? allowed : [allowed];
  if (!list.includes(user.role)) redirect("/dashboard");
  return user;
}

// G4 dual-role: a user can act in more than one capacity. Capabilities are
// derived from enrollments, not just User.role, so a Mentor who also studies a
// course (or vice versa) gets both consoles.
export async function getUserCapabilities(userId: string) {
  const [mentorCount, menteeCount] = await Promise.all([
    db.enrollment.count({ where: { userId, asRole: "Mentor" } }),
    db.enrollment.count({ where: { userId, asRole: "Mentee" } }),
  ]);
  return { isMentor: mentorCount > 0, isMentee: menteeCount > 0 };
}
