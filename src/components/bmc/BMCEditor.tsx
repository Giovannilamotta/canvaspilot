"use client";

import { useCanvasStore } from "@/stores/canvas";
import { BlockId, BMC_BLOCKS } from "@/types";
import BMCBlock from "./BMCBlock";

export default function BMCEditor() {
  const { canvas } = useCanvasStore();

  const gridOrder: BlockId[] = [
    "keyPartnerships",
    "valuePropositions",
    "customerRelationships",
    "keyActivities",
    "channels",
    "customerSegments",
    "keyResources",
    "costStructure",
    "revenueStreams",
  ];

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6 dark:bg-gray-950">
      <div
        className="grid gap-3 mx-auto"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          minHeight: "calc(100vh - 140px)",
          maxWidth: "1400px",
        }}
      >
        {gridOrder.map((id) => {
          const block = canvas.blocks[id];
          const meta = BMC_BLOCKS.find((b) => b.id === id);
          const colorClass = meta?.color ?? "purple";

          return (
            <div key={id}>
              <BMCBlock block={block} colorClass={colorClass} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
