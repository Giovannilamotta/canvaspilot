"use client";

import { useState } from "react";
import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import { BlockId, CanvasData } from "@/types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function extractJSON(text: string): Record<string, unknown> | null {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;
  try {
    return JSON.parse(jsonStr.trim());
  } catch {
    return null;
  }
}

interface Props {
  className?: string;
}

export default function AIFillCanvas({ className = "" }: Props) {
  const { setCanvas, canvas } = useCanvasStore();
  const { config } = useAIConfigStore();
  const { data: onboarding } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const hasContent = Object.values(canvas.blocks).some(
    (b) => b.items.length > 0 || b.notes.length > 0
  );

  const handleClick = () => {
    if (hasContent) {
      setShowConfirm(true);
    } else {
      fillCanvas();
    }
  };

  const fillCanvas = async () => {
    if (!config.apiKey) {
      setError("Configura prima le impostazioni AI");
      return;
    }
    if (!onboarding.businessIdea) {
      setError("Descrivi prima la tua idea di business nel wizard");
      return;
    }
    setLoading(true);
    setError("");
    setShowConfirm(false);
    try {
      const prompt = `You are a startup advisor. Based on the following business idea and context, fill in a complete Business Model Canvas with 9 blocks.

Context:
- Startup Type: ${onboarding.startupType}
- Industry: ${onboarding.industry}
- Phase: ${onboarding.phase}
- Geography: ${onboarding.geography}
- Business Model: ${onboarding.businessModel}

Business Idea: ${onboarding.businessIdea}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "blocks": {
    "customerSegments": { "items": ["segment 1", "segment 2"], "notes": "brief rationale" },
    "valuePropositions": { "items": ["value 1", "value 2"], "notes": "brief rationale" },
    "channels": { "items": ["channel 1", "channel 2"], "notes": "brief rationale" },
    "customerRelationships": { "items": ["relationship 1", "relationship 2"], "notes": "brief rationale" },
    "revenueStreams": { "items": ["revenue 1", "revenue 2"], "notes": "brief rationale" },
    "keyResources": { "items": ["resource 1", "resource 2"], "notes": "brief rationale" },
    "keyActivities": { "items": ["activity 1", "activity 2"], "notes": "brief rationale" },
    "keyPartnerships": { "items": ["partner 1", "partner 2"], "notes": "brief rationale" },
    "costStructure": { "items": ["cost 1", "cost 2"], "notes": "brief rationale" }
  }
}

Each "items" array must contain 2-4 specific, concrete items in Italian language. Each "notes" should be 1-2 sentences in Italian explaining the reasoning.`;

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

      const parsed = extractJSON(data.result);
      if (!parsed || !parsed.blocks) {
        throw new Error("Impossibile interpretare la risposta AI. Riprova.");
      }

      const aiBlocks = (parsed as { blocks: Record<string, { items: string[]; notes: string }> }).blocks;
      const newBlocks = { ...canvas.blocks };

      for (const [blockId, aiBlock] of Object.entries(aiBlocks)) {
        if (blockId in newBlocks && Array.isArray(aiBlock.items)) {
          newBlocks[blockId as BlockId] = {
            ...newBlocks[blockId as BlockId],
            items: aiBlock.items.map((text: string) => ({
              id: generateId(),
              text,
              validated: false,
            })),
            notes: aiBlock.notes || "",
          };
        }
      }

      setCanvas({ blocks: newBlocks } as CanvasData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "🤖"
        )}
        Compila BMC
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Canvas già compilato
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Il canvas contiene già dei dati. Vuoi sovrascriverli con la nuova compilazione AI?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
              >
                Annulla
              </button>
              <button
                onClick={fillCanvas}
                className="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                Sovrascrivi
              </button>
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
