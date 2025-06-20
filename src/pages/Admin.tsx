import  { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Users, CheckCircle, Clock, ArrowLeft, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type User from '@/interfaces/User';
import type Leave from '@/interfaces/Leave';
import type Task from '@/interfaces/Task';

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userTasks, setUserTasks] = useState<{ [userId: string]: Task[] }>({});

  const [selectedUser, setSelectedUser] = useState<User | null >(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTaskCount, setActiveTaskCount] = useState<number>(0);
  const [completedTaskCount, setCompletedTaskCount] = useState<number>(0);
  
  // Dynamic leave requests state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState<boolean>(false);


 interface  LeaveRequest {
   responseListDTOList:Leave[],
  userDetails:User,
  userId:string,
 }

  // Fetch leave requests from API
  const fetchLeaveRequests = async () => {
    setLoadingLeaves(true);
    try {
      const response = await axios.get<LeaveRequest[]>('/leaves/admin/getAll', { 
        withCredentials: true 
      });
     
      
      setLeaveRequests(response.data);
    } catch (error) {
       const err = error as { response?: { data?: { message?: string } } };
    
  const serverMessage = err.response?.data?.message || 'Server error occurred';
  toast.error(serverMessage);
     
      setLeaveRequests([]);
    } finally {
      setLoadingLeaves(false);
    }
  };
  interface SummarRespone{
    activeTasks: number,
    completedTasks: number,
    userId:string,
  }

  // Load leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios.get<User[]>(`/users/users/getAll`, { withCredentials: true })
      .then(async (res) => {
        const usersWithCounts = await Promise.all(
          res.data.map(async (user) => {
            try {
              const summaryRes = await axios.get<SummarRespone>(`/tasks/summary/${user.id}`, {
                withCredentials: true,
              });
              
              return {
                ...user,
                activeTasks: summaryRes.data.activeTasks,
                completedTasks: summaryRes.data.completedTasks,
              };
            } catch (err) {
              console.error(`Error fetching task summary for user ${user.id}`, err);
              return { ...user, activeTasks: 0, completedTasks: 0 };
            }
          })
        );
        setUsers(usersWithCounts);
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleUserClick = (user:User) => setSelectedUser(user);
  const handleBackToUsers = () => setSelectedUser(null);
  
  // Updated leave action handler to call actual API endpoints
const handleLeaveAction = async (leaveId:string, action:string) => {
  try {
    const endpoint = action === 'approve' 
      ? `/leaves/admin/leave/approve?id=${leaveId}`
      : `/leaves/admin/leave/reject?id=${leaveId}`;

     await axios.put(endpoint, {}, { withCredentials: true });

   
  } catch (error) {
    console.error(`Error ${action}ing leave request:`, error);
  }
};

useEffect(() => {
  const fetchTasksForUser = async () => {
   
    if (selectedUser && !userTasks[selectedUser.id]) {
      try {
        const res = await axios.get(`/tasks/getByUserId/${selectedUser.id}`, { withCredentials: true });
        setUserTasks(prev => ({
          ...prev,
          [selectedUser.id]: res.data as Task[]
        }));
       
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    }
  };

  fetchTasksForUser();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedUser]);


  const fetchActiveTaskCount = async () => {
    try {
      const response = await axios.get<number>('/tasks/active/count', { withCredentials: true });
   
      setActiveTaskCount(response.data);
    } catch (error) {
      console.error('Error fetching active task count:', error);
    }
  };

  useEffect(() => {
    fetchActiveTaskCount();
  }, []);

  const fetchCompletedTaskCount = async () => {
    try {
      const response = await axios.get<number>('/tasks/completed/count', { withCredentials: true });
    
      setCompletedTaskCount(response.data);
    } catch (error) {
      console.error('Error fetching completed task count:', error);
    }
  };

  useEffect(() => {
    fetchCompletedTaskCount();
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user?.name?.toLowerCase() || '';
      const email = user?.email?.toLowerCase() || '';
      const role = user?.role?.toLowerCase() || '';
      const term = searchTerm.toLowerCase();

      return name.includes(term) || email.includes(term) || role.includes(term);
    });
  }, [searchTerm, users]);

  const getStatusColor = (status:string) => {
    switch ((status || '').toUpperCase()) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'APPROVED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority:string) => {
    switch ((priority || '').toUpperCase()) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Helper to get initials from user name for avatar fallback
  const getInitials = (name:string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[1][0];
  };

  // Helper to format dates from your API response
  const formatDateRange = (startDate:string, endDate:string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return start === end ? start : `${start} - ${end}`;
  };

  // Count pending leaves dynamically
  const pendingLeavesCount = leaveRequests.reduce((total, userRequest) => {
    const pendingCount = userRequest.responseListDTOList?.filter(
      leave => leave.status?.toLowerCase() === 'pending'
    ).length || 0;
    return total + pendingCount;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage tasks and monitor user activities</p>
      </div>

      {/* Stats Cards - Dynamic counts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{activeTaskCount}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedTaskCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
              <p className="text-3xl font-bold text-gray-900">{pendingLeavesCount}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users & Tasks */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {!selectedUser ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600 select-none">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{user.name}</h3>
                      <p className="text-gray-600 truncate">{user.email}</p>
                      <p className="text-sm text-gray-500 truncate">{user.role}</p>
                    </div>
                    <div className="flex space-x-6 text-sm min-w-[120px] justify-end">
                      <div className="text-center">
                        <p className="font-semibold text-blue-600">{user.activeTasks || 0}</p>
                        <p className="text-gray-500">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-green-600">{user.completedTasks || 0}</p>
                        <p className="text-gray-500">Completed</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <button
                onClick={handleBackToUsers}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Users</span>
              </button>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedUser.name}'s Tasks & Reports</h2>
                <p className="text-gray-600">{selectedUser.email} • {selectedUser.role}</p>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {(userTasks[selectedUser.id] || []).map((task:Task) => (
                  <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(task?.taskStatus)}`}>
                        {(task.taskStatus || '').replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Start time: {task.start_time}</span>
                      <span className={`font-medium ${getPriorityColor(task?.priority)}`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

    {/* Sidebar - Only Leave Requests, full height */}
<div className="flex flex-col h-full">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Pending Leave Requests</h3>
      <button
        onClick={fetchLeaveRequests}
        className="text-blue-600 hover:text-blue-800 text-sm"
        disabled={loadingLeaves}
      >
        {loadingLeaves ? 'Loading...' : 'Refresh'}
      </button>
    </div>

    {loadingLeaves ? (
      <div className="text-center py-4">
        <p className="text-gray-500">Loading leave requests...</p>
      </div>
    ) : leaveRequests.length === 0 || leaveRequests.every(userRequest =>
        !userRequest.responseListDTOList?.some((leave: Leave) => leave.status?.toLowerCase() === 'pending')
      ) ? (
      <div className="text-center py-4">
        <p className="text-gray-500">No pending leave requests</p>
      </div>
    ) : (
      <div className="space-y-4">
        {leaveRequests
          .flatMap(userRequest =>
            userRequest.responseListDTOList
              ?.filter(leave => leave.status?.toLowerCase() === 'pending')
              ?.map(leave => ({
                ...leave,
                userDetails: userRequest.userDetails
              })) || []
          )
          .map((request) => (
            <div
              key={request.leaveId}
              className="p-4 border border-gray-300 rounded-lg flex flex-col space-y-2"
            >
              <p><strong>Name:</strong> {request.userDetails?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {request.userDetails?.email || 'N/A'}</p>
              <p><strong>Role:</strong> {request.userDetails?.role || 'N/A'}</p>
              <p><strong>Available Leaves:</strong> {request.userDetails?.leaveCount || 0}</p>
              <p><strong>Dates:</strong> {formatDateRange(request.startDate, request.endDate)}</p>
              <p><strong>Reason:</strong> {request.reason || 'N/A'}</p>
              <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(request.status)} w-fit`}>
                {(request.status || 'PENDING').toUpperCase()}
              </span>

              <div className="flex space-x-4 mt-2">
                <button
                  onClick={async () => {
                    await handleLeaveAction(request.leaveId, 'approve');
                    toast.success('Leave request approved');
                    fetchLeaveRequests();
                  }}
                  className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Check className="mr-1 h-4 w-4" /> Approve
                </button>
                <button
                  onClick={async () => {
                    await handleLeaveAction(request.leaveId, 'reject');
                    toast.success('Leave request rejected');
                    fetchLeaveRequests();
                  }}
                  className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <X className="mr-1 h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default Admin;