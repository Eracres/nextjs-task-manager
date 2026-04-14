"use client";

import { useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import type { Task } from "@/types/task";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }

  function handleToggleTask(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Task Manager Pro
          </h1>
          <p className="mt-3 text-white/60">
            Gestiona tus tareas con una interfaz clara, moderna y enfocada en productividad.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Total: {tasks.length}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Completadas: {completedTasks}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Pendientes: {tasks.length - completedTasks}
            </span>
          </div>
        </header>

        <section className="space-y-6">
          <TaskForm onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>
      </div>
    </main>
  );
}
