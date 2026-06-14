"use client";

import { useState } from "react";
import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import { useThemeStore } from "@/stores/theme";

export default function Sidebar() {
  const { reset, saveVersion } = useCanvasStore();
  const { open: openAI } = useAIConfigStore();
  const { open: openWizard } = useOnboardingStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <aside className="w-16 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 gap-3 h-full">
        <div className="text-lg font-bold text-purple-600 mb-1">CP</div>
        <span className="text-[8px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full px-1.5 py-px">
          BETA
        </span>

        <button
          onClick={openWizard}
          title="Setup Wizard"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          🧭
        </button>

        <button
          onClick={saveVersion}
          title="Save Version"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          💾
        </button>

        <button
          onClick={openAI}
          title="AI Settings"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          ⚙️
        </button>

        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Canvas"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            🗑️
          </button>
        </div>
      </aside>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Reset Canvas
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Verranno cancellati tutti i dati del canvas e le versioni salvate.
              I branch non saranno toccati. Questa azione non puo' essere annullata.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
              >
                Annulla
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
