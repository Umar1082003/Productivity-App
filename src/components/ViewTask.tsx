"use client";

import { useState } from "react";
// import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import {
  FiCalendar,
  FiFlag,
  FiTag,
  FiPaperclip,
  FiTrash2,
  FiEdit3,
} from "react-icons/fi";
// import { MdOutlineEdit } from "react-icons/md";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import StatusDropdown from "./StatusDropdown";
import PriorityDropdown from "./PriorityDropdown";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
  due_date: string | null;
  created_at: string;
};

type Subtask = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

type ViewTaskProps = {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isEditing: boolean;
  setIsEditing: (isOpen: boolean) => void;
  updateTask: (task: Task | null) => Promise<boolean>;
  deleteTask: (id: string) => void;
  taskToDelete: Task | null;
  setTaskToDelete: (task: Task | null) => void;
  formatDueDate: (date: string | null) => string;
  subtasks: Subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
  toogleSubtask: (id: string, status: boolean) => void;
  deleteSubtask: (id: string) => void;
  addSubtask: () => void;
  newSubtask: string;
  setNewSubtask: (title: string) => void;
  loadingSubtasks: boolean;
};

function ViewTask({
  selectedTask,
  setSelectedTask,
  isEditing,
  setIsEditing,
  updateTask,
  setTaskToDelete,
  formatDueDate,
  subtasks,
  setSubtasks,
  toogleSubtask,
  deleteSubtask,
  addSubtask,
  newSubtask,
  setNewSubtask,
  loadingSubtasks,
}: ViewTaskProps) {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editSubTaskTitles, setEditSubTaskTitles] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEditMode = () => {
    setIsEditing(true);
    setEditTask(selectedTask);
    setEditSubTaskTitles(
      subtasks.reduce(
        (acc, subtask) => {
          acc[subtask.id] = subtask.title;
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  };
  const handleCloseEditMode = () => {
    setIsEditing(false);
    setEditTask(null);
    setEditSubTaskTitles({});
  };
  const handleUpdatetask = async () => {
    if (!editTask) return;
    setIsSaving(true);
    const success = await updateTask(editTask);
    // const successSub = await updateSubTask(editTask);
    if (!success) {
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
    setIsEditing(false);
    setSelectedTask(null);
  };

  const handleUpdateSubtasks = async () => {
    for (const subtask of subtasks) {
      const newTitle = editSubTaskTitles[subtask.id]?.trim();

      if (!newTitle) {
        console.log("Subtask title cannot be empty");
        return;
      }

      if (newTitle === subtask.title) continue;

      const { error } = await supabase
        .from("subtasks")
        .update({ title: newTitle })
        .eq("id", subtask.id);

      if (error) {
        console.log(error);
        return;
      }
    }

    setSubtasks((prev) =>
      prev.map((subtask) => ({
        ...subtask,
        title: editSubTaskTitles[subtask.id]?.trim() ?? subtask.title,
      })),
    );

    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    await handleUpdatetask();
    await handleUpdateSubtasks();
  };

  const formatDateTimeLocal = (date: string | null) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <>
      {selectedTask && (
        <>
          <div className="bg-[#0c0e1c] border-l-2 rounded-lg border-[#292936] fixed top-0 right-0 w-100 h-screen overflow-y-scroll p-4 z-20">
            <div className="flex justify-between items-center mb-2">
              <div>
                {isEditing ? (
                  <StatusDropdown
                    value={editTask?.status ?? "todo"}
                    onChange={(value) =>
                      setEditTask((prev) =>
                        prev ? { ...prev, status: value } : null,
                      )
                    }
                  />
                ) : (
                  <StatusBadge status={selectedTask.status} />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {isEditing ? (
                  <div>
                    <span
                      onClick={() => handleCloseEditMode()}
                      className="cursor-pointer text-sm text-red-800 hover:text-red-400 bg-gray-700/20 px-3 p-1.5 mr-1 rounded-2xl transition-all duration-300"
                    >
                      Cancel
                      {/* <IoMdCloseCircleOutline size={20} /> */}
                    </span>
                    <span
                      onClick={() => handleSaveChanges()}
                      className="cursor-pointer text-sm text-green-700 hover:text-green-400 bg-gray-700/20 px-3 p-1.5 rounded-2xl transition-all duration-300"
                    >
                      {isSaving ? "saving..." : "Save"}
                      {/* <IoMdCloseCircleOutline size={20} /> */}
                    </span>
                  </div>
                ) : (
                  <span
                    onClick={() => handleOpenEditMode()}
                    className="cursor-pointer flex gap-1.5 text-sm text-gray-300 hover:text-gray-400 bg-gray-700/20 px-3 p-1.5 rounded-2xl transition-all duration-300"
                  >
                    Edit Task
                    <FiEdit3 size={20} />
                  </span>
                )}
                {isEditing ? (
                  ""
                ) : (
                  <span
                    onClick={() => setSelectedTask(null)}
                    className="cursor-pointer text-gray-300 hover:text-gray-400 transition-all duration-300"
                  >
                    <IoCloseSharp size={23} />
                  </span>
                )}
              </div>
            </div>
            <div>
              {isEditing ? (
                <input
                  className="text-lg rounded w-full p-1 border border-gray-500/50 my-4"
                  value={editTask?.title ?? ""}
                  onChange={(e) =>
                    setEditTask((prev) =>
                      prev ? { ...prev, title: e.target.value } : null,
                    )
                  }
                />
              ) : (
                <h1 className="text-3xl w-80 my-4">{selectedTask.title}</h1>
              )}
              <div>category</div>
            </div>
            <div className="bg-gray-600/10 p-3 rounded-lg border-2 my-3 border-[#292936] flex gap-6 w-56">
              <span
                // onClick={() => setTaskFormIsOpen(false)}
                className="cursor-pointer text-gray-300 hover:text-gray-400 transition-all duration-300"
              >
                <FiCalendar size={20} />
              </span>
              <span
                // onClick={() => setTaskFormIsOpen(false)}
                className="cursor-pointer text-gray-300 hover:text-gray-400 transition-all duration-300"
              >
                <FiFlag size={20} />
              </span>
              <span
                // onClick={() => setTaskFormIsOpen(false)}
                className="cursor-pointer text-gray-300 hover:text-gray-400 transition-all duration-300"
              >
                <FiTag size={20} />
              </span>
              <span
                // onClick={() => setTaskFormIsOpen(false)}
                className="cursor-pointer text-gray-300 hover:text-gray-400 transition-all duration-300"
              >
                <FiPaperclip size={20} />
              </span>
              <span
                onClick={() => setTaskToDelete(selectedTask)}
                className="cursor-pointer text-red-600 hover:text-red-800 transition-all duration-300"
              >
                <FiTrash2 size={20} />
              </span>
            </div>
            <div className="">
              <h5>Description</h5>
              {isEditing ? (
                <textarea
                  className="text-sm w-full h-50 border border-gray-500/50 rounded px-1 my-2"
                  value={editTask?.description ?? ""}
                  onChange={(e) =>
                    setEditTask((prev) =>
                      prev ? { ...prev, description: e.target.value } : null,
                    )
                  }
                />
              ) : (
                <p className="text-gray-400 my-2 wrap">
                  {selectedTask.description}
                </p>
              )}
            </div>
            <div>
              <h5>Due Date</h5>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(editTask?.due_date ?? null)} // id="dueDate"
                  onChange={(e) =>
                    setEditTask((prev) =>
                      prev ? { ...prev, due_date: e.target.value } : null,
                    )
                  }
                  className="bg-[#10101743] border border-[#292936] rounded px-3 py-1 mb-3 w-full placeholder:text-sm focus-within:outline-none focus-within:ring-0 focus-within:ring-[#8B5CF6] focus-within:border-[#8B5CF6]"
                />
              ) : (
                <div>{formatDueDate(selectedTask.due_date)}</div>
              )}
            </div>
            <div className="my-4">
              {isEditing ? (
                <PriorityDropdown
                  value={editTask?.priority ?? "medium"}
                  onChange={(value) =>
                    setEditTask((prev) =>
                      prev ? { ...prev, priority: value } : null,
                    )
                  }
                />
              ) : (
                <div className="flex flex-col w-23 gap-1.5">
                  <span>Priority</span>
                  <PriorityBadge priority={selectedTask.priority} />
                </div>
              )}
            </div>
            <div>
              <h2>subtasks</h2>
              {loadingSubtasks ? (
                <p>Loading subtasks...</p>
              ) : (
                <>
                  {subtasks.length === 0 ? (
                    <p>No subtasks yet</p>
                  ) : (
                    subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className={`flex items-center gap-2 ${subtask.completed ? "text-gray-500 line-through" : ""}`}
                      >
                        {isEditing ? (
                          <>
                            <div className="flex flex-col items-center gap-2">
                              <input
                                className="text-lg rounded w-full p-1 border border-gray-500/50 my-4"
                                value={editSubTaskTitles[subtask.id] ?? ""}
                                onChange={(e) =>
                                  setEditSubTaskTitles((prev) => ({
                                    ...prev,
                                    [subtask.id]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <label className="relative flex h-5 w-5 cursor-pointer items-center justify-center">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() =>
                                  toogleSubtask(subtask.id, subtask.completed)
                                }
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
                            <span>{subtask.title}</span>
                          </>
                        )}
                        <span
                          onClick={() => deleteSubtask(subtask.id)}
                          className="text-red-800 hover:text-red-600 cursor-pointer"
                        >
                          <FiTrash2 />
                        </span>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask..."
                />

                <button type="button" onClick={addSubtask}>
                  Add
                </button>
              </div>
            )}
            <hr />
            <br />
            <div>{selectedTask.created_at}</div>
          </div>
        </>
      )}
    </>
  );
}

export default ViewTask;
