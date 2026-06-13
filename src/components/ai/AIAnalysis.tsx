"use client";

import { useState } from "react";
import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import { buildCanvasContext } from "@/lib/score";

export default function AIAnalysis() {
  const { canvas } = useCanvasStore();
  const { config } = useAIConfigStore();
  const { data: onboarding } = useOnboardingStore();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const runAnalysis = async () => {
    if (!config.apiKey) {
      setError("Configure AI settings first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const canvasContext = buildCanvasContext(canvas);
      const prompt = `You are a startup advisor. Review the following Business Model Canvas for a ${onboarding.startupType} startup in the ${onboarding.industry} industry, at ${onboarding.phase} stage, targeting ${onboarding.geography} market, using a ${onboarding.businessModel} model.

Analyze the BMC for:
1. Mismatches or contradictions between blocks
2. Unvalidated assumptions
3. Overlooked opportunities
4. Top 3 prioritized recommendations

Respond in Italian.

Canvas:\n\n${canvasContext}`;

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
      setIsOpen(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          "🔍"
        )}
        Analisi Canvas
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-purple-900">
                Analisi Completa del Canvas
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                result
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <span className="text-xs text-red-500 ml-2">{error}</span>
      )}
    </>
  );
}
