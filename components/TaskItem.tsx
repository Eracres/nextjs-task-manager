"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
  theme: "dark" | "light";
};

export default function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  theme,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const isDark = theme === "dark";

  function handleSave() {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) return;

    onEditTask(task.id, trimmedTitle);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedTitle(task.title);
    setIsEditing(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") handleSave();
    if (event.key === "Escape") handleCancel();
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2 }}
      className={
        isDark
          ? [
              "rounded-2xl border p-4 transition duration-300",
              task.completed
                ? "border-white/5 bg-white/[0.03]"
                : "border-white/10 bg-white/5 hover:border-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]",
            ].join(" ")
          : [
              "rounded-2xl border p-4 transition duration-300",
              task.completed
                ? "border-zinc-200 bg-zinc-50"
                : "border-zinc-300 bg-white shadow-sm hover:border-purple-300",
            ].join(" ")
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
            className="mt-1 h-4 w-4 accent-purple-600"
          />

          <div className="min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                onKeyDown={handleKeyDown}
                className={
                  isDark
                    ? "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none transition focus:border-purple-500"
                    : "w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none transition focus:border-purple-500"
                }
                autoFocus
              />
            ) : (
              <p
                className={
                  task.completed
                    ? isDark
                      ? "break-words text-white/35 line-through"
                      : "break-words text-zinc-400 line-through"
                    : isDark
                    ? "break-words text-white/85"
                    : "break-words text-zinc-900"
                }
              >
                {task.title}
              </p>
            )}

            <p
              className={
                isDark
                  ? "mt-2 text-xs text-white/40"
                  : "mt-2 text-xs text-zinc-500"
              }
            >
              Creada: {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-500"
              >
                Guardar
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className={
                  isDark
                    ? "rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
                    : "rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100"
                }
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={
                  isDark
                    ? "rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
                    : "rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100"
                }
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
}