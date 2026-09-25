"use client";

import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { supabase } from "@/lib/supabase";

import PriorityDropdown from "./PriorityDropdown";
import StatusDropdown from "./StatusDropdown";

import { IoAddOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Button } from "./ui/button";

const taskSchema = z.object({
  task: z.string().min(1).max(100),
  description: z.string().min(0).max(350).optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  due_date: z.string().optional(),
  subTasks: z.string().optional(),
});

type taskdata = z.infer<typeof taskSchema>;

type Priority = "high" | "medium" | "low";
type Status = "todo" | "in-progress" | "completed";

type TaskFormProps = {
  setTaskFormIsOpen: (isOpen: boolean) => void;
  getTasks: () => void;
  formatDueDate: (date: string | null) => void;
};

function TaskForm({
  setTaskFormIsOpen,
  getTasks,
  formatDueDate,
}: TaskFormProps) {
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("todo");

  const [createLoading, setCreateLoading] = useState(false);

  const form = useForm<taskdata>({
    resolver: zodResolver(taskSchema),
  });
  console.log("form errors:", form.formState.errors);

  const onsubmit = async (taskData: taskdata) => {
    setCreateLoading(true);
    const { data, error } = await supabase.auth.getUser();
    console.log(data);
    console.log(data.user?.id);

    if (error || !data.user.id) {
      console.log("Error getting user:", error);
      setCreateLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("tasks").insert({
      user_id: data.user?.id,
      title: taskData.task,
      description: taskData.description,
      priority: priority,
      status: status,
      due_date: taskData.due_date || null,
      // Tags: ,
    });

    if (insertError) {
      console.log(console.log(insertError));
      setCreateLoading(false);
      return;
    }
    console.log("Task created successfully!");
    setCreateLoading(false);
    setTaskFormIsOpen(false);
    getTasks();
  };

  return (
    <div className="flex flex-col gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-[#292936] rounded-2xl bg-[#070f1a] mb-4 w-lg h-auto p-7">
      <div className="flex justify-between items-center border-b border-[#292936] pb-4">
        <h1 className="text-lg font-bold text-white">Add New Task</h1>
        <span
          onClick={() => setTaskFormIsOpen(false)}
          className="cursor-pointer text-gray-300 hover:text-gray-400 transition-all duration-300"
        >
          <IoMdCloseCircleOutline size={23} />
        </span>
      </div>
      <form
        className="flex flex-col"
        action=""
        onSubmit={form.handleSubmit(onsubmit, (errors) => {
          console.log("VALIDATION ERRORS:", errors);
        })}
      >
        <label
          className="text-sm font-semibold text-gray-400 mb-1"
          htmlFor="task"
        >
          Title
        </label>
        <input
          type="text"
          id="task"
          placeholder="Enter your task"
          className="bg-[#10101743] border border-[#292936] rounded px-3 py-1 w-full mb-3 placeholder:text-sm focus-within:outline-none focus-within:ring-0 focus-within:ring-[#8B5CF6] focus-within:border-[#8B5CF6]"
          {...form.register("task")}
        />
        {form.formState.errors.task && (
          <span className="text-red-500 text-xs sm:text-sm mb-1">
            {form.formState.errors.task.message}
          </span>
        )}
        <label
          className="text-sm font-semibold text-gray-400 mb-1"
          htmlFor="task"
        >
          Description <span className="text-xs text-gray-600">(optional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Enter your description"
          className="bg-[#10101743] border border-[#292936] rounded px-3 py-1 w-full mb-3 placeholder:text-sm focus-within:outline-none focus-within:ring-0 focus-within:ring-[#8B5CF6] focus-within:border-[#8B5CF6]"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <span className="text-red-500 text-xs sm:text-sm mb-1">
            {form.formState.errors.description.message}
          </span>
        )}
        <div className="flex gap-2">
          <div>
            <label
              className="text-sm font-semibold text-gray-400 mb-1"
              htmlFor="task"
            >
              Due Date (optinal)
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              placeholder="Due date"
              className="bg-[#10101743] border border-[#292936] rounded px-3 py-1 mb-3 w-full placeholder:text-sm focus-within:outline-none focus-within:ring-0 focus-within:ring-[#8B5CF6] focus-within:border-[#8B5CF6]"
              {...form.register("due_date")}
            />
            {form.formState.errors.due_date && (
              <span className="text-red-500 text-xs sm:text-sm mb-1">
                {form.formState.errors.due_date.message}
              </span>
            )}
          </div>
          <PriorityDropdown value={priority} onChange={setPriority} />
        </div>
        <div className="flex gap-2">
          <StatusDropdown value={status} onChange={setStatus} />
        </div>
        <div>
          <label
            className="text-sm font-semibold text-gray-400 mb-1"
            htmlFor="task"
          >
            SubTasks
          </label>
          <Button
            variant="outline"
            className="w-full justify-start gap-1 text-sm pl-[35%] mb-4 text-gray-600 hover:bg-[#101017ad] cursor-pointer"
          >
            <IoAddOutline />
            Add SubTask
          </Button>
        </div>
        {/* buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setTaskFormIsOpen(false)}
            className="flex items-center gap-2 bg-transparent border border-gray-800 text-white px-4 py-1 text-sm font-semibold rounded-lg hover:bg-gray-900/80 transition-colors duration-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createLoading}
            className={`flex items-center gap-2 ${createLoading ? "bg-[#8a5cf67b] disabled:opacity-50 disabled:cursor-not-allowed" : "bg-[#8B5CF6]"} text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-[#8B5CF6]/80 transition-colors duration-300 cursor-pointer`}
          >
            {createLoading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
