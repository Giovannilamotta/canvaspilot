"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import BMCEditor from "@/components/bmc/BMCEditor";
import ValidityScore from "@/components/score/ValidityScore";
import RightPanel from "@/components/layout/RightPanel";
import AIAnalysis from "@/components/ai/AIAnalysis";
import AIFillCanvas from "@/components/ai/AIFillCanvas";
import VersionPanel from "@/components/versioning/VersionPanel";
import BranchPanel from "@/components/branching/BranchPanel";
import StartupWizard from "@/components/wizard/StartupWizard";
import AISettings from "@/components/ai/AISettings";
import { useCanvasStore } from "@/stores/canvas";
import { useBranchStore } from "@/stores/branches";

type MobilePanel = "versions" | "branches" | "analysis" | null;

export default function AppLayout() {
  const { canvas } = useCanvasStore();
  const { initMainBranch } = useBranchStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const [floatingOpen, setFloatingOpen] = useState(false);

  useEffect(() => {
    initMainBranch(canvas);
  }, []);

  return (
    <div className="h-full flex flex-col bg-canvas-bg">
      <StartupWizard />
      <AISettings />

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-1"
          >
            ☰
          </button>
          <span className="text-sm font-bold text-purple-600">CanvasPilot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AIFillCanvas />
          <AIAnalysis />
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-purple-600">CanvasPilot</span>
          <span className="text-[10px] text-gray-400">Business Model Canvas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AIFillCanvas />
          <AIAnalysis />
        </div>
      </header>

      <ValidityScore />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Slide-in Sidebar */}
        {mobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-16 bg-white border-r border-gray-200 animate-slide-left">
              <Sidebar />
            </div>
          </>
        )}

        {/* BMCEditor */}
        <BMCEditor />

        {/* Desktop Right Panel */}
        <RightPanel />

        {/* Mobile Floating Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          {floatingOpen && (
            <div className="absolute bottom-14 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 w-44 p-2 space-y-1 animate-fade-in">
              <button
                onClick={() => {
                  setMobilePanel("versions");
                  setFloatingOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                💾 Versions
              </button>
              <button
                onClick={() => {
                  setMobilePanel("branches");
                  setFloatingOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                🌿 Branches
              </button>
              <button
                onClick={() => {
                  setMobilePanel("analysis");
                  setFloatingOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                🔍 Analysis
              </button>
            </div>
          )}
          <button
            onClick={() => setFloatingOpen(!floatingOpen)}
            className="w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Mobile Bottom Panel */}
      {mobilePanel && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30"
            onClick={() => setMobilePanel(null)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 bg-gray-200 rounded-full" />
            </div>
            {mobilePanel === "versions" && (
              <VersionPanel onClose={() => setMobilePanel(null)} />
            )}
            {mobilePanel === "branches" && (
              <BranchPanel onClose={() => setMobilePanel(null)} />
            )}
            {mobilePanel === "analysis" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Analysis</h3>
                  <button
                    onClick={() => setMobilePanel(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <AIAnalysis />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
