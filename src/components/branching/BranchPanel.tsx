"use client";

import { useState } from "react";
import { useBranchStore } from "@/stores/branches";
import { useVersionStore } from "@/stores/versions";
import { useCanvasStore } from "@/stores/canvas";
import { CanvasData } from "@/types";

interface Props {
  onClose: () => void;
}

export default function BranchPanel({ onClose }: Props) {
  const { branches, activeBranchId, createBranch, switchBranch, deleteBranch } =
    useBranchStore();
  const { canvas, setCanvas } = useCanvasStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBranch(name.trim(), canvas);
    setName("");
    setMessage("Branch created");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleSwitch = (branchId: string) => {
    const restored = switchBranch(branchId);
    if (restored) {
      setCanvas(restored as CanvasData);
      useVersionStore.getState().loadVersions(
        useBranchStore.getState().getActiveBranchVersions()
      );
      setMessage("Switched branch");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Branches</h3>
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
          ✕
        </button>
      </div>

      <form onSubmit={handleCreate} className="flex gap-1 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New branch name"
          className="flex-1 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          + Branch
        </button>
      </form>

      {message && (
        <p className="text-xs text-green-600 mb-2">{message}</p>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {branches.map((b) => {
          const isActive = b.id === activeBranchId;
          return (
            <div
              key={b.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <button
                onClick={() => handleSwitch(b.id)}
                className="flex-1 text-left flex items-center gap-2"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <span className="font-medium">
                  {b.name}
                  {b.parentId === null && " (root)"}
                </span>
              </button>
              {b.parentId !== null && (
                <button
                  onClick={() => {
                    deleteBranch(b.id);
                    setMessage("Branch deleted");
                    setTimeout(() => setMessage(""), 2000);
                  }}
                  className="text-gray-300 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
