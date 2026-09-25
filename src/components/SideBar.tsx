"use client";

import Link from "next/link";
import {
  FiGrid,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiTag,
  FiTarget,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

import { IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const navItems = [
  {
    name: "Overview",
    icon: FiGrid,
    href: "/dashboard",
  },
  {
    name: "Tasks",
    icon: FiCheckCircle,
    href: "/tasks",
  },
  {
    name: "Focus",
    icon: FiClock,
    href: "/dashboard/focus",
  },
  {
    name: "Calendar",
    icon: FiCalendar,
    href: "/dashboard/calendar",
  },
  {
    name: "Statistics",
    icon: FiBarChart2,
    href: "/dashboard/statistics",
  },
  {
    name: "Tags",
    icon: FiTag,
    href: "/dashboard/tags",
  },
  {
    name: "Goals",
    icon: FiTarget,
    href: "/dashboard/goals",
  },
  {
    name: "Settings",
    icon: FiSettings,
    href: "/dashboard/settings",
  },
  {
    name: "Help",
    icon: FiHelpCircle,
    href: "/dashboard/help",
  },
  // {
  //   name: "Logout",
  //   icon: FiLogOut,
  //   href: "/dashboard/logout",
  // },
];

function SideBar() {
  const [btnLoading, setBtnLoading] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

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
    <>
      <div className="w-70"></div>
      <div className="fixed left-0 w-60 h-screen bg-[#0c0e1c] p-4 border-r border-[#292936] flex flex-col justify-between">
        <h1 className="text-2xl font-bold mb-8">SideBar</h1>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.name}
              className={`${pathname === item.href ? "active" : ""} flex items-center gap-2 p-3 py-2 text-md text-gray-300 hover:bg-white/5 cursor-pointer rounded-sm transition-all duration-300`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <div
          onClick={handleLogout}
          className={`flex items-center gap-2 p-3 py-2 text-md hover:bg-white/5 text-red-800 hover:text-red-600 cursor-pointer rounded-sm transition-all duration-300`}
        >
          <FiLogOut size={20} />
          <span>{btnLoading ? "Logging out..." : "Logout"}</span>
        </div>
        {/* <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleLogout}
        disabled={btnLoading}
      >
        {btnLoading ? "Logging out..." : "Logout"}
      </button> */}

        <div className="flex gap-2 border-y-2 border-[#211936] bg-[#19142367] p-2 py-4 mt-4 rounded-sm items-center shadow-sm shadow-[#8B5CF6]/10">
          <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
          <div>
            <div className="flex justify-between">
              <h2>Username</h2>
              <IoIosArrowDown size={20} />
            </div>
            <div className="text-xs text-muted-foreground">
              email@example.com
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
