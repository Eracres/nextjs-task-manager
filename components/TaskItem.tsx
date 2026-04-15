"use client";

import { useState } from "react";
import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
};

export default function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

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

  return (
    <li className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-500/20">
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
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none transition focus:border-purple-500"
                autoFocus
              />
            ) : (
              <p
                className={
                  task.completed
                    ? "break-words text-white/40 line-through"
                    : "break-words text-white/80"
                }
              >
                {task.title}
              </p>
            )}

            <p className="mt-2 text-xs text-white/40">
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
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}