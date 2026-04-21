"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilters, { type TaskFilter } from "@/components/TaskFilters";
import Toast from "@/components/Toast";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { Task } from "@/types/task";
import { supabase } from "@/lib/supabase";

type TaskRow = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at,
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

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks((data ?? []).map(mapTask));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar tareas");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTask(title: string) {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ title }])
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [mapTask(data), ...prev]);
      showToast("Tarea creada correctamente");
    } catch (error) {
      console.error(error);
      showToast("No se pudo crear la tarea");
    }
  }

  async function handleToggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({ completed: !currentTask.completed })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? mapTask(data) : task))
      );
    } catch (error) {
      console.error(error);
      showToast("No se pudo actualizar la tarea");
    }
  }

  async function handleDeleteTask(id: string) {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== id));
      showToast("Tarea eliminada");
    } catch (error) {
      console.error(error);
      showToast("No se pudo eliminar la tarea");
    }
  }

  async function handleEditTask(id: string, newTitle: string) {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({ title: newTitle })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? mapTask(data) : task))
      );
      showToast("Tarea actualizada");
    } catch (error) {
      console.error(error);
      showToast("No se pudo actualizar la tarea");
    }
  }

  async function handleClearCompleted() {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("completed", true);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => !task.completed));
      showToast("Tareas completadas eliminadas");
    } catch (error) {
      console.error(error);
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
              organización y una interfaz clara. Ahora usa una base de datos real
              con Supabase.
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