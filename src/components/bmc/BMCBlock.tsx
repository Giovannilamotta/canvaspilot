"use client";

import { useState } from "react";
import { BlockId, Block } from "@/types";
import { useCanvasStore } from "@/stores/canvas";
import AIBlockInteractions from "@/components/ai/AIBlockInteractions";

interface Props {
  block: Block;
  colorClass: string;
}

export default function BMCBlock({ block, colorClass }: Props) {
  const { addItem, removeItem, updateItem, toggleItemValidated, setNotes } =
    useCanvasStore();
  const [newItem, setNewItem] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addItem(block.id, newItem.trim());
    setNewItem("");
  };

  const bgClass = colorClass === "purple"
    ? "bg-purple-100/60 border-purple-300 dark:bg-purple-900/20 dark:border-purple-800"
    : colorClass === "indigo"
      ? "bg-indigo-100/60 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-800"
      : colorClass === "violet"
        ? "bg-violet-100/60 border-violet-300 dark:bg-violet-900/20 dark:border-violet-800"
        : "bg-fuchsia-100/60 border-fuchsia-300 dark:bg-fuchsia-900/20 dark:border-fuchsia-800";

  const headerBg = colorClass === "purple"
    ? "bg-purple-200 dark:bg-purple-800/40"
    : colorClass === "indigo"
      ? "bg-indigo-200 dark:bg-indigo-800/40"
      : colorClass === "violet"
        ? "bg-violet-200 dark:bg-violet-800/40"
        : "bg-fuchsia-200 dark:bg-fuchsia-800/40";

  return (
    <div className={`flex flex-col rounded-xl border ${bgClass} overflow-hidden h-full shadow-sm`}>
      <div className={`px-3 py-2 ${headerBg} flex items-center justify-between`}>
        <h3 className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 leading-tight">
          {block.title}
        </h3>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">{block.items.length}</span>
      </div>

      <div className="flex-1 flex flex-col p-2 overflow-hidden">
        <ul className="flex-1 space-y-1 overflow-y-auto min-h-0">
          {block.items.map((item) => (
            <li key={item.id} className="flex items-start gap-1 group">
              <button
                onClick={() => toggleItemValidated(block.id, item.id)}
                className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-colors ${
                  item.validated
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 dark:border-gray-600 text-transparent hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                ✓
              </button>
              <input
                value={item.text}
                onChange={(e) => updateItem(block.id, item.id, e.target.value)}
                className="flex-1 bg-transparent text-[11px] text-gray-700 dark:text-gray-200 outline-none py-0.5"
              />
              <button
                onClick={() => removeItem(block.id, item.id)}
                className="opacity-0 group-hover:opacity-100 shrink-0 text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-500 transition-all px-0.5"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdd} className="mt-1">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="+ Add item"
            className="w-full bg-transparent text-[11px] text-gray-400 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none py-1"
          />
        </form>

        <div className="mt-1">
          {!editingNotes && !block.notes && (
            <button
              onClick={() => setEditingNotes(true)}
              className="text-[10px] text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              + note
            </button>
          )}
          {(editingNotes || block.notes) && (
            <textarea
              value={block.notes}
              onChange={(e) => setNotes(block.id, e.target.value)}
              onFocus={() => setEditingNotes(true)}
              onBlur={() => setEditingNotes(false)}
              placeholder="Notes..."
              rows={2}
              className="w-full bg-transparent text-[10px] text-gray-500 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none resize-none"
            />
          )}
        </div>

        <AIBlockInteractions blockId={block.id} blockTitle={block.title} />
      </div>
    </div>
  );
}
