import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Version, CanvasData } from "@/types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface VersionStore {
  versions: Version[];
  currentVersionIndex: number;
  addVersion: (canvas: CanvasData) => void;
  goToVersion: (index: number) => CanvasData | null;
  reset: () => void;
}

export const useVersionStore = create<VersionStore>()(
  persist(
    (set, get) => ({
      versions: [],
      currentVersionIndex: -1,
      addVersion: (canvas) =>
        set((s) => {
          const newVersion: Version = {
            id: generateId(),
            number: s.versions.length + 1,
            timestamp: Date.now(),
            canvas: JSON.parse(JSON.stringify(canvas)),
          };
          return {
            versions: [...s.versions, newVersion],
            currentVersionIndex: s.versions.length,
          };
        }),
      goToVersion: (index) => {
        const { versions } = get();
        if (index < 0 || index >= versions.length) return null;
        set({ currentVersionIndex: index });
        return JSON.parse(JSON.stringify(versions[index].canvas));
      },
      reset: () => set({ versions: [], currentVersionIndex: -1 }),
    }),
    { name: "canvaspilot-versions" }
  )
);
