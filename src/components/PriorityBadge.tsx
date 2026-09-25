type Priority = "high" | "medium" | "low";

interface Props {
  priority: Priority;
}

export default function PriorityBadge({ priority }: Props) {
  const styles = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const labels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${styles[priority]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />

      {labels[priority]}
    </span>
  );
}
