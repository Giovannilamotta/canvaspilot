import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Branch, CanvasData } from "@/types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface BranchStore {
  branches: Branch[];
  activeBranchId: string | null;
  initMainBranch: (canvas: CanvasData) => void;
  createBranch: (name: string, canvas: CanvasData) => string;
  switchBranch: (branchId: string) => CanvasData | null;
  saveToActiveBranch: (canvas: CanvasData) => void;
  deleteBranch: (branchId: string) => void;
  reset: () => void;
}

export const useBranchStore = create<BranchStore>()(
  persist(
    (set, get) => ({
      branches: [],
      activeBranchId: null,
      initMainBranch: (canvas) => {
        if (get().branches.length > 0) return;
        const branch: Branch = {
          id: generateId(),
          name: "main",
          parentId: null,
          canvas: JSON.parse(JSON.stringify(canvas)),
          versions: [],
          createdAt: Date.now(),
        };
        set({ branches: [branch], activeBranchId: branch.id });
      },
      createBranch: (name, canvas) => {
        const branch: Branch = {
          id: generateId(),
          name,
          parentId: get().activeBranchId,
          canvas: JSON.parse(JSON.stringify(canvas)),
          versions: [],
          createdAt: Date.now(),
        };
        set((s) => ({
          branches: [...s.branches, branch],
          activeBranchId: branch.id,
        }));
        return branch.id;
      },
      switchBranch: (branchId) => {
        const branch = get().branches.find((b) => b.id === branchId);
        if (!branch) return null;
        set({ activeBranchId: branchId });
        return JSON.parse(JSON.stringify(branch.canvas));
      },
      saveToActiveBranch: (canvas) =>
        set((s) => ({
          branches: s.branches.map((b) =>
            b.id === s.activeBranchId
              ? { ...b, canvas: JSON.parse(JSON.stringify(canvas)) }
              : b
          ),
        })),
      deleteBranch: (branchId) =>
        set((s) => {
          const remaining = s.branches.filter((b) => b.id !== branchId);
          const main = remaining.find((b) => b.parentId === null);
          return {
            branches: remaining,
            activeBranchId: s.activeBranchId === branchId
              ? main?.id ?? remaining[0]?.id ?? null
              : s.activeBranchId,
          };
        }),
      reset: () => set({ branches: [], activeBranchId: null }),
    }),
    { name: "canvaspilot-branches" }
  )
);
