import { create } from "zustand";
import { Version, CanvasData } from "@/types";

interface VersionStore {
  versions: Version[];
  currentVersionIndex: number;
  addVersion: (canvas: CanvasData) => void;
  goToVersion: (index: number) => CanvasData | null;
  loadVersions: (versions: Version[]) => void;
  reset: () => void;
}

export const useVersionStore = create<VersionStore>()((set, get) => ({
  versions: [],
  currentVersionIndex: -1,
  addVersion: (canvas) =>
    set((s) => ({
      versions: [
        ...s.versions,
        {
          id: Math.random().toString(36).slice(2, 10),
          number: s.versions.length + 1,
          timestamp: Date.now(),
          canvas: JSON.parse(JSON.stringify(canvas)),
        },
      ],
      currentVersionIndex: s.versions.length,
    })),
  goToVersion: (index) => {
    const { versions } = get();
    if (index < 0 || index >= versions.length) return null;
    set({ currentVersionIndex: index });
    return JSON.parse(JSON.stringify(versions[index].canvas));
  },
  loadVersions: (versions) =>
    set({ versions, currentVersionIndex: versions.length > 0 ? versions.length - 1 : -1 }),
  reset: () => set({ versions: [], currentVersionIndex: -1 }),
}));
