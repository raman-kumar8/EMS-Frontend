import { useState } from "react";
import { Search, User, FileText, CheckCircle } from "lucide-react";

// TypeScript interfaces
interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

interface MockDataType {
  userId: string;
  userName: string;
  email: string;
  tasks: Task[];
}

const Admin = () => {
  const [searchUserId, setSearchUserId] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MockDataType | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Dummy Data for Demo
  const mockData: MockDataType = {
    userId: "USER123",
    userName: "John Doe",
    email: "john.doe@email.com",
    tasks: [
      { id: 1, title: "Submit Monthly Report", status: "In Progress", dueDate: "2025-06-15" },
      { id: 2, title: "Fix Server Issues", status: "Completed", dueDate: "2025-06-10" },
      { id: 3, title: "Plan Team Meeting", status: "Pending", dueDate: "2025-06-20" }
    ]
  };

  const handleSearchTasks = (): void => {
    if (!searchUserId.trim()) {
      alert("Please enter a User ID");
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      setSearchResults(mockData); // Simulate API result
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "In Progress":
        return "bg-blue-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Search className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Search User Tasks</h2>
          </div>

          <input
            type="text"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            placeholder="Enter User ID"
            className="w-full px-3 py-2 border rounded-md mb-3"
          />

          <button
            onClick={handleSearchTasks}
            disabled={isSearching}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition"
          >
            {isSearching ? "Searching..." : "Search Tasks"}
          </button>
        </div>

        {searchResults && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tasks for {searchResults.userName} ({searchResults.userId})
            </h3>
            <div className="space-y-4">
              {searchResults.tasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium text-gray-700">{task.title}</h4>
                    <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-md font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <User className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-800">1,234</p>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-800">5,678</p>
            <p className="text-gray-500 text-sm">Active Tasks</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-800">89</p>
            <p className="text-gray-500 text-sm">Completed Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
