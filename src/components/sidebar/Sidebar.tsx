"use client";

import { useState } from "react";
import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";

export default function Sidebar() {
  const { reset, saveVersion } = useCanvasStore();
  const { open: openAI } = useAIConfigStore();
  const { open: openWizard } = useOnboardingStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
  };

  return (
    <>
      <aside className="w-16 shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-3">
        <div className="text-lg font-bold text-purple-600 mb-2">CP</div>

        <button
          onClick={openWizard}
          title="Setup Wizard"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          🧭
        </button>

        <button
          onClick={() => setShowResetConfirm(true)}
          title="Reset Canvas"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          🗑️
        </button>

        <button
          onClick={saveVersion}
          title="Save Version"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          💾
        </button>

        <button
          onClick={openAI}
          title="AI Settings"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          ⚙️
        </button>
      </aside>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              ⚠️ Reset Canvas
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Verranno cancellati tutti i dati del canvas e le versioni salvate. I branch non saranno toccati. Questa azione non può essere annullata.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg"
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
