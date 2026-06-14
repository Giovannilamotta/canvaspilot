"use client";

import { useState, useEffect } from "react";
import AIAnalysis from "@/components/ai/AIAnalysis";
import AIFeedbackPanel from "@/components/ai/AIFeedbackPanel";
import VersionPanel from "@/components/versioning/VersionPanel";
import BranchPanel from "@/components/branching/BranchPanel";
import AIFillCanvas from "@/components/ai/AIFillCanvas";
import { useOnboardingStore } from "@/stores/onboarding";
import { useAIFeedbackStore } from "@/stores/aiFeedback";

type Panel = "versions" | "branches" | "idea" | "ai" | "analysis" | null;

export default function RightPanel() {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const { data } = useOnboardingStore();
  const notifyCount = useAIFeedbackStore((s) => s.notifyCount);

  useEffect(() => {
    if (notifyCount > 0) {
      setActivePanel("ai");
    }
  }, [notifyCount]);

  return (
    <div className="w-80 shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActivePanel(activePanel === "versions" ? null : "versions")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "versions"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          Versions
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "branches" ? null : "branches")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "branches"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          Branches
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "idea" ? null : "idea")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "idea"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          Idea
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "ai" ? null : "ai")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "ai"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          AI
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "analysis" ? null : "analysis")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "analysis"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          Analysis
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activePanel === "versions" && (
          <VersionPanel onClose={() => setActivePanel(null)} />
        )}
        {activePanel === "branches" && (
          <BranchPanel onClose={() => setActivePanel(null)} />
        )}
        {activePanel === "idea" && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">La tua Idea di Business</h3>
            {data.businessIdea ? (
              <>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {data.businessIdea}
                  </p>
                </div>
                <AIFillCanvas className="w-full justify-center" />
              </>
            ) : (
              <div className="p-4 text-center text-sm text-gray-300 dark:text-gray-600">
                <p className="mb-2 text-2xl">💡</p>
                <p>Nessuna idea registrata</p>
                <p className="text-xs mt-1">Completa il wizard per descrivere la tua idea di business</p>
              </div>
            )}
          </div>
        )}
        {activePanel === "ai" && <AIFeedbackPanel />}
        {activePanel === "analysis" && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Analysis</h3>
            <AIAnalysis />
          </div>
        )}
        {!activePanel && (
          <div className="p-6 text-center text-sm text-gray-300 dark:text-gray-600">
            <p className="mb-2 text-3xl">📋</p>
            <p>Select a panel above</p>
          </div>
        )}
      </div>
    </div>
  );
}
