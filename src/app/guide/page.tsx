"use client";

import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-bold text-purple-600">
            CanvasPilot
          </Link>
          <span className="text-xs text-gray-400 dark:text-gray-500">Guida</span>
        </div>
        <Link
          href="/"
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors"
        >
          ← Torna al Canvas
        </Link>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-6 space-y-12">
        {/* Intro */}
        <section>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Guida di CanvasPilot
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            CanvasPilot è uno strumento interattivo per creare, analizzare e iterare il{' '}
            <strong>Business Model Canvas</strong> con il supporto dell&apos;intelligenza artificiale.
            Di seguito trovi la spiegazione di tutte le funzionalità.
          </p>
        </section>

        {/* Setup Wizard */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🧭 Setup Wizard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            Al primo accesso ti viene chiesto di configurare il tuo progetto rispondendo a 6 domande: tipo di
            startup, settore, fase, geografia, modello di business e una descrizione libera della tua idea.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Queste informazioni vengono usate dall&apos;AI per contestualizzare i suggerimenti e rendere le
            analisi più pertinenti. Puoi sempre riaprire il wizard cliccando su 🧭 nella sidebar sinistra.
          </p>
        </section>

        {/* BMC Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            📋 Business Model Canvas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            Il canvas è composto da <strong>9 blocchi</strong> disposti in una griglia 3×3:
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              "Key Partnerships",
              "Value Propositions",
              "Customer Rel.",
              "Key Activities",
              "Channels",
              "Customer Segments",
              "Key Resources",
              "Cost Structure",
              "Revenue Streams",
            ].map((b) => (
              <div
                key={b}
                className="text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2 text-center"
              >
                {b}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Ogni blocco contiene <strong>item</strong> (voci di elenco) che puoi aggiungere, modificare o
            rimuovere. Ogni item ha una <strong>checkbox di validazione</strong> (✓) da spuntare quando
            confermato. Puoi anche aggiungere <strong>note</strong> testuali per contesto aggiuntivo.
          </p>
        </section>

        {/* AI Features */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🤖 Funzionalità AI
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Compila BMC
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Il pulsante viola &quot;Compila BMC&quot; nell&apos;header usa l&apos;AI per popolare
                automaticamente tutti i 9 blocchi del canvas basandosi sulla tua idea di business.
                Se il canvas ha già contenuti, ti chiede conferma prima di sovrascrivere.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Suggerimenti 💡
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                In fondo a ogni blocco trovi i pulsanti 💡 e ❓. Cliccando 💡, l&apos;AI genera 2-3
                suggerimenti concreti per quel blocco. I risultati appaiono nel pannello destro
                (tab <strong>AI</strong>) con un pulsante 「＋ Aggiungi」 per inserire direttamente
                il suggerimento nel blocco.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Domande ❓
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Cliccando ❓, l&apos;AI formula 3 domande critiche per stimolare la riflessione
                strategica. Le domande appaiono nel pannello AI in sola lettura: leggile mentre
                lavori sul canvas per mettere alla prova le tue assunzioni.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Analisi Canvas 🔍
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Il pulsante &quot;Analisi Canvas&quot; nell&apos;header esegue un&apos;analisi completa:
                mismatch tra blocchi, assunzioni non validate, opportunità trascurate e
                raccomandazioni prioritarie.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Configurazione AI ⚙️
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Clicca ⚙️ nella sidebar per configurare il provider AI. Supportiamo OpenRouter,
                OpenAI, Gemini, Ollama e provider custom. Inserisci la tua API key (viene salvata
                in modo sicuro nel database) e usa &quot;Test Connection&quot; per verificare che
                funzioni. Nota: usi sempre la TUA API key — CanvasPilot non fornisce chiavi AI.
              </p>
            </div>
          </div>
        </section>

        {/* Versioni e Branch */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            💾 Versioni e Branch
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Versioni
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Usa il pulsante 💾 nella sidebar o &quot;Save Current Version&quot; nel pannello Versioni
                per creare uno snapshot del canvas. Puoi ripristinare qualsiasi versione precedente
                con un click. Ogni branch ha le sue versioni indipendenti.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Branch
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                I branch ti permettono di esplorare scenari alternativi in parallelo. Ad esempio,
                puoi creare un branch &quot;Modello B2C&quot; per testare una variante del tuo business
                model senza perdere il lavoro sul branch principale. Puoi creare, cambiare ed
                eliminare branch dal pannello Branches nel lato destro.
              </p>
            </div>
          </div>
        </section>

        {/* Pannello Destro */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            📊 Pannello Destro
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            Il pannello destro ha 5 tab:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 leading-relaxed">
            <li><strong>Versions</strong> — Gestisci gli snapshot del canvas</li>
            <li><strong>Branches</strong> — Crea e gestisci scenari paralleli</li>
            <li><strong>Idea</strong> — Visualizza la tua idea di business e compila il canvas</li>
            <li><strong>AI</strong> — Risultati di suggerimenti e domande con pulsanti di inserimento</li>
            <li><strong>Analysis</strong> — Analisi completa del canvas</li>
          </ul>
        </section>

        {/* Validity Score */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            📈 Validity Score
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            La barra sotto l&apos;header mostra un punteggio da 0 a 100% basato su: blocchi riempiti
            (40%), item validati con ✓ (35%) e note compilate (25%). Il colore indica il livello:
            verde (≥60% Good), arancione (30-59% Needs Work), rosso (&lt;30% Minimal).
          </p>
        </section>

        {/* Dark Mode */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🌙 Dark Mode
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Clicca 🌙/☀️ in fondo alla sidebar per passare dalla modalità chiara a quella scura.
            La preferenza viene salvata e ripristinata al prossimo accesso.
          </p>
        </section>

        {/* Reset */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🗑️ Reset Canvas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Il pulsante 🗑️ in fondo alla sidebar cancella tutti i dati del canvas e le versioni
            del branch attivo. Compare una finestra di conferma prima di procedere. I branch
            non vengono toccati.
          </p>
        </section>

        {/* Consigli */}
        <section className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-400 mb-2">
            💡 Consigli per iniziare
          </h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
            <li>Completa il wizard descrivendo la tua idea di business</li>
            <li>Configura il provider AI nelle impostazioni (⚙️)</li>
            <li>Clicca &quot;Compila BMC&quot; per popolare automaticamente il canvas</li>
            <li>Raffina ogni blocco con i suggerimenti AI (💡) o manualmente</li>
            <li>Esegui l&apos;analisi completa per identificare punti deboli</li>
            <li>Salva versioni intermedie e crea branch per scenari alternativi</li>
          </ol>
        </section>

      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          CanvasPilot — Business Model Canvas Builder
        </p>
      </footer>
    </div>
  );
}
