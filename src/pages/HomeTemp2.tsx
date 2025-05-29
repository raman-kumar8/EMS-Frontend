import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Users,
  BarChart3,
  Plus,
  Filter,
  Search,
  MoreVertical,
  PlayCircle,
  PauseCircle,
  User
} from 'lucide-react';

const UserDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data - replace with actual API calls
  const [user] = useState({
    name: 'Ansh Kumar',
    email: 'Ansh@gmail.com',
    avatar: null,
    role: 'Project Manager'
  });

  const [stats] = useState({
    totalTasks: 24,
    completedTasks: 18,
    inProgressTasks: 4,
    pendingTasks: 2,
    overdueTasks: 1,
    productivityScore: 87,
    weeklyProgress: 92,
    averageCompletionTime: '2.4 days'
  });

  const [tasks] = useState([
    {
      id: 1,
      title: 'Complete user authentication module',
      description: 'Implement OAuth and JWT token management',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-05-25',
      completedDate: '2025-05-24',
      project: 'TaskMate App',
      assignee: 'Ansh Kumar',
      timeSpent: '4.5 hours',
      progress: 100
    },
    {
      id: 2,
      title: 'Design dashboard wireframes',
      description: 'Create low-fi wireframes for user dashboard',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2025-05-30',
      project: 'TaskMate App',
      assignee: 'Ansh Kumar',
      timeSpent: '2 hours',
      progress: 65
    },
    {
      id: 3,
      title: 'Code review - API endpoints',
      description: 'Review and test all REST API endpoints',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-05-29',
      project: 'TaskMate App',
      assignee: 'Ansh Kumar',
      timeSpent: '0 hours',
      progress: 0
    },
    {
      id: 4,
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      status: 'overdue',
      priority: 'critical',
      dueDate: '2025-05-26',
      project: 'TaskMate App',
      assignee: 'Ansh Kumar',
      timeSpent: '1 hour',
      progress: 25
    },
    {
      id: 5,
      title: 'Update documentation',
      description: 'Update API documentation with latest changes',
      status: 'in-progress',
      priority: 'low',
      dueDate: '2025-06-02',
      project: 'TaskMate App',
      assignee: 'Ansh Kumar',
      timeSpent: '1.5 hours',
      progress: 40
    }
  ]);

  const [recentActivity] = useState([
    { action: 'Completed task', task: 'Complete user authentication module', time: '2 hours ago' },
    { action: 'Updated progress', task: 'Design dashboard wireframes', time: '4 hours ago' },
    { action: 'Created new task', task: 'Code review - API endpoints', time: '1 day ago' },
    { action: 'Commented on', task: 'Database optimization', time: '2 days ago' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Here's your productivity overview</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productivity Score</p>
                <p className="text-3xl font-bold text-purple-600">{stats.productivityScore}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Tasks
              </button>
              <button
                onClick={() => setSelectedTab('productivity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'productivity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Productivity
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Progress Overview */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Weekly Progress</span>
                        <span>{stats.weeklyProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stats.weeklyProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Task Completion Rate</span>
                        <span>{Math.round((stats.completedTasks / stats.totalTasks) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Avg. Completion Time</p>
                      <p className="text-xl font-semibold text-gray-800">{stats.averageCompletionTime}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Overdue Tasks</p>
                      <p className="text-xl font-semibold text-red-600">{stats.overdueTaskss}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-medium">{activity.action}</span> "{activity.task}"
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'tasks' && (
              <div>
                {/* Task Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Task
                  </button>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-800">{task.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.timeSpent}
                            </span>
                            <span>{task.project}</span>
                          </div>
                          {task.status !== 'completed' && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.status === 'in-progress' ? (
                            <button className="p-2 text-gray-400 hover:text-blue-600">
                              <PauseCircle className="w-5 h-5" />
                            </button>
                          ) : task.status === 'pending' ? (
                            <button className="p-2 text-gray-400 hover:text-green-600">
                              <PlayCircle className="w-5 h-5" />
                            </button>
                          ) : null}
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'productivity' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Productivity Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Productivity Metrics</h3>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">Overall Score</h4>
                        <span className="text-2xl font-bold text-blue-600">{stats.productivityScore}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.productivityScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Excellent! You're performing above average.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{stats.completedTasks}</div>
                        <div className="text-sm text-gray-600">Tasks Completed</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">{stats.inProgressTasks}</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Insights & Tips</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        <h5 className="font-medium text-green-800">Great Progress!</h5>
                      </div>
                      <p className="text-sm text-green-700">
                        You've completed 75% of your tasks this week. Keep up the excellent work!
                      </p>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                        <h5 className="font-medium text-yellow-800">Attention Needed</h5>
                      </div>
                      <p className="text-sm text-yellow-700">
                        You have 1 overdue task. Consider prioritizing it to stay on track.
                      </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex items-center mb-2">
                        <Target className="w-5 h-5 text-blue-600 mr-2" />
                        <h5 className="font-medium text-blue-800">Productivity Tip</h5>
                      </div>
                      <p className="text-sm text-blue-700">
                        Your average completion time is 2.4 days. Try breaking larger tasks into smaller chunks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;