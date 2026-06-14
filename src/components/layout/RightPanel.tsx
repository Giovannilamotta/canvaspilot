"use client";

import { useState } from "react";
import AIAnalysis from "@/components/ai/AIAnalysis";
import VersionPanel from "@/components/versioning/VersionPanel";
import BranchPanel from "@/components/branching/BranchPanel";
import { useOnboardingStore } from "@/stores/onboarding";

type Panel = "versions" | "branches" | "analysis" | "idea" | null;

export default function RightPanel() {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const { data } = useOnboardingStore();

  return (
    <div className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col hidden lg:flex">
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActivePanel(activePanel === "versions" ? null : "versions")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "versions"
              ? "text-purple-700 border-b-2 border-purple-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Versions
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "branches" ? null : "branches")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "branches"
              ? "text-purple-700 border-b-2 border-purple-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Branches
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "idea" ? null : "idea")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "idea"
              ? "text-purple-700 border-b-2 border-purple-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Idea
        </button>
        <button
          onClick={() => setActivePanel(activePanel === "analysis" ? null : "analysis")}
          className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
            activePanel === "analysis"
              ? "text-purple-700 border-b-2 border-purple-500"
              : "text-gray-400 hover:text-gray-600"
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
            <h3 className="text-sm font-semibold text-gray-800 mb-3">La tua Idea di Business</h3>
            {data.businessIdea ? (
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {data.businessIdea}
                </p>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-300">
                <p className="mb-2 text-2xl">💡</p>
                <p>Nessuna idea registrata</p>
                <p className="text-xs mt-1">Completa il wizard per descrivere la tua idea di business</p>
              </div>
            )}
          </div>
        )}
        {activePanel === "analysis" && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Analysis</h3>
            <AIAnalysis />
          </div>
        )}
        {!activePanel && (
          <div className="p-6 text-center text-sm text-gray-300">
            <p className="mb-2 text-3xl">📋</p>
            <p>Select a panel above</p>
          </div>
        )}
      </div>
    </div>
  );
}
