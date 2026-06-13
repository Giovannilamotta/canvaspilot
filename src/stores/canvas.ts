import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BlockId, BlockItem, CanvasData, DEFAULT_BLOCKS, Block } from "@/types";
import { useVersionStore } from "./versions";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

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
}

const defaultCanvas: CanvasData = {
  blocks: { ...DEFAULT_BLOCKS },
};

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
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
        useVersionStore.getState().addVersion(canvas);
      },
      reset: () => {
        useVersionStore.getState().reset();
        set({ canvas: { ...defaultCanvas } });
      },
      getBlock: (blockId) => get().canvas.blocks[blockId],
    }),
    { name: "canvaspilot-canvas" }
  )
);
