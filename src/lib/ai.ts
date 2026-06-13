import { AIConfig } from "@/types";

interface AIRequest {
  messages: { role: string; content: string }[];
  config: AIConfig;
  stream?: boolean;
}

export async function callAI({ messages, config, stream }: AIRequest): Promise<string> {
  if (config.provider === "gemini") {
    return callGemini({ messages, config });
  }

  if (config.provider === "ollama") {
    return callOllama({ messages, config, stream });
  }

  return callOpenAICompatible({ messages, config, stream });
}

async function callOpenAICompatible({ messages, config, stream }: AIRequest): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callGemini({ messages, config }: AIRequest): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callOllama({ messages, config }: AIRequest): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.message?.content ?? "";
}
