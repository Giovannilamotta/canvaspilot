"use client";

import { useEffect, useState } from "react";

interface AppSettings {
  monetization_enabled?: boolean | string;
  monetization?: {
    free_daily_ai_calls?: number;
    free_max_canvases?: number;
    pro_monthly_price?: number;
    pro_yearly_price?: number;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        const mon = s.monetization || {};
        setSettings({
          ...s,
          monetization_enabled: s.monetization_enabled === true || s.monetization_enabled === "true",
          monetization: {
            free_daily_ai_calls: mon.free_daily_ai_calls || 10,
            free_max_canvases: mon.free_max_canvases || 1,
            pro_monthly_price: mon.pro_monthly_price || 9,
            pro_yearly_price: mon.pro_yearly_price || 60,
          },
        });
        setLoading(false);
      });
  }, []);

  async function save() {
    const body: Record<string, string> = {
      monetization_enabled: JSON.stringify(settings.monetization_enabled),
      monetization: JSON.stringify(settings.monetization),
    };

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Impostazioni</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Monetization Toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Monetizzazione</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Attiva i limiti per il piano free e gli abbonamenti Pro
              </p>
            </div>
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, monetization_enabled: !s.monetization_enabled }))
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.monetization_enabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.monetization_enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {settings.monetization_enabled && (
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">Piano Free</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    AI calls al giorno
                  </label>
                  <input
                    type="number"
                    value={settings.monetization?.free_daily_ai_calls || 10}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        monetization: { ...s.monetization!, free_daily_ai_calls: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Canvas massimi
                  </label>
                  <input
                    type="number"
                    value={settings.monetization?.free_max_canvases || 1}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        monetization: { ...s.monetization!, free_max_canvases: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 pt-2">Piano Pro</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Prezzo mensile (€)
                  </label>
                  <input
                    type="number"
                    value={settings.monetization?.pro_monthly_price || 9}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        monetization: { ...s.monetization!, pro_monthly_price: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Prezzo annuale (€)
                  </label>
                  <input
                    type="number"
                    value={settings.monetization?.pro_yearly_price || 60}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        monetization: { ...s.monetization!, pro_yearly_price: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={save}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
            saved
              ? "bg-green-500 text-white"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {saved ? "Salvato ✓" : "Salva impostazioni"}
        </button>
      </div>
    </div>
  );
}
