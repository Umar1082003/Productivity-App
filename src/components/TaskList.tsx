"use client";

import { useState } from "react";
// import PriorityBadge from "./PriorityBadge";
// import StatusBadge from "./StatusBadge";
import TaskItem from "./TaskItem";
import Pagenation from "./Pagenation";
import ViewTask from "./ViewTask";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
  due_date: string | null;
  created_at: string;
};

type TaskListProps = {
  userTasks: {
    id: string;
    title: string;
    description: string | null;
    priority: "high" | "medium" | "low";
    status: "todo" | "in-progress" | "completed";
    due_date: string | null;
    created_at: string;
  }[];
  deleteTask: (id: string) => void;
  completeTask: (id: string, status: string) => void;
  isCompleted: boolean;
  handleViewTask: (task: Task) => void;
  setOpenViewTask: (isOpen: boolean) => void;
  openViewTask: boolean;
  taskToDelete: Task | null;
  setTaskToDelete: (task: Task | null) => void;
  loadingTasks: boolean;
  loadingDelete: boolean;
  formatDueDate: (date: string | null) => string;
};

export default function TaskList({
  userTasks,
  deleteTask,
  completeTask,
  isCompleted,
  handleViewTask,
  taskToDelete,
  setTaskToDelete,
  loadingTasks,
  loadingDelete,
  formatDueDate,
}: TaskListProps) {
  // const [priority, setPriority] = useState<Priority>("medium");
  // const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  // const [viewTaskSelected, setViewTaskSelected] = useState<object>([]);
  // const toggleTask = (id: string) => {
  //   setSelectedTasks((prev) =>
  //     prev.includes(id)
  //       ? prev.filter((taskId) => taskId !== id)
  //       : [...prev, id],
  //   );
  // };

  return (
    <div className="w-full rounded-xl border border-white/5 bg-[#090d13]">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_150px_110px_130px_40px] items-center border-b -z-10 border-white/5 bg-[#111318] px-4 py-4 text-sm text-gray-400">
        <label className="relative flex h-5 w-5 cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            className="peer absolute h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-500 bg-transparent transition-all checked:border-[#8B5CF6] checked:bg-transparent"
          />

          <svg
            className="pointer-events-none absolute hidden h-3.5 w-3.5 text-[#8B5CF6] peer-checked:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          >
            <path d="M5 12l5 5L19 7" />
          </svg>
        </label>

        <div>Task</div>

        <div>Due Date</div>

        <div>Priority</div>

        <div>Status</div>

        <div></div>
      </div>

      {/* Tasks */}
      <>
        {loadingTasks ? (
          <p className="text-center text-gray-500 p-4">Loading...</p>
        ) : (
          <div>
            {userTasks.length === 0 && (
              <div className="text-center text-gray-500 p-4">No tasks yet.</div>
            )}
            <TaskItem
              userTasks={userTasks}
              // openTask={openTask}
              // toggleTask={toggleTask}
              deleteTask={deleteTask}
              completeTask={completeTask}
              isCompleted={isCompleted}
              handleViewTask={handleViewTask}
              taskToDelete={taskToDelete}
              setTaskToDelete={setTaskToDelete}
              loadingDelete={loadingDelete}
              formatDueDate={formatDueDate}
            />
          </div>
        )}
      </>
      <Pagenation userTasks={userTasks} />
    </div>
  );
}
