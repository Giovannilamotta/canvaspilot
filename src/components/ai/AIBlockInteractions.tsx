"use client";

import { useState } from "react";
import { BlockId } from "@/types";
import { useCanvasStore } from "@/stores/canvas";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import { useAIFeedbackStore } from "@/stores/aiFeedback";
import { buildBlockContext } from "@/lib/score";
import { AIInteractionType } from "@/types";

interface Props {
  blockId: BlockId;
  blockTitle: string;
}

function parseAIResponse(text: string): string[] {
  const clean = text.trim();
  const numberedMatch = clean.match(/(?:\d+[.)]\s+)(.*?)(?=(?:\n\d+[.)]\s+)|\n\n|$)/gs);
  if (numberedMatch && numberedMatch.length >= 1) {
    return numberedMatch
      .map((s) => s.replace(/^\d+[.)]\s+/, "").trim())
      .filter((s) => s.length > 3);
  }
  const lines = clean.split("\n");
  const bulletLines = lines.filter((l) => /^[-•*]\s/.test(l.trim()));
  if (bulletLines.length >= 1) {
    return bulletLines
      .map((s) => s.replace(/^[-•*]\s+/, "").trim())
      .filter((s) => s.length > 3);
  }
  return lines.map((s) => s.trim()).filter((s) => s.length > 5);
}

export default function AIBlockInteractions({ blockId, blockTitle }: Props) {
  const { config } = useAIConfigStore();
  const { canvas } = useCanvasStore();
  const { data: onboarding } = useOnboardingStore();
  const setFeedback = useAIFeedbackStore((s) => s.setFeedback);
  const [loading, setLoading] = useState<AIInteractionType | null>(null);

  const runInteraction = async (type: AIInteractionType) => {
    if (!config.apiKey) {
      setFeedback({
        type: null,
        blockId: null,
        blockTitle: "",
        items: [],
        rawResult: "⚠️ Configura prima le impostazioni AI (⚙️ nella sidebar)",
      });
      return;
    }
    setLoading(type);
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

      const items = parseAIResponse(data.result);
      setFeedback({
        type,
        blockId,
        blockTitle,
        items,
        rawResult: data.result,
      });
    } catch (e: unknown) {
      setFeedback({
        type: null,
        blockId: null,
        blockTitle: "",
        items: [],
        rawResult: `❌ ${e instanceof Error ? e.message : "Errore sconosciuto"}`,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
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
    </div>
  );
}
