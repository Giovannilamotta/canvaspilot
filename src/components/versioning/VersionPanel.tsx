"use client";

import { useState } from "react";
import { useVersionStore } from "@/stores/versions";
import { useCanvasStore } from "@/stores/canvas";
import { CanvasData } from "@/types";

interface Props {
  onClose: () => void;
}

export default function VersionPanel({ onClose }: Props) {
  const { versions, currentVersionIndex, goToVersion } = useVersionStore();
  const { setCanvas, canvas, saveVersion } = useCanvasStore();
  const [message, setMessage] = useState("");

  const handleRestore = (index: number) => {
    const restored = goToVersion(index);
    if (restored) {
      setCanvas(restored as CanvasData);
      setMessage("Version restored");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleSave = () => {
    saveVersion();
    setMessage("Version saved");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Versions</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
          ✕
        </button>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 mb-3 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Save Current Version
      </button>

      {message && (
        <p className="text-xs text-green-600 mb-2">{message}</p>
      )}

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {versions.length === 0 && (
          <p className="text-xs text-gray-400 py-4 text-center">No versions yet</p>
        )}
        {[...versions].reverse().map((v, i) => {
          const actualIndex = versions.length - 1 - i;
          const isActive = actualIndex === currentVersionIndex;
          return (
            <button
              key={v.id}
              onClick={() => handleRestore(actualIndex)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <div className="font-medium">v{v.number}</div>
              <div className="text-[10px] text-gray-400">
                {new Date(v.timestamp).toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
