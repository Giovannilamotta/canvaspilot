import { create } from "zustand";
import { BlockId } from "@/types";

export type FeedbackType = "suggestions" | "questionnaire";

export interface AIFeedbackData {
  type: FeedbackType | null;
  blockId: BlockId | null;
  blockTitle: string;
  items: string[];
  rawResult: string;
}

interface AIFeedbackStore {
  feedback: AIFeedbackData;
  notifyCount: number;
  setFeedback: (data: AIFeedbackData) => void;
  clearFeedback: () => void;
  markInserted: (index: number) => void;
}

const emptyFeedback: AIFeedbackData = {
  type: null,
  blockId: null,
  blockTitle: "",
  items: [],
  rawResult: "",
};

export const useAIFeedbackStore = create<AIFeedbackStore>()((set, get) => ({
  feedback: { ...emptyFeedback },
  notifyCount: 0,
  setFeedback: (data) =>
    set({ feedback: data, notifyCount: get().notifyCount + 1 }),
  clearFeedback: () => set({ feedback: { ...emptyFeedback } }),
  markInserted: (index) =>
    set((s) => ({
      feedback: {
        ...s.feedback,
        items: s.feedback.items.filter((_, i) => i !== index),
      },
    })),
}));
