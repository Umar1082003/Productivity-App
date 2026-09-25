"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Link from "next/link";
// import TaskForm from "@/components/TaskForm";
// import TaskList from "@/components/TaskList";
import SideBar from "@/components/SideBar";

function Dashboard() {
  const [IsNotlogin, setIsNotlogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const router = useRouter();

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

  const handleLogout = async () => {
    setBtnLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      console.log("user logged out");
      router.push("/login");
      setBtnLoading(false);
    }
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
        <div className="flex">
          <SideBar />
        <div className="p-4 w-full">
          {successMsg && (
            <div className="bg-[#10B981] text-white p-2 mb-4 rounded">
              {successMsg}
            </div>
          )}
          <h1>dashboard page</h1>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogout}
            disabled={btnLoading}
          >
            {btnLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
