import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ id: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await request.json();

  const updates: { title?: string; completed?: boolean } = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();

    if (!title) {
      return NextResponse.json(
        { error: "El título no puede estar vacío" },
        { status: 400 }
      );
    }

    updates.title = title;
  }

  if (typeof body.completed === "boolean") {
    updates.completed = body.completed;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Params }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}