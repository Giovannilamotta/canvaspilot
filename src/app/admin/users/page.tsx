"use client";

import { useEffect, useState } from "react";

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || []);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Utenti</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca per email..."
        className="w-full max-w-md px-3 py-2 mb-4 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Email</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Registrato</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Ultimo accesso</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{u.email}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                  {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : "Mai"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-6">Nessun utente trovato</p>
        )}
      </div>
    </div>
  );
}
