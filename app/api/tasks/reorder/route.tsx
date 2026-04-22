import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type ReorderItem = {
  id: string;
  position: number;
};

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const updates: ReorderItem[] = body.updates;

  if (!Array.isArray(updates)) {
    return NextResponse.json(
      { error: "Formato de datos inválido" },
      { status: 400 }
    );
  }

  for (const item of updates) {
    const { error } = await supabase
      .from("tasks")
      .update({ position: item.position })
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}