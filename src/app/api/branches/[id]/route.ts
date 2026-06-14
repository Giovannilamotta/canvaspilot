import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = await params;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.is_active !== undefined) {
      if (body.is_active) {
        await supabase.from("branches").update({ is_active: false }).eq("user_id", user.id);
      }
      updateData.is_active = body.is_active;
    }
    if (body.versions !== undefined) updateData.versions = body.versions;
    if (body.canvas_data !== undefined) updateData.canvas_data = body.canvas_data;

    const { error } = await supabase
      .from("branches")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("parent_id", null) // Don't allow deleting root branch
      .not("parent_id", "is", null); // parent_id must exist

    if (error) {
      // If the condition fails (root branch), try deleting non-root
      const { error: err2 } = await supabase
        .from("branches")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .not("parent_id", "is", null);

      if (err2) {
        return NextResponse.json({ error: "Cannot delete root branch" }, { status: 400 });
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
