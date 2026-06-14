import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
