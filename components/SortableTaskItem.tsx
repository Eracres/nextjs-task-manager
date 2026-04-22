"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "@/components/TaskItem";
import type { Task } from "@/types/task";

type SortableTaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
  theme: "dark" | "light";
};

export default function SortableTaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  theme,
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDark = theme === "dark";

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-70" : ""}
    >
      <div
        {...attributes}
        {...listeners}
        className={
          isDark
            ? "mb-2 cursor-grab rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-white/40 active:cursor-grabbing"
            : "mb-2 cursor-grab rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500 active:cursor-grabbing"
        }
      >
        Arrastra para reordenar
      </div>

      <TaskItem
        task={task}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        theme={theme}
      />
    </li>
  );
}