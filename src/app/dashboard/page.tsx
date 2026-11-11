"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Link from "next/link";

import { FocusSession } from "@/types/TaskType";

import SideBar from "@/components/SideBar";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatFocusTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

type FocusTask = {
  id: string;
  title: string;
};

function Dashboard() {
  const [IsNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // const [successMsg, setSuccessMsg] = useState("");

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  const [focusTasks, setFocusTasks] = useState<FocusTask[]>([]);

  const router = useRouter();

  // Total Focus Time
  const totalFocusSeconds = focusSessions.reduce(
    (total, session) => total + session.elapsed_seconds,
    0,
  );

  // Completed Sessions
  const completedSessions = focusSessions.filter(
    (session) => session.status === "completed",
  ).length;

  // Today's Focus
  const todayDate = new Date();

  const todayFocusSeconds = focusSessions
    .filter((session) => {
      const sessionDate = new Date(session.started_at);

      return (
        sessionDate.getDate() === todayDate.getDate() &&
        sessionDate.getMonth() === todayDate.getMonth() &&
        sessionDate.getFullYear() === todayDate.getFullYear()
      );
    })
    .reduce((total, session) => total + session.elapsed_seconds, 0);

  // Average Session
  const completedFocusSessions = focusSessions.filter(
    (session) => session.status === "completed",
  );

  const averageSessionSeconds =
    completedFocusSessions.length > 0
      ? Math.round(
          completedFocusSessions.reduce(
            (total, session) => total + session.elapsed_seconds,
            0,
          ) / completedFocusSessions.length,
        )
      : 0;

  // useEffect(() => {
  //   const getSession = async () => {
  //     setSuccessMsg("");
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (session === null) {
  //       setIsNotlogin(true);
  //       console.log("the User is not logged in. Redirecting to login page.");
  //     } else {
  //       setIsNotlogin(false);
  //       setSuccessMsg("Account signed in successfully");
  //       console.log("User is logged in:", session.user);

  //       const { data: sessions, error: sessionsError } = await supabase
  //         .from("focus_sessions")
  //         .select(
  //           "id, task_id, duration_seconds, elapsed_seconds, status, started_at",
  //         )
  //         .eq("user_id", session.user.id)
  //         .in("status", ["completed", "cancelled"]);

  //       console.log("Logged-in User ID:", session.user.id);

  //       if (sessionsError) {
  //         console.log("Error fetching focus sessions:", sessionsError);
  //       } else {
  //         setFocusSessions(sessions ?? []);
  //       }

  //       const { data: tasks, error: tasksError } = await supabase
  //         .from("tasks")
  //         .select("id, title")
  //         .eq("user_id", session.user.id);

  //       if (tasksError) {
  //         console.log("Error fetching tasks:", tasksError);
  //       } else {
  //         setFocusTasks(tasks ?? []);
  //       }
  //     }
  //     setLoading(false);
  //   };
  //   getSession();
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setIsLoadingDashboard(true);

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          if (isMounted) setIsNotLoggedIn(true);
          return;
        }

        if (!isMounted) return;

        setIsNotLoggedIn(false);

        const { data: sessions, error: sessionsError } = await supabase
          .from("focus_sessions")
          .select(
            "id, task_id, duration_seconds, elapsed_seconds, status, started_at",
          )
          .eq("user_id", session.user.id)
          .in("status", ["completed", "cancelled"]);

        if (sessionsError) throw sessionsError;

        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select("id, title")
          .eq("user_id", session.user.id);

        if (tasksError) throw tasksError;

        if (isMounted) {
          setFocusSessions(sessions ?? []);
          setFocusTasks(tasks ?? []);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        if (isMounted) {
          setIsLoadingDashboard(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const weeklyFocusData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - index));

    const dateKey = getLocalDateKey(date);

    const totalSeconds = focusSessions
      .filter((session) => {
        return getLocalDateKey(new Date(session.started_at)) === dateKey;
      })
      .reduce((total, session) => total + session.elapsed_seconds, 0);

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      minutes: Math.round(totalSeconds / 60),
    };
  });

  const taskFocusData = focusTasks
    .map((task) => {
      const totalSeconds = focusSessions
        .filter((session) => session.task_id === task.id)
        .reduce((total, session) => total + session.elapsed_seconds, 0);

      return {
        task: task.title,
        minutes: Math.round(totalSeconds / 60),
      };
    })
    .filter((task) => task.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("Logout error:", error);
        return;
      }

      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      {isLoadingDashboard ? (
        <div className="flex justify-center items-center h-screen font-extrabold text-6xl text-zinc-700">
          <p>Loading...</p>
        </div>
      ) : IsNotLoggedIn ? (
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
        <div className="flex min-h-screen flex-col bg-[#0c0e1c] md:flex-row">
          <SideBar />
          <div className="min-w-0 flex-1 p-2 sm:p-2 lg:p-4">
            {/* {successMsg && (
              <div className="bg-[#10B981] text-white p-2 mb-4 rounded">
                {successMsg}
              </div>
            )} */}
            <h1>dashboard page</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {/* Total Focus Time */}
              <div className="min-w-0 bg-[#090d13] rounded-xl border border-gray-800 p-5 shadow-sm">
                <p className="text-sm text-gray-300">Total Focus Time</p>
                <h2 className="text-2xl font-bold text-gray-100 mt-2">
                  {formatFocusTime(totalFocusSeconds)}
                </h2>
              </div>

              {/* Completed Sessions */}
              <div className="min-w-0 bg-[#090d13] rounded-xl border border-gray-800 p-5 shadow-sm">
                <p className="text-sm text-gray-300">Completed Sessions</p>
                <h2 className="text-2xl font-bold text-gray-100 mt-2">
                  {completedSessions}
                </h2>
              </div>

              {/* Today's Focus */}
              <div className="min-w-0 bg-[#090d13] rounded-xl border border-gray-800 p-5 shadow-sm">
                <p className="text-sm text-gray-300">Today&apos;s Focus</p>
                <h2 className="text-2xl font-bold text-gray-100 mt-2">
                  {formatFocusTime(todayFocusSeconds)}
                </h2>
              </div>

              {/* Average Session */}
              <div className="min-w-0 bg-[#090d13] rounded-xl border border-gray-800 p-5 shadow-sm">
                <p className="text-sm text-gray-300">Average Session</p>
                <h2 className="text-2xl font-bold text-gray-100 mt-2">
                  {formatFocusTime(averageSessionSeconds)}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-semibold text-white">
                  Weekly Focus Activity
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your focus time over the last 7 days
                </p>

                <div className="mt-6 h-64 w-full sm:h-72 lg:h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyFocusData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        unit="m"
                      />

                      <Tooltip
                        cursor={false}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value} min`, "Focus Time"]}
                      />

                      <Bar
                        dataKey="minutes"
                        fill="#6366f1"
                        activeBar={{ fill: "#818cf8" }}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-lg font-semibold text-white">
                  Focus Time by Task
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  See where you spend your focus time
                </p>

                {taskFocusData.length === 0 ? (
                  <p className="text-slate-400 mt-6">
                    No focus data available yet.
                  </p>
                ) : (
                  <div className="mt-6 h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={taskFocusData} layout="vertical">
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#334155"
                          horizontal={false}
                        />

                        <XAxis
                          type="number"
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          unit="m"
                        />

                        <YAxis
                          type="category"
                          dataKey="task"
                          width={120}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          cursor={false}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          formatter={(value) => [`${value} min`, "Focus Time"]}
                        />

                        <Bar
                          dataKey="minutes"
                          fill="#818cf8"
                          activeBar={{ fill: "#a5b4fc" }}
                          radius={[0, 6, 6, 0]}
                          maxBarSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
