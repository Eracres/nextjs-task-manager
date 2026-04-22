"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthButton({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (!isLoggedIn) {
    return (
      <a
        href="/login"
        className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
      >
        Login
      </a>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-red-500/40 hover:text-red-400"
    >
      Cerrar sesión
    </button>
  );
}