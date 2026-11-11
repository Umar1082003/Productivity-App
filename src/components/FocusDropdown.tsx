"use client";

import { useState } from "react";
import { TaskType } from "@/types/TaskType";

type FocusDropdownProps = {
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
  tasks: TaskType[];
};

export default function FocusDropdown({
  disabled,
  value,
  onChange,
  tasks,
}: FocusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTask = tasks.find((task) => task.id === value);

  const handleSelect = (taskId: string) => {
    onChange(taskId);
    setIsOpen(false);
  };

  return (
    
<div className="relative w-full">
  <span
    id="focus-task-label"
    className="block text-xs font-semibold tracking-wider text-slate-400 mb-2"
  >
    SELECTED TASK
  </span>

  <button
    id="focus-task"
    type="button"
    onClick={() => setIsOpen(!isOpen)}
    disabled={tasks.length === 0 || disabled}
    aria-expanded={isOpen}
    aria-labelledby="focus-task-label"
    className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#182238] px-4 py-4 text-sm text-slate-100 transition hover:border-blue-400/60 hover:bg-[#1d2a42] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span className="truncate">
      {selectedTask?.title ?? "Select a task to focus on"}
    </span>

    <span
      className={`ml-3 text-slate-400 transition-transform ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      ▼
    </span>
  </button>

  {isOpen && (
    <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-700 bg-[#131d31] p-1 shadow-2xl shadow-black/30">
      {tasks.map((task) => (
        <button
          key={task.id}
          type="button"
          onClick={() => handleSelect(task.id)}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${
            value === task.id
              ? "bg-blue-500/15 text-blue-300"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="truncate">{task.title}</span>

          {value === task.id && (
            <span className="ml-auto text-blue-400">✓</span>
          )}
        </button>
      ))}
    </div>
  )}
</div>

  );
}
