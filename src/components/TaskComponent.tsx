import {
  BadgeCheck,
  Clock,
  Tag,
  Loader,
  Pause,
  CheckCircle,
  ChevronDown,
  AlertCircle,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import toast from "react-hot-toast";

import type Task from "@/interfaces/Task";

dayjs.extend(durationPlugin);


interface TaskComponentProps {
  task: Task;
  onUpdate?: () => void;
  onEdit?: (data: {
    id: string;
    status: Task["taskStatus"];
    priority: Task["priority"];
    endTime: string;
  }) => void;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, onUpdate, onEdit }) => {
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localStatus, setLocalStatus] = useState<Task["taskStatus"]>(task.taskStatus);
  const [localPriority, setLocalPriority] = useState<Task["priority"]>(task.priority);
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions: Task["taskStatus"][] = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  const priorityOptions: Task["priority"][] = ["LOW", "MEDIUM", "HIGH"];

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





  const handleUpdate = async (status: Task["taskStatus"], priority: Task["priority"], id: string) => {
    try {
      setUpdating(true);
      const body: { taskStatus: Task["taskStatus"]; priority: Task["priority"]; endTime?: string } = {
        taskStatus: status,
        priority,
      };

      if (status === "COMPLETED") {
        body.endTime = dayjs().format("HH:mm:ss");
      }

      await axios.put(`/tasks/update/${id}`, body);
      setEditMode(false);
      onUpdate?.();
      toast.success("Task Updated");
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error("Failed to update task");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/tasks/delete/${id}`, { withCredentials: true });
      toast.success("Task Deleted");
      onUpdate?.();
    } catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;
    toast.error(message);
  } else {
    toast.error('An unknown error occurred');
  }
}
  };

  const StatusIcon = statusConfig[localStatus]?.icon || Pause;

  return (
    <div className="group w-full max-w-2xl mx-auto mb-6 relative">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${priorityConfig[localPriority]?.gradient}`}></div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{task.taskName}</h2>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${priorityConfig[localPriority]?.color}`}>
                  <div className={`w-2 h-2 rounded-full ${priorityConfig[localPriority]?.dot}`}></div>
                  {localPriority}
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig[localStatus]?.bg} ${statusConfig[localStatus]?.color} text-sm font-medium`}>
                <StatusIcon size={16} className={localStatus === "IN_PROGRESS" ? "animate-spin" : ""} />
                {localStatus.replace("_", " ")}
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
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    onClick={() => {
                      setEditMode(true);
                      setShowDropdown(false);
                      onEdit?.({
                        id: task.id,
                        status: localStatus,
                        priority: localPriority,
                        endTime: task.end_time,
                      });
                    }}
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    onClick={() => {
                      handleDelete(task.id);
                    }}
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
                <p className="text-sm font-semibold text-gray-800">{task.start_time}</p>
              </div>
            </div>

            {task.end_time && (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">End Time</p>
                    <p className="text-sm font-semibold text-gray-800">{task.end_time}</p>
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

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertCircle size={16} className="text-gray-500" />
                Priority:
              </label>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700"
                  value={localPriority}
                  disabled={!editMode || updating}
                  onChange={(e) => setLocalPriority(e.target.value as Task["priority"])}
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((status) => {
                const StatusButtonIcon = statusConfig[status]?.icon || Pause;
                const isActive = status === localStatus;
                const isDisabled = updating || !editMode;

                return (
                  <button
                    key={status}
                    disabled={isDisabled}
                    onClick={() => setLocalStatus(status)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive
                        ? `bg-gradient-to-r ${statusConfig[status]?.gradient} text-white shadow-md`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"}
                      ${isDisabled ? "cursor-not-allowed opacity-75" : "hover:scale-105"}
                    `}
                  >
                    <StatusButtonIcon size={14} className={status === "IN_PROGRESS" && isActive ? "animate-spin" : ""} />
                    {status.replace("_", " ")}
                  </button>
                );
              })}

              {editMode && (
                <button
                  onClick={() => handleUpdate(localStatus, localPriority, task.id)}
                  disabled={updating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  {updating ? (
                    <div className="flex items-center gap-2">
                      <Loader size={14} className="animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              )}
            </div>
          </div>

          {updating && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl pointer-events-none">
              <Loader size={32} className="animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
