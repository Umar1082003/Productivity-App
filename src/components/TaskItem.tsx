"use client";

import { useState } from "react";
// import { supabase } from "@/lib/supabase";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
// import { useEffect } from "react";

import { CiMenuKebab, CiViewList } from "react-icons/ci";
// import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
  due_date: string | null;
  created_at: string;
};

type TaskItemProps = {
  userTasks: {
    id: string;
    title: string;
    description: string | null;
    priority: "high" | "medium" | "low";
    status: "todo" | "in-progress" | "completed";
    due_date: string | null;
    created_at: string;
  }[];
  // openTask: object;
  // toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, status: string) => void;
  handleViewTask: (task: Task) => void;
  isCompleted: boolean;
  taskToDelete: Task | null;
  setTaskToDelete: (task: Task | null) => void;
  loadingDelete: boolean;
  formatDueDate: (date: string | null) => string;
};

function TaskItem({
  userTasks,
  // openTask,
  // toggleTask,
  deleteTask,
  completeTask,
  handleViewTask,
  taskToDelete,
  setTaskToDelete,
  loadingDelete,
  formatDueDate,
}: TaskItemProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleOpenMenu = async (id: string) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  // due date
  const formatTaskDeadline = (date: string | null): string => {
    if (!date) return "No deadline";

    const deadline = new Date(date);
    const now = new Date();

    const isOverdue = deadline.getTime() < now.getTime();

    if (isOverdue) {
      return `Overdue, ${deadline.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    const isToday =
      deadline.getFullYear() === now.getFullYear() &&
      deadline.getMonth() === now.getMonth() &&
      deadline.getDate() === now.getDate();

    if (isToday) {
      return `Today, ${deadline.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const isTomorrow =
      deadline.getFullYear() === tomorrow.getFullYear() &&
      deadline.getMonth() === tomorrow.getMonth() &&
      deadline.getDate() === tomorrow.getDate();


    if (isTomorrow) {
      return `Tomorrow, ${deadline.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    // const yesterday = new Date(now);
    // yesterday.setDate(now.getDate() - 1);

    // const isYesterday =
    //   deadline.getFullYear() === yesterday.getFullYear() &&
    //   deadline.getMonth() === yesterday.getMonth() &&
    //   deadline.getDate() === yesterday.getDate();

    // if (isYesterday) {
    //   return `Yesterday, ${deadline.toLocaleTimeString("en-US", {
    //     hour: "numeric",
    //     minute: "2-digit",
    //   })}`;
    // }

    return deadline.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {userTasks.map((task) => (
        <div
          key={task.id}
          className={`grid grid-cols-[40px_1fr_150px_110px_130px_40px] items-center border-b border-white/5 px-4 py-4 transition-all hover:translate-x-1.5 cursor-pointer ${task.status === "completed" ? "bg-[#41414249] blur-[1px] hover:bg-transition cursor-not-allowed" : "hover:bg-[#28282a1e] transition-all rounded-lg hover:rounded-2xl"}`}
        >
          {/* Checkbox */}
          <label className="relative flex h-5 w-5 cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={() => completeTask(task.id, task.status)}
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

          {/* Task info */}
          <div className="min-w-0" onClick={() => handleViewTask(task)}>
            <div className="flex items-center gap-2">
              <p
                className={`truncate text-sm font-medium capitalize ${
                  task.status === "completed"
                    ? "text-gray-500 line-through"
                    : "text-gray-200"
                }`}
              >
                {task.title}
              </p>

              {/* {task.category && (
                <span className="rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-400">
                  {task.category}
                </span>
              )} */}
            </div>

            {task.description ? (
              <p className="mt-1 mr-2 text-xs text-gray-500 max-h-8 overflow-hidden">
                {task.description}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Description</p>
            )}

            {/* {task.notes && (
              <p className="mt-1 text-xs text-gray-500">
                📝 {task.notes} notes
              </p>
            )} */}
          </div>

          {/* Due date */}
          <div className="text-sm text-gray-400">
            {formatTaskDeadline(task.due_date)}
          </div>

          {/* Priority */}
          <div>
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Status */}
          <div>
            <StatusBadge status={task.status} />
          </div>

          {/* Menu */}
          <div className="relative z-10">
            <button
              // onClick={() => deleteTask(task.id)}
              onClick={() => handleOpenMenu(task.id)}
              className="text-xl text-gray-400 hover:text-white cursor-pointer rounded"
            >
              <CiMenuKebab size={20} />
            </button>
            {openMenu === task.id && (
              <div
                className={`absolute text-center ${userTasks[0] ? "top-0" : "bottom-[-30]"} right-9 z-10 bg-gray-800 text-xs w-28 pr-2 border border-gray-600 rounded`}
              >
                <button
                  type="button"
                  onClick={() => handleViewTask(task)}
                  className="px-3.5 py-0.5 m-1 hover:bg-white/5 w-full rounded cursor-pointer flex items-center gap-2"
                >
                  <CiViewList />
                  Task Details
                </button>
                <button
                  type="button"
                  onClick={() => setTaskToDelete(task)}
                  className="px-3.5 py-0.5 m-1 hover:bg-white/5 w-full rounded cursor-pointer flex items-center gap-2"
                >
                  <MdOutlineDeleteOutline />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {taskToDelete && (
        <>
          <div className="w-screen h-screen bg-gray-950/80 z-29 fixed left-0 top-0"></div>
          <div className="bg-[#0c0e1c] p-3 border border-red-800/30 rounded-lg w-90 h-90 text-center flex flex-col justify-around items-center z-30 fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="p-4 bg-red-900/20 text-red-500 border border-red-700 w-auto rounded-full">
              <MdOutlineDeleteOutline size={60} />
            </div>
            <p className="text-2xl mb-3 text-gray-300">Delete Task</p>
            <p className="text-lg mb-3 text-gray-300">
              Are You Sure To Delete This Task
            </p>
            <div className="flex">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-2 m-1 text-lg hover:bg-white/5 w-full rounded-lg cursor-pointer flex items-center gap-2 border"
              >
                <IoCloseSharp />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteTask(taskToDelete.id)}
                className="px-3.5 py-2 m-1 text-lg text-red-600 bg-red-950/20 hover:bg-red-950/40 w-full rounded-lg cursor-pointer flex items-center gap-2 border"
              >
                <MdOutlineDeleteOutline />
                {loadingDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
