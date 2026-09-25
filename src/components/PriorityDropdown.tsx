"use client";

import { useState } from "react";

type Priority = "high" | "medium" | "low";

const priorities = {
  high: {
    label: "High",
    icon: "🔴",
  },
  medium: {
    label: "Medium",
    icon: "🟡",
  },
  low: {
    label: "Low",
    icon: "🟢",
  },
};

type PriorityDropdownProps = {
  value: Priority;
  onChange: (value: Priority) => void;
};

export default function PriorityDropdown({
  value,
  onChange,
}: PriorityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: Priority) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Button */}
      <label
        className="text-sm font-semibold text-gray-400 mb-1"
        htmlFor="priority"
      >
        Priority
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-sm border border-gray-800 bg-[#10101743] px-2 py-2 mb-3 text-xs text-white/60 transition hover:bg-[#101017ad]"
      >
        <span className="flex items-center gap-2">
          <span>{priorities[value].icon}</span>
          <span>{priorities[value].label}</span>
        </span>

        <span
          className={`transition-transform text-xs text-gray-600 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-lg">
          {(Object.keys(priorities) as Priority[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white transition hover:bg-gray-800"
            >
              <span>{priorities[item].icon}</span>

              <span>{priorities[item].label}</span>

              {value === item && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
