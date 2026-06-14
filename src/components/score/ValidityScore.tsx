"use client";

import { useMemo } from "react";
import { useCanvasStore } from "@/stores/canvas";
import { calculateValidityScore, getScoreColor, getScoreLabel } from "@/lib/score";

export default function ValidityScore() {
  const { canvas } = useCanvasStore();

  const score = useMemo(() => calculateValidityScore(canvas), [canvas]);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const barColor =
    color === "green"
      ? "bg-green-500"
      : color === "orange"
        ? "bg-orange-500"
        : "bg-red-500";

  const textColor =
    color === "green"
      ? "text-green-700"
      : color === "orange"
        ? "text-orange-700"
        : "text-red-700";

  const bgColor =
    color === "green"
      ? "bg-green-50"
      : color === "orange"
        ? "bg-orange-50"
        : "bg-red-50";

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Validity</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}%</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${bgColor} ${textColor}`}>
          {label}
        </span>
      </div>
      <div className="flex-1 max-w-40 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
