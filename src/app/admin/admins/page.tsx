"use client";

import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  email: string;
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/admins")
      .then((r) => r.json())
      .then((d) => {
        setAdmins(d.admins || []);
        setRole(d.currentUserRole || "");
        setLoading(false);
      });
  };

  useEffect(load, []);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.error) { setMessage(data.error); return; }
    setEmail("");
    setMessage("Admin aggiunto ✓");
    load();
  }

  async function removeAdmin(userId: string) {
    await fetch(`/api/admin/admins?userId=${userId}`, { method: "DELETE" });
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Gestione Admin</h1>

      {role === "super_admin" && (
        <form onSubmit={addAdmin} className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email utente da promuovere..."
            required
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Aggiungi Admin
          </button>
        </form>
      )}

      {message && (
        <p className={`text-xs mb-4 ${message.includes("✓") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Email</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Ruolo</th>
              {role === "super_admin" && (
                <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400" />
              )}
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{a.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    a.role === "super_admin"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}>
                    {a.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </td>
                {role === "super_admin" && a.role !== "super_admin" && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeAdmin(a.user_id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  </td>
                )}
                {role === "super_admin" && a.role === "super_admin" && (
                  <td className="px-4 py-3" />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
