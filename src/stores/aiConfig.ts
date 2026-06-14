import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AIConfig, AIProvider } from "@/types";

interface AIConfigStore {
  config: AIConfig;
  isOpen: boolean;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setBaseUrl: (baseUrl: string) => void;
  setModel: (model: string) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const defaultConfig: AIConfig = {
  provider: "openrouter",
  apiKey: "",
  baseUrl: "https://openrouter.ai/api/v1",
  model: "",
};

function getDefaultBaseUrl(provider: AIProvider): string {
  switch (provider) {
    case "openrouter": return "https://openrouter.ai/api/v1";
    case "openai": return "https://api.openai.com/v1";
    case "gemini": return "https://generativelanguage.googleapis.com/v1beta";
    case "ollama": return "http://localhost:11434/api";
    default: return "";
  }
}

function getDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case "openrouter": return "google/gemini-2.0-flash-001";
    case "openai": return "gpt-4o";
    case "gemini": return "gemini-2.0-flash";
    case "ollama": return "llama3";
    default: return "";
  }
}

export const useAIConfigStore = create<AIConfigStore>()(
  persist(
    (set, get) => ({
      config: { ...defaultConfig },
      isOpen: false,
      setProvider: (provider) =>
        set((s) => ({
          config: {
            ...s.config,
            provider,
            baseUrl: getDefaultBaseUrl(provider),
            model: getDefaultModel(provider),
          },
        })),
      setApiKey: (apiKey) =>
        set((s) => ({ config: { ...s.config, apiKey } })),
      setBaseUrl: (baseUrl) =>
        set((s) => ({ config: { ...s.config, baseUrl } })),
      setModel: (model) =>
        set((s) => ({ config: { ...s.config, model } })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "canvaspilot-aiconfig" }
  )
);
