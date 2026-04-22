"use client";

import AnimatedCounter from "@/components/AnimatedCounter";
import { CheckCircle2, Clock3, ListTodo, TrendingUp } from "lucide-react";

type MetricsDashboardProps = {
  total: number;
  completed: number;
  pending: number;
  theme: "dark" | "light";
};

export default function MetricsDashboard({
  total,
  completed,
  pending,
  theme,
}: MetricsDashboardProps) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isDark = theme === "dark";

  const cards = [
    {
      label: "Total tareas",
      value: total,
      icon: <ListTodo size={20} />,
    },
    {
      label: "Completadas",
      value: completed,
      icon: <CheckCircle2 size={20} />,
    },
    {
      label: "Pendientes",
      value: pending,
      icon: <Clock3 size={20} />,
    },
    {
      label: "Progreso",
      value: progress,
      suffix: "%",
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={
            isDark
              ? "rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              : "rounded-2xl border border-zinc-300 bg-white p-5 shadow-sm"
          }
        >
          <div
            className={
              isDark
                ? "flex items-center justify-between text-white/60"
                : "flex items-center justify-between text-zinc-500"
            }
          >
            <span className="text-sm">{card.label}</span>
            {card.icon}
          </div>

          <div
            className={
              isDark
                ? "mt-4 text-3xl font-bold text-white"
                : "mt-4 text-3xl font-bold text-zinc-900"
            }
          >
            <AnimatedCounter value={card.value} />
            {card.suffix ?? ""}
          </div>
        </div>
      ))}
    </section>
  );
}