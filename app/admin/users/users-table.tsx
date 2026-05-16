"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpCircle, Search, Trash2 } from "lucide-react";
import type { Role } from "@prisma/client";

const roleBadge: Record<string, string> = {
  Admin: "badge badge-oxblood",
  Mentor: "badge badge-saffron",
  Mentee: "badge badge-fern",
};

const statusBadge: Record<string, string> = {
  Active: "badge badge-fern",
  Probation: "badge badge-saffron",
  Suspended: "badge badge-oxblood",
};

type RoleFilter = "All" | Role;

export type AdminUserRow = {
  id: string;
  name: string;
  identity: string;
  role: Role;
  status: string;
  joined: string;
};

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (role !== "All" && u.role !== role) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.identity.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [query, role, users]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, matric, or role"
            className="input pl-9 py-2 text-sm w-full"
          />
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as RoleFilter)}
          className="input max-w-[160px] py-2 text-sm"
        >
          <option value="All">All roles</option>
          <option value="Mentee">Mentee</option>
          <option value="Mentor">Mentor</option>
          <option value="Admin">Admin</option>
        </select>
        <span className="text-xs text-ink-muted ml-auto">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-dark/50 text-xs text-ink-muted">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Identity</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-ink-muted"
                >
                  No users match this search.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-paper-dark/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="size-8 rounded-full bg-paper-dark text-ink-muted flex items-center justify-center text-xs font-semibold">
                        {u.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="font-medium group-hover:text-oxblood transition-colors">
                        {u.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular text-ink-muted">{u.identity}</td>
                  <td className="px-4 py-3">
                    <span className={roleBadge[u.role]}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusBadge[u.status]}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted tabular">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {u.role === "Mentee" ? (
                        <Link
                          href={`/admin/users/${u.id}/promote`}
                          className="size-8 rounded-sm border border-rule hover:border-oxblood hover:bg-oxblood/5 hover:text-oxblood flex items-center justify-center"
                          aria-label={`Promote ${u.name} to mentor`}
                          title="Promote to mentor"
                        >
                          <ArrowUpCircle size={14} />
                        </Link>
                      ) : null}
                      <Link
                        href={`/admin/users/${u.id}/delete`}
                        className="size-8 rounded-sm border border-rule hover:border-oxblood hover:bg-oxblood/5 hover:text-oxblood flex items-center justify-center"
                        aria-label={`Delete ${u.name}`}
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
