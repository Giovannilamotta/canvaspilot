import { CanvasData, AIInteractionType, BlockId } from "@/types";

export function calculateValidityScore(canvas: CanvasData): number {
  let totalItems = 0;
  let validatedItems = 0;
  let filledBlocks = 0;
  let totalNoteChars = 0;

  const blockIds = Object.keys(canvas.blocks) as BlockId[];

  for (const id of blockIds) {
    const block = canvas.blocks[id];
    totalItems += block.items.length;
    validatedItems += block.items.filter((i) => i.validated).length;
    if (block.items.length > 0) filledBlocks++;
    totalNoteChars += block.notes.length;
  }

  const itemsScore = totalItems > 0 ? (filledBlocks / 9) * 40 : 0;
  const validationScore = totalItems > 0 ? (validatedItems / totalItems) * 35 : 0;
  const notesScore = Math.min(totalNoteChars / 500, 1) * 25;

  return Math.round(Math.min(itemsScore + validationScore + notesScore, 100));
}

export function getScoreColor(score: number): "green" | "orange" | "red" {
  if (score >= 60) return "green";
  if (score >= 30) return "orange";
  return "red";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 30) return "Needs Work";
  return "Minimal";
}

export function buildBlockContext(blockId: BlockId, canvas: CanvasData): string {
  const block = canvas.blocks[blockId];
  const items = block.items.map((i) => `- ${i.text}${i.validated ? " [validated]" : ""}`).join("\n");
  return `${block.title}:\n${items || "(empty)"}\nNotes: ${block.notes || "(none)"}`;
}

export function buildCanvasContext(canvas: CanvasData): string {
  const blockIds = Object.keys(canvas.blocks) as BlockId[];
  return blockIds
    .map((id) => buildBlockContext(id, canvas))
    .join("\n\n---\n\n");
}
