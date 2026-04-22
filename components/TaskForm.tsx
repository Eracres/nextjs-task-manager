"use client";

import { useState } from "react";

type TaskFormProps = {
  onAddTask: (title: string) => void;
  theme: "dark" | "light";
};

export default function TaskForm({ onAddTask, theme }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const isDark = theme === "dark";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isDark
          ? "flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row"
          : "flex flex-col gap-3 rounded-2xl border border-zinc-300 bg-white p-4 shadow-sm sm:flex-row"
      }
    >
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Escribe una nueva tarea..."
        className={
          isDark
            ? "flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            : "flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-purple-500"
        }
      />

      <button
        type="submit"
        className="rounded-xl bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-500"
      >
        Añadir
      </button>
    </form>
  );
}