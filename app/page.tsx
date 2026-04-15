"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilters, { type TaskFilter } from "@/components/TaskFilters";
import type { Task } from "@/types/task";

const STORAGE_KEY = "task-manager-pro-tasks";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (storedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error reading tasks from localStorage:", error);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

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

  function handleClearCompleted() {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  }

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "pending":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const pendingTasks = tasks.length - completedTasks;

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Task Manager Pro
          </h1>

          <p className="mt-3 text-white/60">
            Gestiona tus tareas con una interfaz clara, moderna y enfocada en
            productividad.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Total: {tasks.length}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Completadas: {completedTasks}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Pendientes: {pendingTasks}
            </span>
          </div>
        </header>

        <section className="space-y-6">
          <TaskForm onAddTask={handleAddTask} />

          <TaskFilters
            currentFilter={filter}
            onChangeFilter={setFilter}
            onClearCompleted={handleClearCompleted}
            hasCompletedTasks={completedTasks > 0}
          />

          <TaskList
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>
      </div>
    </main>
  );
}
