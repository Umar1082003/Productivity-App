import SideBar from "@/components/SideBar";
import Link from "next/link";

export default function Home() {

  return (
    <div className="flex min-h-screen bg-[#0c0e1c]">
      {/* <SideBar /> */}
      <div className="p-5">
        <h1 className="text-2xl font-bold text-white">Welcome to the Productivity App</h1>
        <p className="text-slate-400 mt-2">
          Track your focus time and boost your productivity!
        </p>
      <Link href="/login" className="ml-5 text-blue-600 underline">login</Link>
      <Link href="/signup" className="ml-5 text-blue-600 underline">signup</Link>
      <Link href="/dashboard" className="ml-5 text-blue-600 underline">dashboard</Link>
      <Link href="/tasks" className="ml-5 text-blue-600 underline">task</Link>
      <h1>Productivity App</h1>
      </div>
    </div>
  );
}
