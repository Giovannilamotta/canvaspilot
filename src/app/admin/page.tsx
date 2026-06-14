"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  activeToday: number;
  aiCallsLast30: number;
  proUsers: number;
  aiUsageChart: { date: string; calls: number }[];
  recentUsers: { email: string; branch: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Utenti totali</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Attivi oggi</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeToday}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">AI calls (30gg)</p>
          <p className="text-2xl font-bold text-purple-600">{stats.aiCallsLast30}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Utenti Pro</p>
          <p className="text-2xl font-bold text-amber-600">{stats.proUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">AI Calls (ultimi 30 giorni)</h2>
          <div className="flex items-end gap-1 h-32">
            {stats.aiUsageChart.map((d, i) => {
              const max = Math.max(...stats.aiUsageChart.map((x) => x.calls), 1);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-purple-400 dark:bg-purple-500 rounded-t"
                    style={{ height: `${(d.calls / max) * 100}%` }}
                  />
                  <span className="text-[8px] text-gray-400 dark:text-gray-600">
                    {d.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Utenti recenti</h2>
          <div className="space-y-2">
            {stats.recentUsers.slice(0, 8).map((u, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{u.email}</span>
                <span className="text-gray-400 dark:text-gray-500">{u.branch}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
