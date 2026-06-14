-- CanvasPilot - Admin Roles + Monetization + Usage Tracking
-- Run this in Supabase SQL Editor after 002_onboarding.sql

-- ===== ADMIN USERS =====
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin users"
  ON public.admin_users FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Seed super admins — esegui manualmente DOPO che gli utenti si sono registrati:
-- INSERT INTO admin_users (user_id, role)
-- SELECT id, 'super_admin' FROM auth.users WHERE email = 'giovanni.lamotta@gmail.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
--
-- INSERT INTO admin_users (user_id, role)
-- SELECT id, 'super_admin' FROM auth.users WHERE email = 'opendynamics@gmail.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- ===== APP SETTINGS =====
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app settings"
  ON public.app_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update app settings"
  ON public.app_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Default settings
INSERT INTO public.app_settings (key, value) VALUES
  ('monetization_enabled', '"false"'),
  ('monetization', '{"free_daily_ai_calls": 10, "free_max_canvases": 1, "pro_monthly_price": 9, "pro_yearly_price": 60}')
ON CONFLICT (key) DO NOTHING;

-- ===== SUBSCRIPTIONS =====
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  billing_interval TEXT CHECK (billing_interval IN ('monthly', 'yearly')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- ===== AI USAGE TRACKING =====
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calls_count INT NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_usage_user_date
  ON public.ai_usage(user_id, date);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON public.ai_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON public.ai_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.ai_usage FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage"
  ON public.ai_usage FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_date ON public.ai_usage(date);
