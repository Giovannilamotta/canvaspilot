import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: branches } = await supabase
      .from("branches")
      .select("id, name, parent_id, is_active, versions, canvas_data, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({ branches: branches || [] });
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, parentId, canvasData } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing branch name" }, { status: 400 });
    }

    // Deactivate all other branches
    await supabase
      .from("branches")
      .update({ is_active: false })
      .eq("user_id", user.id);

    const { data: branch, error } = await supabase
      .from("branches")
      .insert({
        user_id: user.id,
        name,
        parent_id: parentId || null,
        is_active: true,
        canvas_data: canvasData || { blocks: {} },
        versions: [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ branch }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
