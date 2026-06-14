"use client";

import { useState } from "react";
import { useAIConfigStore } from "@/stores/aiConfig";
import { AIProvider } from "@/types";

const providers: { value: AIProvider; label: string }[] = [
  { value: "openrouter", label: "OpenRouter" },
  { value: "openai", label: "OpenAI" },
  { value: "gemini", label: "Gemini" },
  { value: "ollama", label: "Ollama" },
  { value: "custom", label: "Custom" },
];

export default function AISettings() {
  const { config, isOpen, setProvider, setApiKey, setBaseUrl, setModel, close } =
    useAIConfigStore();
  const [saved, setSaved] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [connectionError, setConnectionError] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTimeout(close, 800);
  };

  const testConnection = async () => {
    setConnectionStatus("testing");
    setConnectionError("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "ping" }],
          config,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      setConnectionStatus("success");
      setTimeout(() => setConnectionStatus("idle"), 3000);
    } catch (e: unknown) {
      setConnectionStatus("error");
      setConnectionError(e instanceof Error ? e.message : "Connessione fallita");
    }
  };

  const handleTestConnection = async () => {
    if (!config.apiKey) return;
    setConnectionStatus("testing");
    setConnectionError("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "ping" }],
          config,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setConnectionStatus("error");
        setConnectionError(data.error);
      } else {
        setConnectionStatus("success");
      }
    } catch {
      setConnectionStatus("error");
      setConnectionError("Impossibile connettersi al server");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-purple-900">AI Settings</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Provider
            </label>
            <div className="grid grid-cols-5 gap-1">
              {providers.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setProvider(p.value);
                    setConnectionStatus("idle");
                    setConnectionError("");
                  }}
                  className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                    config.provider === p.value
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setConnectionStatus("idle");
                setConnectionError("");
              }}
              placeholder="sk-..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                setConnectionStatus("idle");
                setConnectionError("");
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Model
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => {
                setModel(e.target.value);
                setConnectionStatus("idle");
                setConnectionError("");
              }}
              placeholder="gpt-4o"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
            />
          </div>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={!config.apiKey || connectionStatus === "testing"}
          className={`mt-3 w-full py-2 rounded-lg text-xs font-medium border transition-all ${
            connectionStatus === "success"
              ? "bg-green-50 border-green-300 text-green-700"
              : connectionStatus === "error"
                ? "bg-red-50 border-red-300 text-red-700"
                : "bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700 disabled:opacity-40"
          }`}
        >
          {connectionStatus === "testing" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Test in corso...
            </span>
          ) : connectionStatus === "success" ? (
            "✓ Connessione OK"
          ) : connectionStatus === "error" ? (
            `✗ ${connectionError || "Connessione fallita"}`
          ) : (
            "⚡ Test Connessione"
          )}
        </button>

        <div className="flex gap-2 mt-4">
          <button
            onClick={testConnection}
            disabled={connectionStatus === "testing" || !config.apiKey}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
              connectionStatus === "success"
                ? "bg-green-50 border-green-300 text-green-700"
                : connectionStatus === "error"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40"
            }`}
          >
            {connectionStatus === "testing"
              ? "Testing..."
              : connectionStatus === "success"
                ? "✓ Connessione OK"
                : connectionStatus === "error"
                  ? "✗ Connessione fallita"
                  : "Test Connection"}
          </button>
        </div>
        {connectionStatus === "error" && connectionError && (
          <p className="mt-2 text-xs text-red-500">{connectionError}</p>
        )}
        <button
          onClick={handleSave}
          disabled={!config.apiKey}
          className={`mt-3 w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40"
          }`}
        >
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}
