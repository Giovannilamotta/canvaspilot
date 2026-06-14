import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: adminCheck } = await supabase
      .from("admin_users").select("role").eq("user_id", user.id).single();
    if (!adminCheck) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: settings } = await supabase.from("app_settings").select("key, value");

    const result: Record<string, unknown> = {};
    settings?.forEach((s) => {
      try {
        result[s.key] = JSON.parse(s.value as string);
      } catch {
        result[s.key] = s.value;
      }
    });

    return NextResponse.json({ settings: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: adminCheck } = await supabase
      .from("admin_users").select("role").eq("user_id", user.id).single();
    if (!adminCheck) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key, value: typeof value === "string" ? value : JSON.stringify(value), updated_at: new Date().toISOString() });

      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
