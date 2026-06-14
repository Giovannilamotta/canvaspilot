-- CanvasPilot - Onboarding + Database improvements
-- Run this in Supabase SQL Editor after 001_init.sql

-- Tabella onboarding
CREATE TABLE IF NOT EXISTS public.onboarding (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own onboarding"
  ON public.onboarding
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indice unico per canvases (user_id + branch_id) per consentire upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_canvases_user_branch
  ON public.canvases(user_id, branch_id)
  WHERE branch_id IS NOT NULL;

-- Aggiorna branches: aggiungi colonne mancanti
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS canvas_data JSONB DEFAULT '{}';
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS created_at_branch TIMESTAMPTZ DEFAULT now();
-- Rinominiamo eventualmente o teniamo created_at com'è
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'branches' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.branches RENAME COLUMN created_at TO created_at_old;
    ALTER TABLE public.branches RENAME COLUMN created_at_branch TO created_at;
  END IF;
END $$;
