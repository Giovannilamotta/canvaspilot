import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: activeBranch } = await supabase
      .from("branches")
      .select("id, canvas_data")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!activeBranch) {
      return NextResponse.json({ canvas: null });
    }

    return NextResponse.json({
      canvas: activeBranch.canvas_data || { blocks: {} },
      branchId: activeBranch.id,
    });
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { canvas: canvasData, branchId } = body;

    if (!canvasData) {
      return NextResponse.json({ error: "Missing canvas data" }, { status: 400 });
    }

    if (branchId) {
      await supabase
        .from("branches")
        .update({ canvas_data: canvasData, updated_at: new Date().toISOString() })
        .eq("id", branchId)
        .eq("user_id", user.id);
    } else {
      const { data: activeBranch } = await supabase
        .from("branches")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (activeBranch) {
        await supabase
          .from("branches")
          .update({ canvas_data: canvasData, updated_at: new Date().toISOString() })
          .eq("id", activeBranch.id)
          .eq("user_id", user.id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
