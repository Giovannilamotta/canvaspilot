import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, config } = body;

    if (!messages || !config) {
      return NextResponse.json(
        { error: "Missing messages or config" },
        { status: 400 }
      );
    }

    const result = await callAI({ messages, config });
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("401")) {
      return NextResponse.json(
        { error: "API key non valida o scaduta. Verifica le impostazioni AI." },
        { status: 401 }
      );
    }
    if (message.includes("404")) {
      return NextResponse.json(
        { error: "Modello AI non trovato. Verifica il nome del modello nelle impostazioni." },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
