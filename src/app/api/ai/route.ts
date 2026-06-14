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
    let message = "Unknown error";
    let status = 500;

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        message = "API key non valida o scaduta. Verifica le impostazioni AI.";
        status = 401;
      } else if (error.message.includes("403")) {
        message = "Accesso negato. Verifica i permessi della API key.";
        status = 403;
      } else if (error.message.includes("404")) {
        message = "Modello o endpoint non trovato. Verifica Base URL e Model nelle impostazioni AI.";
        status = 404;
      } else if (error.message.includes("429")) {
        message = "Troppe richieste. Riprova tra qualche minuto.";
        status = 429;
      } else if (error.message.includes("fetch")) {
        message = "Impossibile connettersi al provider AI. Verifica la connessione internet e il Base URL.";
        status = 502;
      } else {
        message = error.message;
      }
    }

    return NextResponse.json({ error: message }, { status });
  }
}
