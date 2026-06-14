import { NextResponse } from "next/server";
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

    const { data: users } = await service.auth.admin.listUsers({ perPage: 100 });

    const userList = (users?.users || []).map((u) => ({
      id: u.id,
      email: u.email || "sconosciuto",
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at,
    }));

    return NextResponse.json({ users: userList });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
