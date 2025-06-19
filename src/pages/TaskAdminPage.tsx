import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Clock,
  Loader,
  CheckCircle,
  Plus,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import TaskComponent from "../components/TaskComponent";
import type Task from "@/interfaces/Task";
import { Button } from "@/components/ui/button";
import AdminTaskModal from "@/components/AdminTaskModal";


const TaskAdminPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
 
  const fetchList = async () => {
    try {
      const res = await axios.get<Task[]>(`/tasks/getAll`, { withCredentials: true });
      setTaskList(res.data);
      console.log(res.data);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "ALL" || task.taskStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const statCards = [
    { title: "Total Tasks", count: taskList.length, icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Pending", count: taskList.filter(t => t.taskStatus === "PENDING").length, icon: Clock, bg: "bg-yellow-100", color: "text-yellow-600" },
    { title: "In Progress", count: taskList.filter(t => t.taskStatus === "IN_PROGRESS").length, icon: Loader, bg: "bg-indigo-100", color: "text-indigo-600" },
    { title: "Completed", count: taskList.filter(t => t.taskStatus === "COMPLETED").length, icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Task </h1>
            <p className="text-gray-600">Create, track, and manage your tasks efficiently</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map(({ title, count, icon: Icon, bg, color }) => (
            <div key={title} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={color} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{title}</p>
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskComponent
                key={task.id}
                task={task}
                onEdit={() => {}}
                onUpdate={fetchList}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "ALL"
                ? "Try adjusting your search or filter criteria"
                : "Add your first task to get started"}
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Add Task
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AdminTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
    
        update={fetchList}
      />
    </div>
  );
};

export default TaskAdminPage;
