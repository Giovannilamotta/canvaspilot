"use client";

import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import AIAnalysis from "@/components/ai/AIAnalysis";
import VersionPanel from "@/components/versioning/VersionPanel";
import BranchPanel from "@/components/branching/BranchPanel";

export default function Sidebar() {
  const { reset } = useCanvasStore();
  const { open: openAI } = useAIConfigStore();
  const { open: openWizard } = useOnboardingStore();
  const { canvas, saveVersion } = useCanvasStore();

  return (
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
        onClick={() => {
          reset();
        }}
        title="New Canvas"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
      >
        ＋
      </button>

      <button
        onClick={() => {
          saveVersion();
        }}
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
  );
}
