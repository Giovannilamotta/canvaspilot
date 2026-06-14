import { createClient } from "@/lib/supabase/client";

let monCache: { enabled: boolean; config: Record<string, number> } | null = null;
let cacheTime = 0;

async function getMonetizationSettings(): Promise<{
  enabled: boolean;
  freeDailyAICalls: number;
  freeMaxCanvases: number;
}> {
  if (monCache && Date.now() - cacheTime < 60000) {
    return {
      enabled: monCache.enabled,
      freeDailyAICalls: monCache.config.free_daily_ai_calls || 10,
      freeMaxCanvases: monCache.config.free_max_canvases || 1,
    };
  }

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["monetization_enabled", "monetization"]);

    const enabled =
      data?.find((r) => r.key === "monetization_enabled")?.value === true ||
      data?.find((r) => r.key === "monetization_enabled")?.value === "true";
    const config = data?.find((r) => r.key === "monetization")?.value as Record<string, number> || {};

    monCache = { enabled, config };
    cacheTime = Date.now();

    return {
      enabled,
      freeDailyAICalls: config.free_daily_ai_calls || 10,
      freeMaxCanvases: config.free_max_canvases || 1,
    };
  } catch {
    return { enabled: false, freeDailyAICalls: 10, freeMaxCanvases: 1 };
  }
}

export async function getUserPlan(): Promise<"free" | "pro"> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "free";

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  return sub?.plan || "free";
}

export async function canMakeAICall(): Promise<{ allowed: boolean; message?: string }> {
  const settings = await getMonetizationSettings();
  if (!settings.enabled) return { allowed: true };

  const plan = await getUserPlan();
  if (plan === "pro") return { allowed: true };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false, message: "Utente non autenticato" };

  const today = new Date().toISOString().split("T")[0];
  const { data: usage } = await supabase
    .from("ai_usage")
    .select("calls_count")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const used = usage?.calls_count || 0;
  if (used >= settings.freeDailyAICalls) {
    return {
      allowed: false,
      message: `Limite AI giornaliero raggiunto (${used}/${settings.freeDailyAICalls}). Passa a Pro per AI illimitato.`,
    };
  }

  return { allowed: true };
}

export async function trackAICall(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("ai_usage")
    .select("id, calls_count")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("ai_usage")
      .update({ calls_count: existing.calls_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("ai_usage")
      .insert({ user_id: user.id, date: today, calls_count: 1 });
  }
}

export async function canCreateCanvas(): Promise<{ allowed: boolean; message?: string }> {
  const settings = await getMonetizationSettings();
  if (!settings.enabled) return { allowed: true };

  const plan = await getUserPlan();
  if (plan === "pro") return { allowed: true };

  // For free users, check canvas count
  // Canvas count = branches count (each branch has a canvas)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false, message: "Utente non autenticato" };

  const { count } = await supabase
    .from("branches")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count || 0) >= settings.freeMaxCanvases) {
    return {
      allowed: false,
      message: `Limite canvas raggiunto (${count}/${settings.freeMaxCanvases}). Passa a Pro per canvas illimitati.`,
    };
  }

  return { allowed: true };
}
