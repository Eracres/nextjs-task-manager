"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";

type AppSidebarProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function AppSidebar({
  theme,
  onToggleTheme,
}: AppSidebarProps) {
  const isDark = theme === "dark";

  return (
    <aside
      className={
        isDark
          ? "border-r border-white/10 bg-white/5 px-5 py-6 backdrop-blur md:min-h-screen"
          : "border-r border-zinc-300 bg-white px-5 py-6 md:min-h-screen"
      }
    >
      <div>
        <h2
          className={
            isDark
              ? "text-xl font-bold tracking-tight text-white"
              : "text-xl font-bold tracking-tight text-zinc-900"
          }
        >
          Task Manager Pro
        </h2>

        <p
          className={
            isDark
              ? "mt-2 text-sm text-white/50"
              : "mt-2 text-sm text-zinc-500"
          }
        >
          Organiza tus tareas con una experiencia más visual y productiva.
        </p>
      </div>

      <nav className="mt-10 space-y-2">
        <Link
          href="/"
          className={
            isDark
              ? "flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              : "flex items-center gap-3 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900"
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <button
          type="button"
          className={
            isDark
              ? "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              : "flex w-full items-center gap-3 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900"
          }
        >
          <CheckSquare size={18} />
          Tareas
        </button>

        <button
          type="button"
          className={
            isDark
              ? "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              : "flex w-full items-center gap-3 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900"
          }
        >
          <BarChart3 size={18} />
          Métricas
        </button>
      </nav>

      <div className="mt-10">
        <button
          type="button"
          onClick={onToggleTheme}
          className={
            isDark
              ? "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              : "flex w-full items-center gap-3 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900"
          }
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>
    </aside>
  );
}