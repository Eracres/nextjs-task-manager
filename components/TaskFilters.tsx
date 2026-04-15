"use client";

export type TaskFilter = "all" | "pending" | "completed";

type TaskFiltersProps = {
  currentFilter: TaskFilter;
  onChangeFilter: (filter: TaskFilter) => void;
  onClearCompleted: () => void;
  hasCompletedTasks: boolean;
};

const filters: { label: string; value: TaskFilter }[] = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Completadas", value: "completed" },
];

export default function TaskFilters({
  currentFilter,
  onChangeFilter,
  onClearCompleted,
  hasCompletedTasks,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChangeFilter(filter.value)}
              className={
                isActive
                  ? "rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500"
                  : "rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={!hasCompletedTasks}
        className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Vaciar completadas
      </button>
    </div>
  );
}