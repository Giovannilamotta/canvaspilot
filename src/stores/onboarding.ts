import { create } from "zustand";
import { OnboardingData } from "@/types";

interface OnboardingStore {
  data: OnboardingData;
  completed: boolean;
  isOpen: boolean;
  setField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  complete: () => void;
  reset: () => void;
  loadFromData: (data: { data: OnboardingData; completed: boolean }) => void;
  saveToServer: () => Promise<void>;
  open: () => void;
  close: () => void;
}

const defaultData: OnboardingData = {
  startupType: "saas",
  industry: "technology",
  phase: "idea",
  geography: "local",
  businessModel: "b2b",
  businessIdea: "",
};

export const useOnboardingStore = create<OnboardingStore>()((set, get) => ({
  data: { ...defaultData },
  completed: false,
  isOpen: true,
  setField: (field, value) =>
    set((s) => ({ data: { ...s.data, [field]: value } })),
  complete: () => {
    set({ completed: true, isOpen: false });
    get().saveToServer();
  },
  reset: () => {
    set({ data: { ...defaultData }, completed: false, isOpen: true });
    get().saveToServer();
  },
  loadFromData: (onboarding) => {
    set({
      data: onboarding.data || { ...defaultData },
      completed: onboarding.completed || false,
      isOpen: !onboarding.completed,
    });
  },
  saveToServer: async () => {
    const { data, completed } = get();
    await fetch("/api/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, completed }),
    });
  },
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
