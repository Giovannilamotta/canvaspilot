import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OnboardingData, StartupType, Industry, Phase, Geography, BusinessModel } from "@/types";

interface OnboardingStore {
  data: OnboardingData;
  completed: boolean;
  isOpen: boolean;
  setField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  complete: () => void;
  reset: () => void;
  open: () => void;
  close: () => void;
}

const defaultData: OnboardingData = {
  startupType: "saas",
  industry: "technology",
  phase: "idea",
  geography: "local",
  businessModel: "b2b",
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      data: { ...defaultData },
      completed: false,
      isOpen: true,
      setField: (field, value) =>
        set((s) => ({ data: { ...s.data, [field]: value } })),
      complete: () => set({ completed: true, isOpen: false }),
      reset: () => set({ data: { ...defaultData }, completed: false, isOpen: true }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "canvaspilot-onboarding" }
  )
);
