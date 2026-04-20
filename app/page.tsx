"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilters, { type TaskFilter } from "@/components/TaskFilters";
import Toast from "@/components/Toast";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { Task } from "@/types/task";

const STORAGE_KEY = "task-manager-pro-tasks";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  function showToast(message: string) {
    setToastMessage(message);
  }

  function handleAddTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    showToast("Tarea creada correctamente");
  }

  function handleToggleTask(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDeleteTask(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    showToast("Tarea eliminada");
  }

  function handleEditTask(id: string, newTitle: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );

    showToast("Tarea actualizada");
  }

  function handleClearCompleted() {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    showToast("Tareas completadas eliminadas");
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
    <>
      <main className="min-h-screen bg-black px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10">
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
              Proyecto en desarrollo
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Task Manager Pro
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Aplicación de gestión de tareas con foco en productividad,
              organización y una interfaz clara. Incluye CRUD, persistencia local,
              filtros y edición de tareas.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Total: <AnimatedCounter value={tasks.length} />
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Completadas: <AnimatedCounter value={completedTasks} />
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Pendientes: <AnimatedCounter value={pendingTasks} />
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
              onEditTask={handleEditTask}
            />
          </section>
        </div>
      </main>

      <Toast message={toastMessage} isVisible={Boolean(toastMessage)} />
    </>
  );
}