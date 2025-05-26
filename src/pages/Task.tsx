import React, { useEffect, useState } from "react";
import TaskComponent from "../components/TaskComponent";
import AddTaskModal from "../components/AddTaskModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

export const Task = () => {
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState([]);

 
  const fetchList = async () => {

    try {
      const response = await axios.get(`/tasks/getAll`, {
        withCredentials: true,
      });
    
      setTaskList(response.data);
    } catch (error) {
      console.error("Failed to fetch task list:", error);
    }
  };


  // Load tasks once on component mount
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

      {/* Modal for Adding Task */}
      <AddTaskModal open={showModal} update ={fetchList} onClose={() => setShowModal(false)} onAddSuccess={fetchList} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {taskList.length > 0 ? (
          taskList?.map((task) => (
            <TaskComponent
              key={task.id}
              task={task}
              
              onUpdate={fetchList} // Refresh list after update
            />
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};
