import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Task Manager Pro
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          
          <Link
            href="/"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Inicio
          </Link>

          {/* Usuario + Logout */}
          {user && (
            <div className="flex items-center gap-3">
              
              {/* Email */}
              <span className="hidden text-xs text-white/50 md:block">
                {user.email}
              </span>

              {/* Botón logout */}
              <AuthButton isLoggedIn={true} />
            </div>
          )}

          {!user && <AuthButton isLoggedIn={false} />}
        </div>
      </nav>
    </header>
  );
}