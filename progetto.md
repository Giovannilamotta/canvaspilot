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
| Auth | Supabase Auth (email/password) | — |
| Database | Supabase PostgreSQL + RLS | — |
| Deploy | Vercel | — |

---

## 3. Architettura del Progetto

```
canvaspilot/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx           # Layout pagine auth
│   │   │   ├── login/page.tsx       # Login (email/password)
│   │   │   └── signup/page.tsx      # Registrazione
│   │   ├── api/
│   │   │   ├── ai/route.ts          # Endpoint proxy per chiamate AI
│   │   │   ├── ai-config/route.ts   # GET/PUT configurazione AI per utente
│   │   │   ├── branches/
│   │   │   │   ├── route.ts         # GET/POST lista branch
│   │   │   │   └── [id]/route.ts    # PUT/DELETE branch singolo
│   │   │   ├── canvas/route.ts      # GET/PUT canvas branch attivo
│   │   │   └── onboarding/route.ts  # GET/PUT dati wizard
│   │   ├── globals.css              # Tailwind + theme custom + @variant dark
│   │   ├── layout.tsx               # Root layout (font Geist, ThemeProvider)
│   │   └── page.tsx                 # Entry point → DataLoader → AppLayout
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIAnalysis.tsx       # Analisi completa del canvas
│   │   │   ├── AIBlockInteractions.tsx  # Suggerimenti/domande → pannello AI
│   │   │   ├── AIFeedbackPanel.tsx  # Pannello feedback AI nel RightPanel
│   │   │   ├── AIFillCanvas.tsx     # Compilazione automatica BMC da idea
│   │   │   └── AISettings.tsx       # Configurazione provider AI + test connessione
│   │   ├── auth/
│   │   │   └── UserMenu.tsx         # Avatar utente + logout nell'header
│   │   ├── bmc/
│   │   │   ├── BMCBlock.tsx         # Singolo blocco del canvas (item, note, validazione)
│   │   │   └── BMCEditor.tsx        # Griglia 3×3 bilanciata
│   │   ├── branching/
│   │   │   └── BranchPanel.tsx      # Creazione e gestione branch paralleli
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Layout principale (header, sidebar, griglia, pannello DX)
│   │   │   ├── DataLoader.tsx       # Carica dati utente da Supabase all'avvio
│   │   │   ├── RightPanel.tsx       # Pannello destro: 5 tab (Vers, Branch, Idea, AI, Analysis)
│   │   │   └── ThemeProvider.tsx    # Applica classe dark al <html>
│   │   ├── score/
│   │   │   └── ValidityScore.tsx    # Barra punteggio validità canvas
│   │   ├── sidebar/
│   │   │   └── Sidebar.tsx          # Icone rapide + toggle dark mode + reset
│   │   ├── versioning/
│   │   │   └── VersionPanel.tsx     # Snapshot e restore versioni per-branch
│   │   └── wizard/
│   │       └── StartupWizard.tsx    # Wizard onboarding 6 step
│   ├── lib/
│   │   ├── ai.ts                    # Client AI multi-provider (OpenAI-compat, Gemini, Ollama)
│   │   ├── score.ts                 # Calcolo validity score e contesti per prompt AI
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client (browser)
│   │       ├── middleware.ts        # Refresh sessione + protezione rotte
│   │       └── server.ts            # Supabase client (server)
│   ├── middleware.ts                 # Next.js middleware (auth)
│   ├── stores/
│   │   ├── aiConfig.ts              # Configurazione provider AI (Supabase)
│   │   ├── aiFeedback.ts            # Feedback AI attivo nel pannello
│   │   ├── branches.ts              # Gestione branch (Supabase)
│   │   ├── canvas.ts                # Stato BMC (Supabase + auto-save debounced)
│   │   ├── onboarding.ts            # Dati wizard (Supabase)
│   │   ├── theme.ts                 # Tema dark/light (persistito localStorage)
│   │   └── versions.ts              # Versioning in-memory (dentro branches)
│   └── types/
│       └── index.ts                 # Tutti i tipi TS e costanti BMC
├── supabase/
│   └── migrations/
│       ├── 001_init.sql             # Tabelle canvases, branches, ai_configs + RLS
│       └── 002_onboarding.sql       # Tabella onboarding + indici
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

### 4.1 Business Model Canvas (Griglia 3×3)

9 blocchi disposti in una griglia 3×3 bilanciata, con colori saturi per una migliore leggibilità:

```
┌──────────────────┬──────────────────┬──────────────────┐
│ Key Partnerships │ Value Propositions│ Customer Relat.  │
├──────────────────┼──────────────────┼──────────────────┤
│ Key Activities   │ Channels         │ Customer Segments│
├──────────────────┼──────────────────┼──────────────────┤
│ Key Resources    │ Cost Structure   │ Revenue Streams  │
└──────────────────┴──────────────────┴──────────────────┘
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
| **Suggerimenti (💡)** | Per blocco: 2-3 item pronti da inserire con pulsante 「＋ Aggiungi」. Risultato nel pannello AI del RightPanel. | Pulsante in ogni blocco BMC |
| **Domande (❓)** | Per blocco: 3 domande critiche sola lettura per stimolare pensiero strategico. Risultato nel pannello AI. | Pulsante in ogni blocco BMC |
| **Test Connessione** | Verifica che la API key e il provider funzionino correttamente. | Pulsante "Test Connection" nelle impostazioni AI |

Tutte le risposte AI sono in **italiano**.

#### Configurazione AI

Accessibile dall'icona ⚙️ nella sidebar sinistra. La modale permette di:
- Selezionare il provider (cambia automaticamente base URL e model di default)
- Inserire la API key (salvata in Supabase, non in chiaro nel browser)
- Modificare base URL e nome del modello
- **Testare la connessione** prima di salvare

### 4.4 Versioning

- **Salva versione**: crea uno snapshot completo del canvas corrente (icona 💾 nella sidebar)
- **Ripristina versione**: torna a una qualsiasi versione precedente
- **Visualizzazione**: elenco versioni con numero e timestamp nel pannello destro
- Le versioni sono **per-branch**: ogni branch ha le proprie versioni indipendenti

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
| **Desktop (lg+)** | Sidebar 16px icone a sinistra + Griglia BMC centrale + Pannello DX 320px (5 tab: Versioni, Branch, Idea, AI, Analisi) |
| **Mobile** | Header compatto + Sidebar a scomparsa + Floating button in basso a destra (Versioni, Branch, Analisi) + Bottom sheet |

### 4.8 Dark Mode

Toggle 🌙/☀️ nella sidebar (in fondo, sopra il reset). La preferenza è salvata in localStorage.

Tutti i componenti supportano varianti dark:
- Sfondi: `dark:bg-gray-900` / `dark:bg-gray-950`
- Testi: `dark:text-gray-200` / `dark:text-gray-400`
- Bordi: `dark:border-gray-700` / `dark:border-gray-800`
- Modali e overlay: `dark:bg-black/60`
- Blocchi BMC: `dark:bg-purple-900/20` con header `dark:bg-purple-800/40`
- Input e textarea: `dark:bg-gray-800 dark:border-gray-600`

Il tema usa la `class` strategy di Tailwind v4 con `@variant dark` nel CSS.

---

## 5. Autenticazione

### Supabase Auth (email/password)

- **Pagine**: `/login` e `/signup` con form email/password
- **Middleware**: protegge tutte le rotte tranne `/login` e `/signup`. Utenti non autenticati → redirect a `/login`
- **UserMenu**: nell'header mostra avatar (iniziale email) + nome. Dropdown con logout.
- **Database**: ogni tabella ha Row Level Security (`auth.uid() = user_id`) — gli utenti vedono solo i propri dati

### Variabili d'ambiente richieste

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

---

## 6. API Endpoint

### `POST /api/ai`
Proxy server-side per le chiamate AI. Evita CORS e usa la API key dal payload.

### `GET/PUT /api/canvas`
Carica/salva il canvas del branch attivo per l'utente corrente (da Supabase `branches.canvas_data`).

### `GET/POST /api/branches`
Lista tutti i branch dell'utente. POST crea un nuovo branch (disattiva gli altri, imposta `is_active = true`).

### `PUT/DELETE /api/branches/[id]`
Aggiorna (nome, is_active, versions, canvas_data) o cancella un branch (non-root).

### `GET/PUT /api/ai-config`
Carica/salva configurazione AI per utente (provider, API key, model) in `ai_configs`.

### `GET/PUT /api/onboarding`
Carica/salva dati wizard onboarding in tabella `onboarding`.

Tutti gli endpoint usano `createClient()` server-side di Supabase e sono protetti da RLS.

---

## 7. Database (Supabase PostgreSQL)

Tutti i dati utente sono salvati in **Supabase PostgreSQL** con **Row Level Security**:

### Tabelle

| Tabella | Contenuto | RLS |
|---------|-----------|-----|
| `branches` | Branch (name, parent_id, is_active, canvas_data, versions JSONB) | `auth.uid() = user_id` |
| `ai_configs` | Config AI (provider, api_key, model) — UNIQUE per user | `auth.uid() = user_id` |
| `onboarding` | Dati wizard (data JSONB, completed) — PK su user_id | `auth.uid() = user_id` |

### Flusso Dati

```
All'avvio (DataLoader):
  1. GET /api/branches      → se nuovo utente, POST branch "main"
  2. GET /api/canvas         → carica canvas_data del branch attivo
  3. GET /api/ai-config      → carica configurazione AI
  4. GET /api/onboarding     → carica dati wizard

Durante l'uso:
  Canvas modificato → debounce 2s → PUT /api/canvas
  Branch creato/scambiato → immediato → POST/PUT /api/branches
  Versione salvata → immediato → PUT /api/branches/[id]
  AI config salvata → immediato → PUT /api/ai-config
  Wizard completato → immediato → PUT /api/onboarding
```

### Tema (unico dato in localStorage)

| Store | Chiave | Contenuto |
|-------|--------|-----------|
| `theme` | `canvaspilot-theme` | Preferenza `light` / `dark` |

---

## 8. Flusso Utente Tipico

```
1. Registrazione / Login
   └─► /signup → crea account (email/password)
   └─► /login → accedi

2. Avvio applicazione
   └─► DataLoader carica dati da Supabase
   └─► Wizard onboarding (6 step) se primo accesso
       └─► Descrive l'idea di business

3. Configurazione AI
   └─► Sidebar ⚙️ → seleziona provider → inserisci API key → Test Connection

4. Compilazione Canvas
   └─► Clicca "Compila BMC" → AI popola tutti i 9 blocchi

5. Raffinamento
   └─► Per ogni blocco: modifica item
   └─► 💡 Suggerimenti AI → item nel pannello AI → 「＋ Aggiungi」per inserire
   └─► ❓ Domande AI → domande critiche nel pannello (sola lettura)

6. Analisi
   └─► "Analisi Canvas" → feedback strategico completo

7. Iterazione
   └─► Salva versioni (💾) per fare snapshot (per-branch)
   └─► Crea branch per esplorare scenari alternativi
   └─► Auto-save: ogni modifica salvata su Supabase dopo 2s
```

---

## 9. Deploy

L'applicazione è configurata per il deploy su **Vercel** con integrazione **Supabase**:

- **Dominio**: `canvaspilot.vercel.app`
- **Framework**: Next.js (rilevato automaticamente da Vercel)

### Variabili d'ambiente (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL    # URL progetto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Anon key Supabase
SUPABASE_URL                # URL (server-side)
SUPABASE_ANON_KEY           # Anon key (server-side)
```

### Setup Supabase

1. Creare progetto su [supabase.com](https://supabase.com)
2. Abilitare provider **Email/Password** in Authentication → Providers
3. Eseguire le migration SQL (`supabase/migrations/`) nel SQL Editor
4. Copiare URL e Anon Key nelle env var di Vercel

### Comandi Locali

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia server di sviluppo |
| `npm run build` | Build di produzione + type check |
| `npm run start` | Avvia server di produzione |
| `npm run lint` | ESLint |

---

## 10. Possibili Evoluzioni

- **OAuth (Google/GitHub)**: login social oltre a email/password
- **Reset password**: flusso "password dimenticata"
- **Export PDF/immagine**: esportare il canvas come report
- **Collaborazione real-time**: più utenti sullo stesso canvas
- **Template precompilati**: BMC per settori/industrie specifiche
- **Confronto branch**: diff visuale tra diverse versioni/branch
- **Import selettivo**: prendere blocchi specifici da un altro branch
- **Prompt AI personalizzabili**: l'utente può modificare i prompt
