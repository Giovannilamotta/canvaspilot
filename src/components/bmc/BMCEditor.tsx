"use client";

import { useCanvasStore } from "@/stores/canvas";
import { BlockId, BMC_BLOCKS } from "@/types";
import BMCBlock from "./BMCBlock";

export default function BMCEditor() {
  const { canvas } = useCanvasStore();

  const gridOrder: BlockId[] = [
    "keyPartnerships",
    "keyActivities",
    "valuePropositions",
    "customerRelationships",
    "customerSegments",
    "keyResources",
    "channels",
    "costStructure",
    "revenueStreams",
  ];

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div
        className="grid gap-3 mx-auto"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          minHeight: "calc(100vh - 140px)",
          maxWidth: "1600px",
        }}
      >
        {gridOrder.map((id, i) => {
          const block = canvas.blocks[id];
          const meta = BMC_BLOCKS.find((b) => b.id === id);
          const colorClass = meta?.color ?? "purple";

          let row = 1;
          let col = 3;
          let spanCol = 1;
          let spanRow = 1;

          switch (id) {
            case "keyPartnerships": row = 1; col = 1; break;
            case "keyActivities": row = 2; col = 1; break;
            case "keyResources": row = 3; col = 1; break;
            case "valuePropositions": row = 1; col = 2; spanCol = 2; spanRow = 3; break;
            case "customerRelationships": row = 1; col = 4; break;
            case "customerSegments": row = 2; col = 4; spanRow = 2; break;
            case "channels": row = 3; col = 4; break;
            case "costStructure": row = 1; col = 5; spanRow = 2; break;
            case "revenueStreams": row = 3; col = 5; break;
          }

          return (
            <div
              key={id}
              style={{
                gridColumn: `${col} / span ${spanCol}`,
                gridRow: `${row} / span ${spanRow}`,
              }}
            >
              <BMCBlock block={block} colorClass={colorClass} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
