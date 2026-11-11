"use client";

import { useCallback, useEffect, useState, useRef } from "react";
// types
import { TaskType, ActiveFocusSession } from "@/types/TaskType";
// shadn ui
// import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const durations = [15, 25, 45, 60];

function FocusTimer({
  tasks,
  selectedTaskId,
  setIsSessionActive,
  activeSession,
  onSessionChange,
}: {
  tasks: TaskType[];
  selectedTaskId: string;
  setIsSessionActive: (active: boolean) => void;
  activeSession: ActiveFocusSession | null;
  onSessionChange: () => Promise<void>;
}) {
  const [duration, setDuration] = useState(
    activeSession ? activeSession.duration_seconds / 60 : 25,
  );

  const [timeLeft, setTimeLeft] = useState(
    activeSession?.time_left_seconds ?? duration * 60,
  );

  const [isRunning, setIsRunning] = useState(activeSession !== null);

  const [isPaused, setIsPaused] = useState(activeSession?.status === "paused");

  const [sessionId, setSessionId] = useState<string | null>(
    activeSession?.id ?? null,
  );

  const [isStarting, setIsStarting] = useState(false);

  const isCompleting = useRef(false);

  const handleStart = async () => {
    if (selectedTaskId === "") return;

    isCompleting.current = false;
    setTimeLeft(duration * 60);
    setIsStarting(true);

    // get user
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user.id) {
      console.log("Error getting user:", error);
      return;
    }

    const { data: newSession, error: insertError } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: data.user.id,
        task_id: selectedTaskId,
        duration_seconds: duration * 60,
        status: "running",
      })
      .select("id")
      .single();

    if (insertError) {
      console.log("Error creating session:", insertError);
      return;
    }
    console.log("user found", data.user.id);
    console.log("new session", newSession);

    setSessionId(newSession.id);
    setTimeLeft(duration * 60);
    setIsPaused(false);
    setIsRunning(true);
    setIsSessionActive(true);
  };

  const handlePause = async () => {
    if (!sessionId) return;

    const elapsed = duration * 60 - timeLeft;

    const { error } = await supabase
      .from("focus_sessions")
      .update({
        status: "paused",
        elapsed_seconds: elapsed,
        last_resumed_at: null,
      })
      .eq("id", sessionId);

    if (error) {
      console.log(error);
      return;
    }

    setIsPaused(true);
    console.log("paused is done", elapsed);
  };

  const handleResume = async () => {
    if (!sessionId) return;

    const elapsed = duration * 60 - timeLeft;

    const { error } = await supabase
      .from("focus_sessions")
      .update({
        status: "running",
        elapsed_seconds: elapsed,
        last_resumed_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      console.log(error);
      return;
    }

    setIsPaused(false);
    setIsRunning(true);
    console.log("resumed is done & reusume started");
  };

  const handleStop = async () => {
    if (!sessionId) return;

    setIsStarting(false);
    const elapsed = duration * 60 - timeLeft;

    const { error } = await supabase
      .from("focus_sessions")
      .update({
        status: "cancelled",
        elapsed_seconds: elapsed,
        last_resumed_at: null,
        ended_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      console.log("Error stopping session:", error);
      return;
    }

    setIsRunning(false);
    setIsPaused(false);
    setIsStarting(false);
    setTimeLeft(duration * 60);
    setSessionId(null);
    setIsSessionActive(false);
    await onSessionChange();
  };

  const handleComplete = useCallback(async () => {
    if (!sessionId || isCompleting.current) return;

    isCompleting.current = true;

    setIsStarting(false);

    const elapsed = duration * 60;

    const { error } = await supabase
      .from("focus_sessions")
      .update({
        status: "completed",
        elapsed_seconds: elapsed,
        last_resumed_at: null,
        ended_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      console.log("Error completing session:", error);
      isCompleting.current = false;
      return;
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setSessionId(null);
    setIsStarting(false);
    setIsSessionActive(false);

    await onSessionChange();

    isCompleting.current = false;

    alert(" session completed!");
  }, [sessionId, duration, setIsSessionActive, onSessionChange]);

  const handleDurationChange = (minutes: number) => {
    setDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        handleComplete();
      } else {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isRunning, isPaused, handleComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-700/60 bg-[#10182b] p-6 sm:p-8 shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            FOCUS SESSION
          </p>
          <h2 className="text-xl font-semibold text-slate-100 mt-1">
            Focus Timer
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-400/10 px-3 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          {isRunning ? (isPaused ? "Paused" : "Focusing") : "Ready"}
        </div>
      </div>

      {/* Selected Task */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 mb-8">
        <p className="text-xs text-slate-400 mb-1">WORKING ON</p>
        <p className="text-slate-100 font-medium">
          {tasks.find((t) => t.id === selectedTaskId)?.title ||
            "No task selected"}
        </p>
      </div>

      {/* Timer */}

      <div className="flex flex-col items-center mb-8">
        <p className="text-xs tracking-widest text-slate-500 mb-5">
          TIME REMAINING
        </p>

        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#26334d"
              strokeWidth="8"
            />

            {/* Progress Circle */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#6095e8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={
                2 * Math.PI * 88 * (1 - timeLeft / (duration * 60))
              }
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tracking-tight tabular-nums text-slate-100">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>

            <span className="text-xs text-slate-500 mt-2">
              {isPaused ? "PAUSED" : isRunning ? "STAY FOCUSED" : "READY"}
            </span>
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-8">
        <p className="text-sm text-slate-400 mb-3 text-center">
          Session duration
        </p>

        <div className="grid grid-cols-4 gap-2">
          {durations.map((d) => (
            <button
              key={d}
              disabled={isRunning || selectedTaskId === ""}
              onClick={() => handleDurationChange(d)}
              className={`rounded-lg border py-3 text-sm font-medium transition
          ${
            duration === d
              ? "border-blue-400 bg-blue-500/20 text-blue-300"
              : "border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500"
          }
          disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {isRunning ? (
          <>
            <button
              className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-400"
              onClick={isPaused ? handleResume : handlePause}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>

            <button
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/20"
              onClick={handleStop}
            >
              Stop
            </button>
          </>
        ) : (
          <button
            disabled={selectedTaskId === "" || isStarting}
            className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            onClick={handleStart}
          >
            {isStarting
              ? "Starting..."
              : timeLeft === 0
                ? "New Session"
                : "Start Focus"}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-slate-500 mt-5">
        Stay focused. One task at a time.
      </p>
    </div>
  );
}

export default FocusTimer;
