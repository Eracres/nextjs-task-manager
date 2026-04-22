"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilters, { type TaskFilter } from "@/components/TaskFilters";
import Toast from "@/components/Toast";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { Task } from "@/types/task";

type TaskRow = {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
  createdAt?: string;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  };
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

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
      setTasks((prev) => [mapTask(data), ...prev]);
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
      <main className="min-h-screen bg-black px-4 pt-16 pb-12 text-white">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10">
            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Task Manager Pro
            </h1>

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

            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
                Cargando tareas...
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            )}
          </section>
        </div>
      </main>

      <Toast message={toastMessage} isVisible={Boolean(toastMessage)} />
    </>
  );
}