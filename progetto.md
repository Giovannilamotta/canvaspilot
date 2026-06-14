# CanvasPilot — Documento di Progetto

## 1. Panoramica

**CanvasPilot** è un'applicazione web interattiva per la creazione e l'analisi di **Business Model Canvas** (BMC). Offre supporto AI multi-provider per la compilazione automatica, suggerimenti strategici e analisi, con strumenti di versioning e branching per esplorare scenari alternativi.

- **URL di produzione**: Vercel
- **Repository**: github.com/Giovannilamotta/canvaspilot
- **Linguaggio interfaccia**: Italiano (wizard, prompt AI, messaggi)

---

## 2. Stack Tecnologico

| Area | Tecnologia | Versione |
|------|-----------|----------|
| Framework | Next.js (App Router) | 16.2.7 |
| UI Library | React | 19.2.4 |
| Linguaggio | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| State Management | Zustand | 5.0.14 |
| Icone | Lucide React | 1.17.0 |
| AI Provider | OpenRouter, OpenAI, Gemini, Ollama, Custom | — |
| Persistenza | localStorage (Zustand persist) | — |
| Deploy | Vercel | — |

---

## 3. Architettura del Progetto

```
canvaspilot/
├── src/
│   ├── app/
│   │   ├── api/ai/route.ts         # Endpoint proxy per chiamate AI
│   │   ├── globals.css              # Tailwind + theme custom (palette purple)
│   │   ├── layout.tsx               # Root layout (font Geist, metadata)
│   │   └── page.tsx                 # Entry point → AppLayout
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIAnalysis.tsx       # Analisi completa del canvas
│   │   │   ├── AIBlockInteractions.tsx  # Suggerimenti/domande per blocco
│   │   │   ├── AIFillCanvas.tsx     # Compilazione automatica BMC da idea
│   │   │   └── AISettings.tsx       # Configurazione provider AI + test connessione
│   │   ├── bmc/
│   │   │   ├── BMCBlock.tsx         # Singolo blocco del canvas (item, note, validazione)
│   │   │   └── BMCEditor.tsx        # Griglia 5×3 del BMC
│   │   ├── branching/
│   │   │   └── BranchPanel.tsx      # Creazione e gestione branch paralleli
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Layout principale (header, sidebar, griglia, pannello DX)
│   │   │   └── RightPanel.tsx       # Pannello destro: Versioni, Branch, Idea, Analisi
│   │   ├── score/
│   │   │   └── ValidityScore.tsx    # Barra punteggio validità canvas
│   │   ├── sidebar/
│   │   │   └── Sidebar.tsx          # Barra laterale icone (wizard, nuovo, salva, AI settings)
│   │   ├── versioning/
│   │   │   └── VersionPanel.tsx     # Snapshot e restore versioni canvas
│   │   └── wizard/
│   │       └── StartupWizard.tsx    # Wizard onboarding 6 step
│   ├── lib/
│   │   ├── ai.ts                    # Client AI multi-provider (OpenAI-compat, Gemini, Ollama)
│   │   └── score.ts                 # Calcolo validity score e contesti per prompt AI
│   ├── stores/
│   │   ├── aiConfig.ts              # Configurazione provider AI (persistito)
│   │   ├── branches.ts              # Gestione branch canvas (persistito)
│   │   ├── canvas.ts                # Stato principale BMC (persistito)
│   │   ├── onboarding.ts            # Dati wizard onboarding (persistito)
│   │   └── versions.ts              # Versioning snapshot (persistito)
│   └── types/
│       └── index.ts                 # Tutti i tipi TS e costanti BMC
├── .mcp.json                        # Configurazione MCP (next-devtools)
├── AGENTS.md                        # Regole per agent AI
├── next.config.ts                   # Configurazione Next.js
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── vercel.json                      # Configurazione deploy Vercel
```

---

## 4. Funzionalità

### 4.1 Business Model Canvas (Griglia 5×3)

9 blocchi disposti nel layout standard del BMC:

```
┌─────────────────┬───────────────────────┬─────────────────┐
│ Key             │ Value                 │ Customer        │
│ Partnerships    │ Propositions          │ Relationships   │
├─────────────────┤                       ├─────────────────┤
│ Key             │  (centrale,           │ Customer        │
│ Activities      │   span 3 righe)       │ Segments        │
├─────────────────┤                       ├─────────────────┤
│ Key             │                       │ Channels        │
│ Resources       │                       │                 │
└─────────────────┴───────────────────────┴─────────────────┘
┌─────────────────┐                       ┌─────────────────┐
│ Cost Structure  │                       │ Revenue Streams │
└─────────────────┘                       └─────────────────┘
```

Ogni blocco supporta:
- **Aggiunta/modifica/rimozione item** testuali
- **Checkbox validazione** per ogni item (✓ verde)
- **Note testuali** per contesto aggiuntivo
- **Interazioni AI**: suggerimenti e domande critiche specifiche per blocco

### 4.2 Wizard di Onboarding (6 Step)

Modale all'avvio che guida l'utente nella configurazione del progetto:

| Step | Campo | Opzioni |
|------|-------|---------|
| 1 | Tipo di Startup | SaaS, E-commerce, Food, FinTech, Servizi, Altro |
| 2 | Settore / Industria | Tecnologia, Alimentare, Moda, Turismo, Altro |
| 3 | Fase | Idea, Validazione, MVP, Traction, Scaling |
| 4 | Geografia | Locale, Nazionale, Europeo, Globale |
| 5 | Modello di Business | B2B, B2C, B2B2C, Subscription, Transaction, Freemium, Commission |
| 6 | Idea di Business | Textarea libera per descrivere l'idea di business |

I dati del wizard alimentano tutti i prompt AI per contestualizzare le risposte.

### 4.3 Integrazione AI

#### Provider Supportati

| Provider | Default Base URL | Default Model |
|----------|-----------------|---------------|
| OpenRouter | `https://openrouter.ai/api/v1` | `google/gemini-2.0-flash-001` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta` | `gemini-2.0-flash` |
| Ollama | `http://localhost:11434/api` | `llama3` |
| Custom | (configurabile) | (configurabile) |

#### Modalità di Interazione AI

| Modalità | Descrizione | Dove si attiva |
|----------|-------------|----------------|
| **Compila BMC** | Popola automaticamente tutti i 9 blocchi basandosi sull'idea di business. Restituisce un JSON strutturato. | Pulsante "Compila BMC" nell'header e nel tab Idea |
| **Analisi Canvas** | Analisi completa: mismatch, assunzioni non validate, opportunità, raccomandazioni top 3. | Pulsante "Analisi Canvas" nell'header |
| **Suggerimenti (💡)** | Per blocco: 2-3 suggerimenti concreti per migliorare il blocco. | Pulsante in ogni blocco BMC |
| **Domande (❓)** | Per blocco: 3 domande critiche per stimolare pensiero strategico. | Pulsante in ogni blocco BMC |
| **Test Connessione** | Verifica che la API key e il provider funzionino correttamente. | Pulsante "Test Connection" nelle impostazioni AI |

Tutte le risposte AI sono in **italiano**.

#### Configurazione AI

Accessibile dall'icona ⚙️ nella sidebar sinistra. La modale permette di:
- Selezionare il provider (cambia automaticamente base URL e model di default)
- Inserire la API key (salvata in localStorage)
- Modificare base URL e nome del modello
- **Testare la connessione** prima di salvare

### 4.4 Versioning

- **Salva versione**: crea uno snapshot completo del canvas corrente (icona 💾 nella sidebar)
- **Ripristina versione**: torna a una qualsiasi versione precedente
- **Visualizzazione**: elenco versioni con numero e timestamp nel pannello destro
- Le versioni sono globali (non per-branch)

### 4.5 Branching

- **Branch**: copie indipendenti del canvas per esplorare scenari alternativi
- **Branch "main"** (root): creato automaticamente, non cancellabile
- **Cambio branch**: carica il canvas del branch selezionato
- **Cancella branch**: rimuove branch non-root
- Accessibile dal pannello destro → tab "Branches"

### 4.6 Validity Score

Punteggio **0-100%** calcolato automaticamente in base a:

| Metrica | Peso | Calcolo |
|---------|------|---------|
| Blocchi riempiti | 40% | Numero blocchi con ≥1 item su 9 |
| Item validati | 35% | Percentuale item con checkbox ✓ |
| Note | 25% | Lunghezza totale note (max a 500 caratteri) |

Visualizzato come barra colorata nell'header:
- **Verde** (≥60%): Good / Excellent
- **Arancione** (30-59%): Needs Work
- **Rosso** (<30%): Minimal

### 4.7 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| **Desktop (lg+)** | Sidebar 16px icone a sinistra + Griglia BMC centrale + Pannello DX 320px (4 tab: Versioni, Branch, Idea, Analisi) |
| **Mobile** | Header compatto + Sidebar a scomparsa + Floating button in basso a destra (Versioni, Branch, Analisi) + Bottom sheet |

---

## 5. API Endpoint

### `POST /api/ai`

Proxy server-side per le chiamate AI. Evita problemi CORS e non espone la API key al client.

**Request:**
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "config": {
    "provider": "openrouter",
    "apiKey": "sk-...",
    "baseUrl": "https://openrouter.ai/api/v1",
    "model": "google/gemini-2.0-flash-001"
  }
}
```

**Response (successo):**
```json
{ "result": "risposta dell'AI..." }
```

**Response (errore):**
```json
{ "error": "messaggio di errore in italiano" }
```

Gestione errori specifica:
- **401**: "API key non valida o scaduta. Verifica le impostazioni AI."
- **404**: "Modello AI non trovato. Verifica il nome del modello nelle impostazioni."

---

## 6. Persistenza Dati

Tutti i dati sono salvati in **localStorage** tramite `zustand/middleware/persist`:

| Store | Chiave localStorage | Contenuto |
|-------|-------------------|-----------|
| `canvas` | `canvaspilot-canvas` | Stato BMC (blocchi, item, note, validazioni) |
| `aiConfig` | `canvaspilot-aiconfig` | Provider, API key, base URL, model |
| `branches` | `canvaspilot-branches` | Lista branch con canvas indipendenti |
| `versions` | `canvaspilot-versions` | Snapshot versioni canvas |
| `onboarding` | `canvaspilot-onboarding` | Dati wizard + idea di business |

> ⚠️ **Nota**: La API key è salvata in chiaro in localStorage. In produzione sarebbe opportuno usare un backend per gestire le credenziali.

---

## 7. Flusso Utente Tipico

```
1. Avvio applicazione
   └─► Wizard onboarding (6 step)
       └─► Descrive l'idea di business

2. Configurazione AI
   └─► Sidebar ⚙️ → seleziona provider → inserisci API key → Test Connection

3. Compilazione Canvas
   └─► Clicca "Compila BMC" → AI popola tutti i 9 blocchi

4. Raffinamento
   └─► Per ogni blocco: modifica item, usa AI (💡 suggerimenti / ❓ domande)

5. Analisi
   └─► "Analisi Canvas" → feedback strategico completo

6. Iterazione
   └─► Salva versioni (💾) per fare snapshot
   └─► Crea branch per esplorare scenari alternativi
```

---

## 8. Deploy

L'applicazione è configurata per il deploy su **Vercel**:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### Comandi Locali

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia server di sviluppo |
| `npm run build` | Build di produzione + type check |
| `npm run start` | Avvia server di produzione |
| `npm run lint` | ESLint |

---

## 9. Possibili Evoluzioni

- **Autenticazione utente**: login per salvare dati su backend invece che localStorage
- **Export PDF/immagine**: esportare il canvas come report
- **Collaborazione real-time**: più utenti sullo stesso canvas
- **Template precompilati**: BMC per settori/industrie specifiche
- **Cronologia undo/redo**: oltre al versioning manuale
- **Prompt AI personalizzabili**: l'utente può modificare i prompt
- **Integrazione canvas board**: vista Kanban dei blocchi
