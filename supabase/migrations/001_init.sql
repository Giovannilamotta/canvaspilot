-- CanvasPilot - Application Tables Migration
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- ===== APPLICATION TABLES =====

-- Tabella canvas (sostituisce canvaspilot-canvas localStorage)
CREATE TABLE IF NOT EXISTS public.canvases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabella branches (sostituisce canvaspilot-branches)
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  versions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabella ai_config (sostituisce canvaspilot-aiconfig)
CREATE TABLE IF NOT EXISTS public.ai_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  provider TEXT NOT NULL DEFAULT 'openrouter',
  api_key TEXT,
  model TEXT NOT NULL DEFAULT 'openai/gpt-4o',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_canvases_user_id ON public.canvases(user_id);
CREATE INDEX IF NOT EXISTS idx_branches_user_id ON public.branches(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_configs_user_id ON public.ai_configs(user_id);

-- ===== ROW LEVEL SECURITY =====

ALTER TABLE public.canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_configs ENABLE ROW LEVEL SECURITY;

-- Policy: ogni utente può solo leggere e scrivere i propri dati
CREATE POLICY "Users can manage own canvases"
  ON public.canvases
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own branches"
  ON public.branches
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own ai config"
  ON public.ai_configs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
