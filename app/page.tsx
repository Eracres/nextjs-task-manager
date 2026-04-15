"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilters, { type TaskFilter } from "@/components/TaskFilters";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Task } from "@/types/task";

const STORAGE_KEY = "task-manager-pro-tasks";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleRequestDeleteTask(id: string) {
    setTaskToDelete(id);
  }

  function handleConfirmDeleteTask() {
    if (!taskToDelete) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete));
    setTaskToDelete(null);
  }

  function handleCancelDeleteTask() {
    setTaskToDelete(null);
  }

  function handleEditTask(id: string, newTitle: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
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
              onDeleteTaskRequest={handleRequestDeleteTask}
              onEditTask={handleEditTask}
            />
          </section>
        </div>
      </main>

      {taskToDelete ? (
        <ConfirmDialog
          title="Eliminar tarea"
          description="Esta acción eliminará la tarea de forma permanente. ¿Seguro que quieres continuar?"
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDeleteTask}
          onCancel={handleCancelDeleteTask}
        />
      ) : null}
    </>
  );
}