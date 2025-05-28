import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Dummy user data
const dummyUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Employee",
  phone: "+1 234 567 8901",
  avatar: "https://i.pravatar.cc/150?img=3",
};

// Dummy tasks data
const dummyTasks = [
  {
    id: 1,
    title: "Prepare monthly report",
    status: "In Progress",
    dueDate: "2024-06-15",
    priority: "High",
  },
  {
    id: 2,
    title: "Update client records",
    status: "Pending",
    dueDate: "2024-06-20",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Team meeting",
    status: "Completed",
    dueDate: "2024-06-10",
    priority: "Low",
  },
];

// Dummy quick stats
const dummyStats = {
  tasksCompleted: 12,
  leaveBalance: 8,
  upcomingDeadlines: 2,
};

const HomeTemp = () => {
  // Leave form state
  const [leaveForm, setLeaveForm] = useState({
    type: "",
    from: "",
    to: "",
    reason: "",
  });
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Handle leave form change
  const handleLeaveChange = (key, value) => {
    setLeaveForm((prev) => ({ ...prev, [key]: value }));
  };

  // Handle leave form submit (dummy)
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    setLeaveLoading(true);
    setTimeout(() => {
      setLeaveLoading(false);
      setLeaveSuccess(true);
      setLeaveForm({ type: "", from: "", to: "", reason: "" });
      setTimeout(() => setLeaveSuccess(false), 2000);
    }, 1200);
  };

  // Dummy logout handler
  const handleLogout = () => {
    alert("Logged out (dummy action)");
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Header Section */}
      <header className="bg-white shadow-md py-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-blue-100">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-1">Welcome, {dummyUser.name}!</h1>
          <div className="flex gap-6 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-900">{dummyStats.tasksCompleted}</span>
              <span className="text-xs text-blue-500">Tasks Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-900">{dummyStats.leaveBalance}</span>
              <span className="text-xs text-blue-500">Leave Balance</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-900">{dummyStats.upcomingDeadlines}</span>
              <span className="text-xs text-blue-500">Upcoming Deadlines</span>
            </div>
          </div>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow-md self-start md:self-center" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Responsive grid: user profile, tasks, quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <section className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 flex flex-col items-center">
            <img
              src={dummyUser.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-4 border-4 border-blue-200 object-cover"
            />
            <div className="text-lg font-semibold text-blue-900 mb-1">{dummyUser.name}</div>
            <div className="text-blue-700 mb-1">{dummyUser.email}</div>
            <div className="text-blue-500 mb-1 capitalize">{dummyUser.role}</div>
            <div className="text-blue-400 mb-1">{dummyUser.phone}</div>
            <div className="text-xs text-blue-300">Location: New York, USA</div>
          </section>

          {/* Assigned Tasks Section */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-blue-700">Assigned Tasks</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl shadow-md" onClick={() => alert("Add Task (dummy)")}>+ Add Task</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {dummyTasks.length > 0 ? (
                dummyTasks.map((task) => (
                  <div key={task.id} className="bg-blue-50 rounded-xl p-5 shadow border border-blue-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-blue-900">{task.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${task.status === "Completed" ? "bg-green-200 text-green-700" : task.status === "In Progress" ? "bg-yellow-200 text-yellow-700" : "bg-gray-200 text-gray-700"}`}>{task.status}</span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-500 mb-2">
                      <span>Due: {task.dueDate}</span>
                      <span className={`font-bold ${task.priority === "High" ? "text-red-500" : task.priority === "Medium" ? "text-yellow-600" : "text-green-600"}`}>{task.priority}</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded" onClick={() => alert("Mark as done (dummy)")}>Mark Done</Button>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded" onClick={() => alert("View Task (dummy)")}>View</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-blue-400">No tasks available</p>
              )}
            </div>
          </section>
        </div>

        {/* Leave Application Section */}
        <section className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Apply for Leave</h2>
          <form className="grid gap-6" onSubmit={handleLeaveSubmit}>
            <div>
              <label className="block text-blue-900 font-medium mb-2">Leave Type</label>
              <Input
                placeholder="e.g. Sick, Casual, Earned"
                value={leaveForm.type}
                onChange={(e) => handleLeaveChange("type", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-900 font-medium mb-2">From</label>
                <Input
                  type="date"
                  value={leaveForm.from}
                  onChange={(e) => handleLeaveChange("from", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-blue-900 font-medium mb-2">To</label>
                <Input
                  type="date"
                  value={leaveForm.to}
                  onChange={(e) => handleLeaveChange("to", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-blue-900 font-medium mb-2">Reason</label>
              <Textarea
                placeholder="Reason for leave"
                value={leaveForm.reason}
                onChange={(e) => handleLeaveChange("reason", e.target.value)}
                required
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md mt-2"
              type="submit"
              disabled={leaveLoading}
            >
              {leaveLoading ? "Submitting..." : "Apply"}
            </Button>
            {leaveSuccess && <div className="text-green-600 font-semibold mt-2">Leave application submitted!</div>}
          </form>
        </section>
      </main>
    </div>
  );
};

export default HomeTemp;
