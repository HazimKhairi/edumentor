import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

// Augment the session type so session.user carries id, identity, role.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      identity: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    id?: string;
    identity?: string;
    role?: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    identity: string;
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        identity: { label: "Matric or staff ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identity = String(credentials?.identity ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!identity || !password) return null;

        const user = await db.user.findUnique({ where: { identity } });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        if (user.status === "Suspended") return null;

        return {
          id: user.id,
          identity: user.identity,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.identity = user.identity ?? "";
        token.role = user.role ?? "Mentee";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.identity = token.identity;
      session.user.role = token.role;
      return session;
    },
  },
});
