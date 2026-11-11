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
  FiMenu,
  FiX,
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
    href: "/focus",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const navigation = (onNavigate?: () => void) =>
    navItems.map((item) => {
      const Icon = item.icon;

      return (
        <Link
          href={item.href}
          key={item.name}
          onClick={onNavigate}
          className={`${pathname === item.href ? "active" : ""} flex items-center gap-2 rounded-sm p-3 py-2 text-md text-gray-300 transition-all duration-300 hover:bg-white/5`}
        >
          <Icon size={20} />
          <span>{item.name}</span>
        </Link>
      );
    });

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
      <div className="flex h-14 w-full items-center justify-between border-b border-[#292936] bg-[#0c0e1c] px-4 md:hidden">
        <h1 className="text-xl font-bold">SideBar</h1>
        <button
          type="button"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-sidebar"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          className="rounded-md p-2 text-gray-200 transition-colors hover:bg-white/10"
        >
          {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      <div className="hidden h-screen w-60 shrink-0 md:block" />
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-[#292936] bg-[#0c0e1c] p-4 md:flex">
        <h1 className="mb-8 text-2xl font-bold">SideBar</h1>
        <nav className="flex-1 space-y-1">{navigation()}</nav>
        <button
          type="button"
          onClick={handleLogout}
          disabled={btnLoading}
          className="flex items-center gap-2 rounded-sm p-3 py-2 text-left text-md text-red-800 transition-all duration-300 hover:bg-white/5 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiLogOut size={20} />
          <span>{btnLoading ? "Logging out..." : "Logout"}</span>
        </button>

        <div className="mt-4 flex items-center gap-2 rounded-sm border-y-2 border-[#211936] bg-[#19142367] p-2 py-4 shadow-sm shadow-[#8B5CF6]/10">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-500" />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-2">
              <h2 className="truncate">Username</h2>
              <IoIosArrowDown size={20} className="shrink-0" />
            </div>
            <div className="truncate text-xs text-muted-foreground">
              email@example.com
            </div>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/60"
          />
          <aside
            id="mobile-sidebar"
            aria-label="Main navigation"
            className="relative flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-[#292936] bg-[#0c0e1c] p-4 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">SideBar</h2>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-2 text-gray-200 transition-colors hover:bg-white/10"
              >
                <FiX size={22} />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navigation(() => setIsMobileMenuOpen(false))}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              disabled={btnLoading}
              className="mt-4 flex items-center gap-2 rounded-sm p-3 py-2 text-left text-md text-red-800 transition-all duration-300 hover:bg-white/5 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogOut size={20} />
              <span>{btnLoading ? "Logging out..." : "Logout"}</span>
            </button>
            <div className="mt-4 flex items-center gap-2 rounded-sm border-y-2 border-[#211936] bg-[#19142367] p-2 py-4 shadow-sm shadow-[#8B5CF6]/10">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-500" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <h3 className="truncate">Username</h3>
                  <IoIosArrowDown size={20} className="shrink-0" />
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  email@example.com
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default SideBar;
