"use client";

import { useState } from "react";
import { BlockId } from "@/types";
import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import { buildBlockContext } from "@/lib/score";
import { AIInteractionType } from "@/types";

interface Props {
  blockId: BlockId;
  blockTitle: string;
}

export default function AIBlockInteractions({ blockId, blockTitle }: Props) {
  const { config } = useAIConfigStore();
  const { canvas } = useCanvasStore();
  const { data: onboarding } = useOnboardingStore();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState<AIInteractionType | null>(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const runInteraction = async (type: AIInteractionType) => {
    if (!config.apiKey) {
      setError("Set API key in AI Settings");
      return;
    }
    setLoading(type);
    setError("");
    try {
      const blockContext = buildBlockContext(blockId, canvas);
      const ideaContext = onboarding.businessIdea
        ? `\nBusiness Idea context: ${onboarding.businessIdea}`
        : "";
      let prompt = "";

      if (type === "suggestions") {
        prompt = `You are a startup advisor helping improve a Business Model Canvas for a ${onboarding.startupType} startup in ${onboarding.industry} at ${onboarding.phase} stage.${ideaContext}\n\nGive 2-3 specific, concrete suggestions to improve the "${blockTitle}" block. Respond in Italian. Only suggest items that are NOT already listed.\n\nCurrent content:\n${blockContext}`;
      } else {
        prompt = `You are a startup advisor. Ask 3 critical, thought-provoking questions about the "${blockTitle}" block of this Business Model Canvas. Questions should challenge assumptions and push for deeper thinking.${ideaContext}\n\nRespond in Italian.\n\nCurrent content:\n${blockContext}`;
      }

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          config,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
      setShowResult(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => runInteraction("suggestions")}
          disabled={loading !== null}
          className="flex-1 px-2 py-1 text-[10px] text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
        >
          {loading === "suggestions" ? "..." : "💡 Suggerimenti"}
        </button>
        <button
          onClick={() => runInteraction("questionnaire")}
          disabled={loading !== null}
          className="flex-1 px-2 py-1 text-[10px] text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
        >
          {loading === "questionnaire" ? "..." : "❓ Domande"}
        </button>
        <button
          onClick={() =>
            runInteraction("suggestions")
          }
          disabled={loading !== null}
          className="flex-1 px-2 py-1 text-[10px] text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
        >
          🤖 AI
        </button>
      </div>

      {showResult && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[70vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-purple-900">
                {blockTitle} — AI
              </h3>
              <button
                onClick={() => setShowResult(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {error ? <p className="text-red-500">{error}</p> : result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
