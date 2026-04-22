"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          {message ? <p className="text-sm text-red-400">{message}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="gradient-button w-full rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-60"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-white/60">
          ¿No tienes cuenta?{" "}
          <a href="/signup" className="text-purple-400 hover:text-purple-300">
            Regístrate
          </a>
        </p>
      </div>
    </main>
  );
}