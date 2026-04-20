"use client";

import { AnimatePresence } from "framer-motion";
import TaskItem from "@/components/TaskItem";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
};

export default function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
        <p className="text-lg font-medium text-white/70">
          No hay tareas para mostrar
        </p>
        <p className="mt-2 text-sm text-white/45">
          Prueba a crear una nueva tarea o cambia el filtro actual.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </ul>
    </AnimatePresence>
  );
}