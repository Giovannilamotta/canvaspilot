import { create } from "zustand";
import { BlockId, BlockItem, CanvasData, DEFAULT_BLOCKS, Block } from "@/types";
import { useVersionStore } from "./versions";
import { useBranchStore } from "./branches";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let skipNextSave = false;

interface CanvasStore {
  canvas: CanvasData;
  setCanvas: (canvas: CanvasData) => void;
  addItem: (blockId: BlockId, text: string) => void;
  removeItem: (blockId: BlockId, itemId: string) => void;
  updateItem: (blockId: BlockId, itemId: string, text: string) => void;
  toggleItemValidated: (blockId: BlockId, itemId: string) => void;
  setNotes: (blockId: BlockId, notes: string) => void;
  saveVersion: () => void;
  reset: () => void;
  getBlock: (blockId: BlockId) => Block;
  loadFromData: (data: CanvasData) => void;
  saveToServer: () => Promise<void>;
  scheduleSave: () => void;
}

const defaultCanvas: CanvasData = {
  blocks: { ...DEFAULT_BLOCKS },
};

function saveCanvasToServer(canvas: CanvasData) {
  const activeBranchId = useBranchStore.getState().activeBranchId;
  return fetch("/api/canvas", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ canvas, branchId: activeBranchId }),
  });
}

export const useCanvasStore = create<CanvasStore>()((set, get) => ({
  canvas: { ...defaultCanvas },
  setCanvas: (canvas) => set({ canvas }),
  addItem: (blockId, text) =>
    set((s) => {
      const item: BlockItem = { id: generateId(), text, validated: false };
      const block = s.canvas.blocks[blockId];
      return {
        canvas: {
          ...s.canvas,
          blocks: {
            ...s.canvas.blocks,
            [blockId]: { ...block, items: [...block.items, item] },
          },
        },
      };
    }),
  removeItem: (blockId, itemId) =>
    set((s) => {
      const block = s.canvas.blocks[blockId];
      return {
        canvas: {
          ...s.canvas,
          blocks: {
            ...s.canvas.blocks,
            [blockId]: { ...block, items: block.items.filter((i) => i.id !== itemId) },
          },
        },
      };
    }),
  updateItem: (blockId, itemId, text) =>
    set((s) => {
      const block = s.canvas.blocks[blockId];
      return {
        canvas: {
          ...s.canvas,
          blocks: {
            ...s.canvas.blocks,
            [blockId]: {
              ...block,
              items: block.items.map((i) => (i.id === itemId ? { ...i, text } : i)),
            },
          },
        },
      };
    }),
  toggleItemValidated: (blockId, itemId) =>
    set((s) => {
      const block = s.canvas.blocks[blockId];
      return {
        canvas: {
          ...s.canvas,
          blocks: {
            ...s.canvas.blocks,
            [blockId]: {
              ...block,
              items: block.items.map((i) =>
                i.id === itemId ? { ...i, validated: !i.validated } : i
              ),
            },
          },
        },
      };
    }),
  setNotes: (blockId, notes) =>
    set((s) => {
      const block = s.canvas.blocks[blockId];
      return {
        canvas: {
          ...s.canvas,
          blocks: {
            ...s.canvas.blocks,
            [blockId]: { ...block, notes },
          },
        },
      };
    }),
  saveVersion: () => {
    const { canvas } = get();
    useBranchStore.getState().addVersionToActiveBranch(canvas);
    useVersionStore.getState().loadVersions(
      useBranchStore.getState().getActiveBranchVersions()
    );
    const activeBranchId = useBranchStore.getState().activeBranchId;
    if (activeBranchId) {
      fetch("/api/branches/" + activeBranchId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versions: useBranchStore.getState().getActiveBranchVersions(),
        }),
      });
    }
  },
  reset: () => {
    useVersionStore.getState().reset();
    useBranchStore.getState().resetActiveBranchVersions();
    set({ canvas: { ...defaultCanvas } });
    saveCanvasToServer({ ...defaultCanvas });
  },
  getBlock: (blockId) => get().canvas.blocks[blockId],
  loadFromData: (data) => {
    skipNextSave = true;
    set({ canvas: data || { ...defaultCanvas } });
  },
  saveToServer: async () => {
    const { canvas } = get();
    await saveCanvasToServer(canvas);
  },
  scheduleSave: () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      get().saveToServer();
    }, 2000);
  },
}));

useCanvasStore.subscribe((state, prevState) => {
  if (state.canvas === prevState.canvas) return;
  if (skipNextSave) {
    skipNextSave = false;
    return;
  }
  useCanvasStore.getState().scheduleSave();
});
