"use client";

import { useState } from "react";

type Status = "todo" | "in-progress" | "completed";

const statusOptions = {
  todo: {
    label: "To Do",
    icon: "�",
  },
  "in-progress": {
    label: "In Progress",
    icon: "🟡",
  },
  completed: {
    label: "Completed",
    icon: "🟢",
  },
};

type StatusDropdownProps = {
  value: Status;
  onChange: (value: Status) => void;
};

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: Status) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Button */}
      <label
        className="text-sm font-semibold text-gray-400 mb-1"
        htmlFor="status"
      >
        Status
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-sm border border-gray-800 bg-[#10101743] px-2 py-2 mb-3 text-xs text-white/60 transition hover:bg-[#101017ad]"
      >
        <span className="flex items-center gap-2">
          <span>{statusOptions[value].icon}</span>
          <span>{statusOptions[value].label}</span>
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
          {(Object.keys(statusOptions) as Status[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white transition hover:bg-gray-800"
            >
              <span>{statusOptions[item].icon}</span>

              <span>{statusOptions[item].label}</span>

              {value === item && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
