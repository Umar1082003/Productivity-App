"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import SideBar from "@/components/SideBar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
// import Pagenation from "@/components/Pagenation";
// supabase
import { supabase } from "@/lib/supabase";
// icons
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
// import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
// shadcn ui
import { Button } from "@/components/ui/button";
import ViewTask from "@/components/ViewTask";

type TaskType = {
  id: string;
  title: string;
  description: string | null;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
  due_date: string | null;
  created_at: string;
};

function TaskPage() {
  const [taskFormIsOpen, setTaskFormIsOpen] = useState(false);
  const [userTasks, setUserTasks] = useState<TaskType[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [openViewTask, setOpenViewTask] = useState(false);

  const [IsNotlogin, setIsNotlogin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);

  // get session
  useEffect(() => {
    const getSession = async () => {
      setSuccessMsg("");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("SESSION:", session);
      if (session === null) {
        setIsNotlogin(true);
        console.log("the User is not logged in. Redirecting to login page.");
      } else {
        setIsNotlogin(false);
        setSuccessMsg("Account signed in successfully");
        console.log("User is logged in:", session.user);
      }
      setLoading(false);
    };
    getSession();
  }, []);

  // get tasks
  const getTasks = async () => {
    setLoadingTasks(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("mafesh user", error);
      setLoadingTasks(false);
      return;
    }

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, title, description, priority, status, due_date, created_at")
      .eq("user_id", data.user?.id);

    if (tasksError) {
      console.log(tasksError);
    } else {
      console.log("tasks:", tasks);
      setLoadingTasks(false);
      setUserTasks(tasks);
    }
  };

  // delete task
  const deleteTask = async (id: string) => {
    setLoadingDelete(true);
    const getUser = await supabase.auth.getUser();
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", getUser.data.user?.id)
      .eq("id", id);

    if (error) {
      console.log(error);
      setLoadingDelete(false);
      return;
    }
    setUserTasks(userTasks.filter((task) => task.id !== id));

    setLoadingDelete(false);
    setTaskToDelete(null);
    setSelectedTask(null);
  };

  // complete Task
  const completeTask = async (id: string, status: string) => {
    const getUser = await supabase.auth.getUser();

    const newStatus = status === "completed" ? "in-progress" : "completed";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("user_id", getUser.data.user?.id)
      .eq("id", id);

    if (error) {
      console.log("task isn`t completed", error);
      return;
    }

    setUserTasks(
      userTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
    setIsCompleted(true);
  };

  // update task
  const updateTask = async (Task: TaskType | null): Promise<boolean> => {
    const { error } = await supabase
      .from("tasks")
      .update({
        title: Task?.title,
        description: Task?.description,
        priority: Task?.priority,
        status: Task?.status,
        due_date: Task?.due_date || null,
      })
      .eq("id", Task?.id);

    if (error) {
      console.log(error);
      return false;
    }

    setUserTasks(
      userTasks.map((item) =>
        item.id === Task?.id
          ? {
              ...item,
              title: Task?.title,
              description: Task?.description,
              priority: Task?.priority,
              status: Task?.status,
              due_date: Task?.due_date || null,
            }
          : item,
      ),
    );
    return true;
  };

  const handleViewTask = (task: TaskType) => {
    console.log(task);
    setOpenViewTask(true);
    setSelectedTask(task);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      getTasks();
    };

    fetchTasks();
  }, []);

  // due date
  const formatDueDate = (date: string | null) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen font-extrabold text-6xl text-zinc-700">
          <p>Loading...</p>
        </div>
      ) : IsNotlogin ? (
        <>
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-3 text-center text-1xl capitalize font-bold"
            role="alert"
          >
            <p>The user is not logged in. Please go to the login page.</p>
            <Link href="/login" className="underline text-blue-500">
              Login
            </Link>
          </div>
          <h1 className="text-7xl font-extrabold text-zinc-800 whitespace-wrap px-0 text-center capitalize mt-0 md:mt-40">
            User is not logged in.
          </h1>
        </>
      ) : (
        <div className="flex w-full">
          <SideBar />
          <div className="p-4 w-full">
            {successMsg && (
              <div className="bg-[#10B981] text-white p-2 mb-4 rounded">
                {successMsg}
              </div>
            )}
            {/* header */}
            <div className="border-b border-[#292936] pb-4 flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Task</h1>
                <p className="text-lg font-semibold text-[#9A9AA6]">
                  Organize your tasks and get things done.
                </p>
              </div>
              <div className="flex justify-center items-center gap-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="bg-[#101017] border border-[#292936] rounded p-2"
                />
                <IoMdNotificationsOutline
                  size={25}
                  className="cursor-pointer"
                />
                <button
                  onClick={() => setTaskFormIsOpen(true)}
                  className="flex items-center gap-2 bg-[#8B5CF6] text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-[#8B5CF6]/80 transition-colors duration-300 cursor-pointer"
                >
                  <IoAddOutline size={23} />
                  Add Task
                </button>
              </div>
            </div>
            {/* ////////////////header/////////////// */}
            {/* form header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#292936]">
              {/* <button>All</button> */}

              <div className="flex gap-2">
                <Button variant="outline" className="activeBtnFormHeader p-5">
                  All
                </Button>
                <Button variant="outline" className="p-5">
                  Today
                </Button>
                <Button variant="outline" className="p-5">
                  Upcoming
                </Button>
                <Button variant="outline" className="p-5">
                  Completed
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="p-3">
                  <CiFilter size={20} />
                  Filter
                  <IoIosArrowDown size={20} />
                </Button>
                <Button variant="outline" className="p-3">
                  <MdOutlineSort size={20} />
                  Sort
                </Button>
              </div>
            </div>
            {/* //////form header////// */}
            {/* task list */}
            <TaskList
              userTasks={userTasks}
              deleteTask={deleteTask}
              completeTask={completeTask}
              isCompleted={isCompleted}
              handleViewTask={handleViewTask}
              setOpenViewTask={setOpenViewTask}
              openViewTask={openViewTask}
              taskToDelete={taskToDelete}
              setTaskToDelete={setTaskToDelete}
              loadingTasks={loadingTasks}
              loadingDelete={loadingDelete}
              formatDueDate={formatDueDate}
            />
            {/* <Pagenation /> */}
            {/* /////////task list///// */}
            {taskFormIsOpen && (
              <TaskForm
                setTaskFormIsOpen={setTaskFormIsOpen}
                getTasks={getTasks}
              />
            )}
            <ViewTask
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              updateTask={updateTask}
              deleteTask={deleteTask}
              taskToDelete={taskToDelete}
              setTaskToDelete={setTaskToDelete}
              formatDueDate={formatDueDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;
