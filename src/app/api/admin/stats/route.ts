import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = await createClient();
    const service = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: allUsers } = await service.auth.admin.listUsers({ perPage: 1000 });
    const totalUsers = allUsers?.users?.length || 0;

    const [{ count: activeToday }, { data: aiStats }, { count: proUsers }] =
      await Promise.all([
        supabase.from("ai_usage").select("*", { count: "exact", head: true }).eq("date", new Date().toISOString().split("T")[0]),
        supabase.from("ai_usage").select("date, calls_count").order("date", { ascending: false }).limit(30),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("plan", "pro"),
      ]);

    const recentUsers = await supabase
      .from("branches")
      .select("user_id, name")
      .order("created_at", { ascending: false })
      .limit(10);

    // Get emails for recent users (via auth admin)
    const userIds = [...new Set(recentUsers.data?.map((r) => r.user_id) || [])];
    const userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const all = await service.auth.admin.listUsers({ perPage: 1000 });
      all?.data?.users?.forEach((u: { id: string; email?: string }) => {
        userMap[u.id] = u.email || "unknown";
      });
    }

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeToday: activeToday || 0,
      aiCallsLast30: aiStats?.reduce((sum, r) => sum + r.calls_count, 0) || 0,
      proUsers: proUsers || 0,
      recentUsers:
        recentUsers.data?.map((r) => ({
          email: userMap[r.user_id] || "sconosciuto",
          branch: r.name,
        })) || [],
      aiUsageChart:
        aiStats?.map((r) => ({
          date: r.date,
          calls: r.calls_count,
        })) || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
