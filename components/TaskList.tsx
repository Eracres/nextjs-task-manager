"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Inbox } from "lucide-react";
import SortableTaskItem from "@/components/SortableTaskItem";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
  onReorderTasks: (activeId: string, overId: string) => void;
  theme: "dark" | "light";
};

export default function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onReorderTasks,
  theme,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    onReorderTasks(String(active.id), String(over.id));
  }

  const isDark = theme === "dark";

  if (tasks.length === 0) {
    return (
      <div
        className={
          isDark
            ? "rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center"
            : "rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm"
        }
      >
        <div
          className={
            isDark
              ? "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60"
              : "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-300 bg-zinc-100 text-zinc-500"
          }
        >
          <Inbox size={28} />
        </div>

        <h3
          className={
            isDark
              ? "mt-5 text-lg font-semibold text-white"
              : "mt-5 text-lg font-semibold text-zinc-900"
          }
        >
          No hay tareas por aquí
        </h3>

        <p
          className={
            isDark
              ? "mt-2 text-sm text-white/50"
              : "mt-2 text-sm text-zinc-500"
          }
        >
          Crea una nueva tarea o cambia el filtro para ver más contenido.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-4">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              theme={theme}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}