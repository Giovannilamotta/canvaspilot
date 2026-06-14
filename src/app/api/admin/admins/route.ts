import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = await createClient();
    const service = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: adminCheck } = await supabase
      .from("admin_users").select("role").eq("user_id", user.id).single();
    if (!adminCheck) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: admins } = await supabase
      .from("admin_users")
      .select("id, user_id, role, created_at");

    const emails: Record<string, string> = {};
    if (admins?.length) {
      const { data: users } = await service.auth.admin.listUsers({ perPage: 1000 });
      users?.users.forEach((u) => { emails[u.id] = u.email || "sconosciuto"; });
    }

    return NextResponse.json({
      admins: admins?.map((a) => ({
        ...a,
        email: emails[a.user_id] || "sconosciuto",
      })) || [],
      currentUserRole: adminCheck.role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const service = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: adminCheck } = await supabase
      .from("admin_users").select("role").eq("user_id", user.id).single();
    if (!adminCheck || adminCheck.role !== "super_admin") {
      return NextResponse.json({ error: "Solo super admin" }, { status: 403 });
    }

    const { email }: { email: string } = await req.json();
    if (!email) return NextResponse.json({ error: "Email mancante" }, { status: 400 });

    const { data: allUsers } = await service.auth.admin.listUsers({ perPage: 1000 });
    const targetUser = allUsers?.users?.find((u: { email?: string; id: string }) => u.email === email);

    if (!targetUser) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", targetUser.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Già admin" }, { status: 409 });
    }

    const { error } = await supabase
      .from("admin_users")
      .insert({ user_id: targetUser.id, role: "admin", created_by: user.id });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: adminCheck } = await supabase
      .from("admin_users").select("role").eq("user_id", user.id).single();
    if (!adminCheck || adminCheck.role !== "super_admin") {
      return NextResponse.json({ error: "Solo super admin" }, { status: 403 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId mancante" }, { status: 400 });

    const { data: target } = await supabase
      .from("admin_users").select("role").eq("user_id", userId).single();
    if (target?.role === "super_admin") {
      return NextResponse.json({ error: "Impossibile rimuovere super admin" }, { status: 400 });
    }

    await supabase.from("admin_users").delete().eq("user_id", userId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
