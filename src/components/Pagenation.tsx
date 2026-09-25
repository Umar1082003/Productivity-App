import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

type TaskListProps = {
  userTasks: {
    id: string;
    title: string;
    description: string | null;
    priority: "high" | "medium" | "low";
    status: "todo" | "in-progress" | "completed";
    // priority: string;
    // status: string;
    due_date: string | null;
    created_at: string;
  }[];
};

function Pagenation({ userTasks }: TaskListProps) {
  return (
    <div className="flex justify-between items-center p-4 border-t border-[#292936] bg-[#111318] text-gray-400">
      <div>Showing 1 to 6 of {userTasks.length} tasks</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
        >
          <IoIosArrowBack size={20} />
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer activePaginationBtn"
        >
          1
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
        >
          2
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
        >
          <IoIosArrowForward size={20} />
        </Button>
      </div>
    </div>
  );
}

export default Pagenation;
