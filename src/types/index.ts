export type StartupType =
  | "saas"
  | "ecommerce"
  | "food"
  | "fintech"
  | "services"
  | "other";

export type Industry =
  | "technology"
  | "food"
  | "fashion"
  | "tourism"
  | "other";

export type Phase =
  | "idea"
  | "validation"
  | "mvp"
  | "traction"
  | "scaling";

export type Geography =
  | "local"
  | "national"
  | "european"
  | "global";

export type BusinessModel =
  | "b2b"
  | "b2c"
  | "b2b2c"
  | "subscription"
  | "transaction"
  | "freemium"
  | "commission";

export interface OnboardingData {
  startupType: StartupType;
  industry: Industry;
  phase: Phase;
  geography: Geography;
  businessModel: BusinessModel;
}

export type BlockId =
  | "customerSegments"
  | "valuePropositions"
  | "channels"
  | "customerRelationships"
  | "revenueStreams"
  | "keyResources"
  | "keyActivities"
  | "keyPartnerships"
  | "costStructure";

export interface BlockItem {
  id: string;
  text: string;
  validated: boolean;
}

export interface Block {
  id: BlockId;
  title: string;
  items: BlockItem[];
  notes: string;
}

export interface CanvasData {
  blocks: Record<BlockId, Block>;
}

export interface Version {
  id: string;
  number: number;
  timestamp: number;
  canvas: CanvasData;
}

export interface Branch {
  id: string;
  name: string;
  parentId: string | null;
  canvas: CanvasData;
  versions: Version[];
  createdAt: number;
}

export type AIProvider =
  | "openrouter"
  | "openai"
  | "gemini"
  | "ollama"
  | "custom";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export type AIInteractionType = "suggestions" | "questionnaire";

export interface BMCBlockLabels {
  id: BlockId;
  title: string;
  color: string;
}

export const BMC_BLOCKS: BMCBlockLabels[] = [
  { id: "keyPartnerships", title: "Key Partnerships", color: "purple" },
  { id: "keyActivities", title: "Key Activities", color: "indigo" },
  { id: "keyResources", title: "Key Resources", color: "violet" },
  { id: "valuePropositions", title: "Value Propositions", color: "fuchsia" },
  { id: "customerRelationships", title: "Customer Relationships", color: "purple" },
  { id: "channels", title: "Channels", color: "indigo" },
  { id: "customerSegments", title: "Customer Segments", color: "violet" },
  { id: "costStructure", title: "Cost Structure", color: "fuchsia" },
  { id: "revenueStreams", title: "Revenue Streams", color: "purple" },
];

export const DEFAULT_BLOCKS: Record<BlockId, Block> = {
  keyPartnerships: { id: "keyPartnerships", title: "Key Partnerships", items: [], notes: "" },
  keyActivities: { id: "keyActivities", title: "Key Activities", items: [], notes: "" },
  keyResources: { id: "keyResources", title: "Key Resources", items: [], notes: "" },
  valuePropositions: { id: "valuePropositions", title: "Value Propositions", items: [], notes: "" },
  customerRelationships: { id: "customerRelationships", title: "Customer Relationships", items: [], notes: "" },
  channels: { id: "channels", title: "Channels", items: [], notes: "" },
  customerSegments: { id: "customerSegments", title: "Customer Segments", items: [], notes: "" },
  costStructure: { id: "costStructure", title: "Cost Structure", items: [], notes: "" },
  revenueStreams: { id: "revenueStreams", title: "Revenue Streams", items: [], notes: "" },
};
