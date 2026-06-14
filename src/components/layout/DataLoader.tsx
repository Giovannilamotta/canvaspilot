"use client";

import { useEffect, useState } from "react";
import { useCanvasStore } from "@/stores/canvas";
import { useBranchStore } from "@/stores/branches";
import { useVersionStore } from "@/stores/versions";
import { useAIConfigStore } from "@/stores/aiConfig";
import { useOnboardingStore } from "@/stores/onboarding";
import type { Branch } from "@/types";

export default function DataLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // 1. Load branches
        const brRes = await fetch("/api/branches");
        const brData = await brRes.json();
        if (brData.error) throw new Error(brData.error);

        let branches: Branch[] = brData.branches || [];

        // 2. If no branches, create main branch (via API)
        if (branches.length === 0) {
          const createRes = await fetch("/api/branches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "main",
              parentId: null,
              canvasData: { blocks: {} },
            }),
          });
          const createData = await createRes.json();
          if (createData.error) throw new Error(createData.error);
          branches = [createData.branch];
        }

        useBranchStore.getState().loadFromData(branches);

        // 3. Load versions for active branch
        const activeVersions = useBranchStore.getState().getActiveBranchVersions();
        useVersionStore.getState().loadVersions(activeVersions);

        // 4. Load canvas for active branch
        const cvRes = await fetch("/api/canvas");
        const cvData = await cvRes.json();
        if (cvData.error) throw new Error(cvData.error);
        if (cvData.canvas) {
          useCanvasStore.getState().loadFromData(cvData.canvas);
        }

        // 4. Load AI config
        const aiRes = await fetch("/api/ai-config");
        const aiData = await aiRes.json();
        if (!aiData.error && aiData.config) {
          useAIConfigStore.getState().loadFromData(aiData.config);
        }

        // 5. Load onboarding
        const onbRes = await fetch("/api/onboarding");
        const onbData = await onbRes.json();
        if (!onbData.error && onbData.onboarding) {
          useOnboardingStore.getState().loadFromData(onbData.onboarding);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-canvas-bg dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 dark:text-gray-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-canvas-bg dark:bg-gray-950">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-purple-600 hover:underline"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
