type Status = "todo" | "in-progress" | "completed";

interface Props {
  status: Status;
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    todo: "bg-gray-500/10 text-gray-400",
    "in-progress": "bg-purple-500/10 text-purple-400",
    completed: "bg-green-500/10 text-green-400",
  };

  const labels = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />

      {labels[status]}
    </span>
  );
}
