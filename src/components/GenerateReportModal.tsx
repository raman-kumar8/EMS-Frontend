import type Task from "@/interfaces/Task";

import axios from "axios";
import { Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export interface GenerateReportRequest {
  taskIds: string[];
  reportName: string;
  userId: string;
  creationDate: string;
  reportId: string | null;
}

 interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (request: GenerateReportRequest) => void;
  isGenerating: boolean;
  userId: string;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  userId,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [reportName, setReportName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
    }
  }, [isOpen]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(`/tasks/getAll`, {
        withCredentials: true,
      });
      setTasks(response.data);
    }catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;
    toast.error(message);
  } else {
    toast.error('An unknown error occurred');
  }
}
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSubmit = () => {
    if (!selectedTasks.length || !reportName.trim()) {
      setError("Please select at least one task and enter a report name.");
      return;
    }

    const request: GenerateReportRequest = {
      taskIds: selectedTasks,
      reportName: reportName.trim(),
      userId,
      creationDate: new Date().toISOString(),
      reportId: null,
    };
    onGenerate(request);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Report</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tasks
              </label>
              <div className="border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto">
                {tasks.map((task) => (
                  <label
                    key={task.id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                    />
                    <span>{task.taskName || task.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;
