import {
  BadgeCheck,
  Clock,
  Tag,
  Loader,
  Pause,
  CheckCircle,
  MoreVertical,
  Trash2,
  User as UserIcon ,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import toast from "react-hot-toast";
import type User from "@/interfaces/User"
import type Task from "@/interfaces/Task";

dayjs.extend(durationPlugin);

interface TaskComponentProps {
  task: Task;
  onUpdate?: () => void;
}

const TaskAdminComponent: React.FC<TaskComponentProps> = ({ task, onUpdate }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [userName,setUserName] = useState<string>("");
  const priorityConfig: Record<Task["priority"], {
    color: string;
    dot: string;
    gradient: string;
  }> = {
    HIGH: { color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", gradient: "from-red-50 to-red-100" },
    MEDIUM: { color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", gradient: "from-amber-50 to-amber-100" },
    LOW: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", gradient: "from-emerald-50 to-emerald-100" },
  };

  const statusConfig: Record<Task["taskStatus"], {
    color: string;
    bg: string;
    icon: React.ElementType;
    gradient: string;
  }> = {
    PENDING: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: Pause,
      gradient: "from-amber-400 to-orange-500",
    },
    IN_PROGRESS: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: Loader,
      gradient: "from-blue-400 to-indigo-500",
    },
    COMPLETED: {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle,
      gradient: "from-emerald-400 to-green-500",
    },
  };
  const findUserNameById = async (id:string)=>{
    try {
      const response = await  axios.get<User>(`/users/general/id/${id}`)

      return response.data.name.toUpperCase();
    }catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        const serverMessage = err.response?.data?.message ?? 'Server error occurred';
        toast.error(serverMessage);
      } else {
        toast.error('An unknown error occurred');
      }
    }

  }
  useEffect(() => {
    const getUserName = async () => {
      const name = await findUserNameById(task.userId);
      setUserName(name ?? "User");
    };

    getUserName();
  }, [task.userId]);
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/tasks/delete/${id}`, { withCredentials: true });
      toast.success("Task Deleted");
      onUpdate?.();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        const serverMessage = err.response?.data?.message ?? 'Server error occurred';
        toast.error(serverMessage);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const StatusIcon = statusConfig[task.taskStatus]?.icon || Pause;

  return (
    <div className="group w-full max-w-2xl mx-auto mb-6 relative">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${priorityConfig[task.priority]?.gradient}`}></div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{task.taskName}</h2>

                <div className="flex items-center gap-2 mt-2">
                  {/* Assigned By Admin */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                    <ShieldCheck size={14} className="text-blue-600" />
                    Assigned by Admin
                  </div>

                  {/* Assigned To User */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-blue-700 border-gray-200">
                    <UserIcon size={14} className="text-gray-600" />
                      <p className="accent-blue-600">Assigned to {userName ?? "User"}</p>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${priorityConfig[task.priority]?.color}`}>
                  <div className={`w-2 h-2 rounded-full ${priorityConfig[task.priority]?.dot}`}></div>
                  {task.priority}
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig[task.taskStatus]?.bg} ${statusConfig[task.taskStatus]?.color} text-sm font-medium`}>
                <StatusIcon size={16} className={task.taskStatus === "IN_PROGRESS" ? "animate-spin" : ""} />
                {task.taskStatus.replace("_", " ")}
              </div>
            </div>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Open task options"
              >
                <MoreVertical size={18} className="text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-28">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">{task.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BadgeCheck size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Title</p>
                <p className="text-sm font-semibold text-gray-800">{task.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Start Time</p>
                <p className="text-sm font-semibold text-gray-800">{task.startTime}</p>
              </div>
            </div>

            {task.endTime && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">End Time</p>
                    <p className="text-sm font-semibold text-gray-800">{task.endTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Duration</p>
                    <p className="text-sm font-semibold text-gray-800">{task.duration}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl sm:col-span-1">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tag size={16} className="text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Tag</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{task.tag.tag}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAdminComponent;
