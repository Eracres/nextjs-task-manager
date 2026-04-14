"use client";

import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export default function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
}: TaskItemProps) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          className="h-4 w-4 accent-purple-600"
        />

        <span
          className={
            task.completed
              ? "text-white/40 line-through"
              : "text-white/80"
          }
        >
          {task.title}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDeleteTask(task.id)}
        className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
      >
        Eliminar
      </button>
    </li>
  );
}