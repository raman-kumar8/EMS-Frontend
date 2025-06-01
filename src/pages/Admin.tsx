import React, { useState } from 'react';
import { Search, Plus, User, FileText, ChevronRight } from 'lucide-react';

const Admin= () => {
  const [searchUserId, setSearchUserId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  const mockUserTasks = {
    userId: 'USER123',
    userName: 'John Doe',
    email: 'john.doe@email.com',
    tasks: [
      { id: 1, title: 'Complete project documentation', status: 'In Progress', dueDate: '2024-06-15' },
      { id: 2, title: 'Review code changes', status: 'Completed', dueDate: '2024-06-10' },
      { id: 3, title: 'Attend team meeting', status: 'Pending', dueDate: '2024-06-20' }
    ]
  };

  const handleSearchTasks = () => {
    if (!searchUserId.trim()) {
      alert('Please enter a User ID');
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockUserTasks);
      setIsSearching(false);
    }, 1000);
  };

  const handleGenerateTasks = () => {
    // Navigate to generate tasks page or open modal
    console.log('Opening task generation interface');
    alert('Task generation feature will be implemented here');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage tasks and monitor user activities</p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Search Tasks Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Search User Tasks</h2>
                <p className="text-gray-600">Find tasks by user ID</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter User ID
                </label>
                <input
                  type="text"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  placeholder="e.g., USER123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearchTasks}
                disabled={isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                {isSearching ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Tasks
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generate Tasks Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Tasks</h2>
                <p className="text-gray-600">Create new tasks for users</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Create and assign new tasks to users across the platform. Set deadlines, priorities, and track progress.
              </p>
              <button
                onClick={handleGenerateTasks}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate New Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Tasks for {searchResults.userName} ({searchResults.userId})
              </h3>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {searchResults.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Tasks:</strong> {searchResults.tasks.length}
              </p>
            </div>

            <div className="space-y-3">
              {searchResults.tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">5,678</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <Plus className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
