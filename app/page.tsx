import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TasksClientPage from "@/components/TasksClientPage";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <TasksClientPage />;
}