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
    ? "bg-purple-50 border-purple-200"
    : colorClass === "indigo"
      ? "bg-indigo-50 border-indigo-200"
      : colorClass === "violet"
        ? "bg-violet-50 border-violet-200"
        : "bg-fuchsia-50 border-fuchsia-200";

  const headerBg = colorClass === "purple"
    ? "bg-purple-100"
    : colorClass === "indigo"
      ? "bg-indigo-100"
      : colorClass === "violet"
        ? "bg-violet-100"
        : "bg-fuchsia-100";

  return (
    <div className={`flex flex-col rounded-xl border ${bgClass} overflow-hidden h-full`}>
      <div className={`px-3 py-2 ${headerBg} flex items-center justify-between`}>
        <h3 className="text-[11px] font-semibold text-gray-800 leading-tight">
          {block.title}
        </h3>
        <span className="text-[10px] text-gray-500">{block.items.length}</span>
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
                    : "border-gray-300 text-transparent hover:border-gray-400"
                }`}
              >
                ✓
              </button>
              <input
                value={item.text}
                onChange={(e) => updateItem(block.id, item.id, e.target.value)}
                className="flex-1 bg-transparent text-[11px] text-gray-700 outline-none py-0.5"
              />
              <button
                onClick={() => removeItem(block.id, item.id)}
                className="opacity-0 group-hover:opacity-100 shrink-0 text-[10px] text-gray-400 hover:text-red-500 transition-all px-0.5"
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
            className="w-full bg-transparent text-[11px] text-gray-400 placeholder:text-gray-300 outline-none py-1"
          />
        </form>

        <div className="mt-1">
          {!editingNotes && !block.notes && (
            <button
              onClick={() => setEditingNotes(true)}
              className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors"
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
              className="w-full bg-transparent text-[10px] text-gray-500 placeholder:text-gray-300 outline-none resize-none"
            />
          )}
        </div>

        <AIBlockInteractions blockId={block.id} blockTitle={block.title} />
      </div>
    </div>
  );
}
