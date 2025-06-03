import React, { useEffect, useState } from "react";
import TaskComponent from "../components/TaskComponent";
import AddTaskModal from "../components/AddTaskModal";
import { Button } from "@/components/ui/button";
import axios from "axios";

import toast from "react-hot-toast";
import type Task from "@/interfaces/Task";

const TaskPage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<Task[]>([]);

  const fetchList = async () => {
    try {
      const response = await axios.get<Task[]>(`/tasks/getAll`, {
        withCredentials: true,
      });
      setTaskList(response.data);
    }catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;
    toast.error(message);
  } else {
    toast.error('An unknown error occurred');
  }
}
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen w-full bg-blue-50 px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-blue-700">Your Tasks</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl shadow-md"
          onClick={() => setShowModal(true)}
        >
          + Add Task
        </Button>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onTaskAdded={fetchList}
        update={fetchList}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {taskList.length > 0 ? (
          taskList.map((task) => (
            <TaskComponent
              key={task.id}
              task={task}
              onEdit={() => {}}
              onUpdate={fetchList}
            />
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
