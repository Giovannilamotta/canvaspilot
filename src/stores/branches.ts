import { create } from "zustand";
import { Branch, CanvasData, Version } from "@/types";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

async function syncBranchToServer(branchId: string, data: Record<string, unknown>) {
  await fetch("/api/branches/" + branchId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

interface BranchStore {
  branches: Branch[];
  activeBranchId: string | null;
  loadFromData: (branches: Branch[]) => void;
  initMainBranch: (canvas: CanvasData) => void;
  createBranch: (name: string, canvas: CanvasData) => string;
  switchBranch: (branchId: string) => CanvasData | null;
  saveToActiveBranch: (canvas: CanvasData) => void;
  deleteBranch: (branchId: string) => void;
  addVersionToActiveBranch: (canvas: CanvasData) => Version;
  resetActiveBranchVersions: () => void;
  getActiveBranchVersions: () => Version[];
  reset: () => void;
}

export const useBranchStore = create<BranchStore>()((set, get) => ({
  branches: [],
  activeBranchId: null,
  loadFromData: (branches) => {
    const active = branches.find((b) => b.is_active);
    set({
      branches,
      activeBranchId: active?.id ?? branches[0]?.id ?? null,
    });
  },
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
    const prevActive = get().activeBranchId;

    const branch: Branch = {
      id: generateId(),
      name,
      parentId: get().activeBranchId,
      canvas: JSON.parse(JSON.stringify(canvas)),
      versions: [],
      createdAt: Date.now(),
    };
    set((s) => ({
      branches: s.branches.map((b) => ({ ...b, is_active: false })),
    }));
    set((s) => ({
      branches: [...s.branches, { ...branch, is_active: true }],
      activeBranchId: branch.id,
    }));

    fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        parentId: prevActive,
        canvasData: canvas,
      }),
    }).catch(() => {});

    return branch.id;
  },
  switchBranch: (branchId) => {
    const branch = get().branches.find((b) => b.id === branchId);
    if (!branch) return null;

    set((s) => ({
      branches: s.branches.map((b) => ({
        ...b,
        is_active: b.id === branchId,
      })),
      activeBranchId: branchId,
    }));

    syncBranchToServer(branchId, { is_active: true }).catch(() => {});

    return JSON.parse(JSON.stringify(branch.canvas));
  },
  saveToActiveBranch: (canvas) => {
    const activeId = get().activeBranchId;
    set((s) => ({
      branches: s.branches.map((b) =>
        b.id === activeId
          ? { ...b, canvas: JSON.parse(JSON.stringify(canvas)) }
          : b
      ),
    }));
    if (activeId) {
      syncBranchToServer(activeId, { canvas_data: canvas }).catch(() => {});
    }
  },
  deleteBranch: (branchId) =>
    set((s) => {
      const remaining = s.branches.filter((b) => b.id !== branchId);
      const main = remaining.find((b) => b.parentId === null);
      const nextActive = s.activeBranchId === branchId
        ? main?.id ?? remaining[0]?.id ?? null
        : s.activeBranchId;

      if (nextActive && nextActive !== s.activeBranchId) {
        remaining.forEach((b) => {
          if (b.id === nextActive) b.is_active = true;
        });
        syncBranchToServer(nextActive, { is_active: true }).catch(() => {});
      }

      fetch("/api/branches/" + branchId, { method: "DELETE" }).catch(() => {});

      return {
        branches: remaining,
        activeBranchId: nextActive,
      };
    }),
  addVersionToActiveBranch: (canvas) => {
    const newVersion: Version = {
      id: generateId(),
      number: 0,
      timestamp: Date.now(),
      canvas: JSON.parse(JSON.stringify(canvas)),
    };
    let activeId = "";
    set((s) => ({
      branches: s.branches.map((b) => {
        if (b.id !== s.activeBranchId) return b;
        activeId = b.id;
        newVersion.number = b.versions.length + 1;
        return { ...b, versions: [...b.versions, newVersion] };
      }),
    }));
    if (activeId) {
      const versions = get().getActiveBranchVersions();
      syncBranchToServer(activeId, { versions }).catch(() => {});
    }
    return newVersion;
  },
  resetActiveBranchVersions: () =>
    set((s) => ({
      branches: s.branches.map((b) =>
        b.id === s.activeBranchId ? { ...b, versions: [] } : b
      ),
    })),
  getActiveBranchVersions: () => {
    const { branches, activeBranchId } = get();
    const branch = branches.find((b) => b.id === activeBranchId);
    return branch?.versions ?? [];
  },
  reset: () => set({ branches: [], activeBranchId: null }),
}));
