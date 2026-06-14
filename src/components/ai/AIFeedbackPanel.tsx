"use client";

import { useAIFeedbackStore } from "@/stores/aiFeedback";
import { useCanvasStore } from "@/stores/canvas";
import { BlockId } from "@/types";

export default function AIFeedbackPanel() {
  const { feedback, clearFeedback, markInserted } = useAIFeedbackStore();
  const { addItem } = useCanvasStore();

  if (feedback.rawResult && !feedback.type) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-600 leading-relaxed whitespace-pre-wrap">
          {feedback.rawResult}
        </p>
      </div>
    );
  }

  if (!feedback.type || feedback.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-2xl mb-2">🤖</p>
        <p className="text-xs text-gray-400">
          Usa 💡 o ❓ in un blocco<br />per ricevere feedback AI.
        </p>
      </div>
    );
  }

  const handleInsert = (index: number) => {
    if (!feedback.blockId) return;
    addItem(feedback.blockId as BlockId, feedback.items[index]);
    markInserted(index);

    const remaining = feedback.items.filter((_, i) => i !== index);
    if (remaining.length === 0) {
      setTimeout(() => clearFeedback(), 1500);
    }
  };

  const isSuggestions = feedback.type === "suggestions";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate pr-2">
          {feedback.blockTitle}
        </h3>
        <button
          onClick={clearFeedback}
          className="text-gray-400 hover:text-gray-600 shrink-0 text-xs"
        >
          ✕
        </button>
      </div>

      <div className="mb-2">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            isSuggestions
              ? "bg-purple-100 text-purple-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isSuggestions ? "💡 Suggerimenti" : "❓ Domande"}
        </span>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {feedback.items.map((item, i) => (
          <div
            key={i}
            className={`rounded-lg border p-2.5 text-xs leading-relaxed ${
              isSuggestions
                ? "bg-purple-50/50 border-purple-100"
                : "bg-amber-50/50 border-amber-100"
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`shrink-0 mt-0.5 text-[10px] font-medium ${
                  isSuggestions ? "text-purple-400" : "text-amber-400"
                }`}
              >
                {isSuggestions ? i + 1 : `${i + 1}.`}
              </span>
              <p className="flex-1 text-gray-700">{item}</p>
              {isSuggestions && (
                <button
                  onClick={() => handleInsert(i)}
                  className="shrink-0 px-2 py-0.5 text-[10px] font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded transition-colors"
                >
                  ＋ Aggiungi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isSuggestions && feedback.items.length === 0 && (
        <p className="text-xs text-green-600 text-center py-4">
          ✓ Tutti i suggerimenti inseriti
        </p>
      )}
    </div>
  );
}
