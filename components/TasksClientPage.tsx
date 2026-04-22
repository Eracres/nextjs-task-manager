"use client";

import { useEffect, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import AppSidebar from "@/components/AppSidebar";
import MetricsDashboard from "@/components/MetricsDashboard";
import TaskForm from "@/components/TaskForm";
import TaskFilters, { type TaskFilter } from "@/components/TaskFilters";
import TaskList from "@/components/TaskList";
import Toast from "@/components/Toast";
import type { Task } from "@/types/task";

type TaskRow = {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
  createdAt?: string;
  position?: number;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    position: row.position ?? 0,
  };
}

export default function TasksClientPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("task-manager-theme") as
      | "dark"
      | "light"
      | null;

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("task-manager-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function showToast(message: string) {
    setToastMessage(message);
  }

  async function fetchTasks() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks", { cache: "no-store" });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al cargar tareas");
      }

      const data: TaskRow[] = await response.json();
      setTasks(data.map(mapTask));
    } catch (error) {
      console.log("FETCH TASKS ERROR:", error);
      showToast("Error al cargar tareas");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTask(title: string) {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear");
      }

      const data: TaskRow = await response.json();
      setTasks((prev) => [...prev, mapTask(data)]);
      showToast("Tarea creada correctamente");
    } catch (error) {
      console.log("ADD TASK ERROR:", error);
      showToast("No se pudo crear la tarea");
    }
  }

  async function handleToggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentTask.completed }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar");
      }

      const data: TaskRow = await response.json();

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? mapTask(data) : task))
      );
    } catch (error) {
      console.log("TOGGLE TASK ERROR:", error);
      showToast("No se pudo actualizar la tarea");
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al borrar");
      }

      setTasks((prev) => prev.filter((task) => task.id !== id));
      showToast("Tarea eliminada");
    } catch (error) {
      console.log("DELETE TASK ERROR:", error);
      showToast("No se pudo eliminar la tarea");
    }
  }

  async function handleEditTask(id: string, newTitle: string) {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al editar");
      }

      const data: TaskRow = await response.json();

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? mapTask(data) : task))
      );

      showToast("Tarea actualizada");
    } catch (error) {
      console.log("EDIT TASK ERROR:", error);
      showToast("No se pudo actualizar la tarea");
    }
  }

  async function handleClearCompleted() {
    try {
      const response = await fetch("/api/tasks/completed", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al limpiar");
      }

      setTasks((prev) => prev.filter((task) => !task.completed));
      showToast("Tareas completadas eliminadas");
    } catch (error) {
      console.log("CLEAR COMPLETED ERROR:", error);
      showToast("No se pudieron eliminar las completadas");
    }
  }

  async function handleReorderTasks(activeId: string, overId: string) {
    const oldIndex = tasks.findIndex((task) => task.id === activeId);
    const newIndex = tasks.findIndex((task) => task.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(tasks, oldIndex, newIndex).map((task, index) => ({
      ...task,
      position: index,
    }));

    setTasks(reordered);

    try {
      const response = await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: reordered.map((task) => ({
            id: task.id,
            position: task.position ?? 0,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el nuevo orden");
      }
    } catch (error) {
      console.log("REORDER TASKS ERROR:", error);
      showToast("No se pudo guardar el nuevo orden");
      fetchTasks();
    }
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
  const isDark = theme === "dark";

  return (
    <>
      <div
        className={
          isDark
            ? "min-h-screen bg-black text-white"
            : "min-h-screen bg-zinc-100 text-zinc-900"
        }
      >
        <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
          <AppSidebar theme={theme} onToggleTheme={toggleTheme} />

          <main className="px-4 py-8 md:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
              <section>
                <h1 className="text-4xl font-bold tracking-tight">
                  Task Manager Pro
                </h1>

                <p
                  className={
                    isDark
                      ? "mt-3 text-sm text-white/60"
                      : "mt-3 text-sm text-zinc-600"
                  }
                >
                  Gestiona tus tareas, analiza tu progreso y trabaja con una interfaz más profesional.
                </p>
              </section>

              <MetricsDashboard
                total={tasks.length}
                completed={completedTasks}
                pending={pendingTasks}
                theme={theme}
              />

              <section className="space-y-6">
                <TaskForm onAddTask={handleAddTask} theme={theme} />

                <TaskFilters
                  currentFilter={filter}
                  onChangeFilter={setFilter}
                  onClearCompleted={handleClearCompleted}
                  hasCompletedTasks={completedTasks > 0}
                  theme={theme}
                />

                {isLoading ? (
                  <div
                    className={
                      isDark
                        ? "rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50"
                        : "rounded-2xl border border-zinc-300 bg-white p-10 text-center text-zinc-500 shadow-sm"
                    }
                  >
                    Cargando tareas...
                  </div>
                ) : (
                  <TaskList
                    tasks={filteredTasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                    onReorderTasks={handleReorderTasks}
                    theme={theme}
                  />
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      <Toast message={toastMessage} isVisible={Boolean(toastMessage)} />
    </>
  );
}