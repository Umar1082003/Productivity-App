"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import SideBar from "@/components/SideBar";

import { FocusSession, TaskType } from "@/types/TaskType";
import FocusDropdown from "@/components/FocusDropdown";
import FocusTimer from "@/components/focus/FocusTimer";

type ActiveFocusSession = {
  id: string;
  task_id: string;
  duration_seconds: number;
  elapsed_seconds: number;
  status: "running" | "paused";
  last_resumed_at: string | null;
  time_left_seconds: number;
};

function FocusPage() {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [userTasks, setUserTasks] = useState<TaskType[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const [activeSession, setActiveSession] = useState<ActiveFocusSession | null>(
    null,
  );
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  const getTasks = async () => {
    // setLoadingTasks(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("mafesh user", error);
      // setLoadingTasks(false);
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from("focus_sessions")
      .select(
        "id, task_id, duration_seconds, elapsed_seconds, status, last_resumed_at",
      )
      .eq("user_id", data.user.id)
      .in("status", ["running", "paused"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sessionError) {
      console.log("Error fetching session:", sessionError);
      setIsLoadingSession(false);
      return;
    } else if (session) {
      setIsLoadingSession(false);
      setSelectedTaskId(session.task_id);
      setIsSessionActive(true);
      const elapsedSinceResume =
        session.status === "running" && session.last_resumed_at
          ? (Date.now() - new Date(session.last_resumed_at).getTime()) / 1000
          : 0;
      const elapsedTotal = Math.floor(
        session.elapsed_seconds + elapsedSinceResume,
      );

      const timeLeft = Math.max(0, session.duration_seconds - elapsedTotal);
      setActiveSession({ ...session, time_left_seconds: timeLeft });
      console.log("active session:", session);
    } else {
      setSelectedTaskId("");
      setIsSessionActive(false);
      setActiveSession(null);
      setIsLoadingSession(false);
    }

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, title, description, priority, status, due_date, created_at")
      .eq("user_id", data.user?.id);

    if (tasksError) {
      console.log(tasksError);
      // setLoadingTasks(false);
    } else {
      console.log("tasks:", tasks);
      // setLoadingTasks(false);
      setUserTasks(tasks);
    }
  };

  const getFocusHistory = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return;

    const { data: sessions, error: sessionsError } = await supabase
      .from("focus_sessions")
      .select(
        "id, task_id, duration_seconds, elapsed_seconds, status, started_at",
      )
      .eq("user_id", data.user.id)
      .in("status", ["completed", "cancelled"])
      .order("started_at", { ascending: false })
      .limit(10);

    if (sessionsError) {
      console.log(sessionsError);
      return;
    }

    setFocusSessions(sessions ?? []);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      getTasks();
      getFocusHistory();
    };

    fetchTasks();
  }, [getFocusHistory]);

  const filteredTasks = userTasks.filter((task) => task.status !== "completed");

  // analisis
  function formatFocusTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  const focusHistory = focusSessions.map((session) => ({
    ...session,
    taskTitle:
      userTasks.find((task) => task.id === session.task_id)?.title ??
      "Deleted Task",
  }));

  return (
    <div className="flex min-h-screen w-full flex-col justify-between md:flex-row">
      <SideBar />
      <div className="min-w-0 w-full p-4">
        {/* header */}
        <div className="border-b border-[#292936] pb-4 flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Focus Timer</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center gap-4">
              <IoMdNotificationsOutline size={25} className="cursor-pointer" />
            </div>
            <div>
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-500" />
            </div>
          </div>
        </div>
        <div>
          <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-slate-100">
                Choose your focus task
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Select one task to dedicate your focus session to.
              </p>
            </div>

            <FocusDropdown
              disabled={isSessionActive}
              value={selectedTaskId}
              onChange={setSelectedTaskId}
              tasks={filteredTasks}
            />
          </div>

          {!isLoadingSession && (
            <FocusTimer
              key={activeSession?.id ?? selectedTaskId}
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              setIsSessionActive={setIsSessionActive}
              activeSession={activeSession}
              onSessionChange={getFocusHistory}
            />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-100 mt-4">Analysis:</h2>
          <div className="mt-6 min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-white">
              Focus Sessions History
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your latest 10 focus sessions
            </p>

            {focusHistory.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">
                No focus sessions yet.
              </p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-125 text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-sm text-slate-400">
                      <th className="pb-3">Task</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {focusHistory.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-slate-800 text-sm text-slate-200"
                      >
                        <td className="py-4 pr-4">{session.taskTitle}</td>

                        <td className="py-4 pr-4">
                          {formatFocusTime(session.elapsed_seconds)}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={
                              session.status === "completed"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }
                          >
                            {session.status}
                          </span>
                        </td>

                        <td className="py-4">
                          {new Date(session.started_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusPage;
