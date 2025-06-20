import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Search, Users, CheckCircle, Clock, ArrowLeft, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type User from '@/interfaces/User';
import type Leave from '@/interfaces/Leave';
import type Task from '@/interfaces/Task';
import LoadingSpinner from '@/components/LoadingSpinner';


interface LeaveRequest {
  responseListDTOList: Leave[];
  userDetails: User;
  userId: string;
}

interface SummaryResponse {
  activeTasks: number;
  completedTasks: number;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userTasks, setUserTasks] = useState<Record<string, Task[]>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState({
    users: false,
    leaves: false,
    leaveAction: false,
  });

  const formatDateRange = useCallback((start: string, end: string) => {
    const s = new Date(start).toLocaleDateString();
    const e = new Date(end).toLocaleDateString();
    return s === e ? s : `${s} – ${e}`;
  }, []);

  const fetchUsersWithSummary = useCallback(async () => {
    setLoading((l) => ({ ...l, users: true }));
    try {
      let { data: usersList } = await axios.get<User[]>('/users/users/getAll', { withCredentials: true });
        usersList = usersList.filter((x)=>x.role==='user');
      const withCounts = await Promise.all(
        usersList.map(async (u) => {
          try {
            const { data } = await axios.get<SummaryResponse>(`/tasks/summary/${u.id}`, {
              withCredentials: true,
            });
            return { ...u, activeTasks: data.activeTasks, completedTasks: data.completedTasks };
          } catch {
            return u;
          }
        })
      );
      setUsers(withCounts);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading((l) => ({ ...l, users: false }));
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const [{ data: act }, { data: comp }] = await Promise.all([
        axios.get<number>('/tasks/active/count', { withCredentials: true }),
        axios.get<number>('/tasks/completed/count', { withCredentials: true }),
      ]);
      setActiveCount(act);
      setCompletedCount(comp);
    } catch {
      toast.error('Failed to load task counts.');
    }
  }, []);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading((l) => ({ ...l, leaves: true }));
    try {
      const { data } = await axios.get<LeaveRequest[]>('/leaves/admin/getAll', { withCredentials: true });
      setLeaveRequests(data);
    } catch {
      toast.error('Failed to load leave requests.');
    } finally {
      setLoading((l) => ({ ...l, leaves: false }));
    }
  }, []);

  const handleLeaveAction = useCallback(
    async (leaveId: string, action: 'approve' | 'reject') => {
      setLoading((l) => ({ ...l, leaveAction: true }));
      try {
        await axios.put(`/leaves/admin/leave/${action}?id=${leaveId}`, {}, { withCredentials: true });
        toast.success(`Leave ${action}d`);
        await fetchLeaveRequests();
      } catch {
        toast.error('Action failed');
      } finally {
        setLoading((l) => ({ ...l, leaveAction: false }));
      }
    },
    [fetchLeaveRequests]
  );

  const fetchTasksForUser = useCallback(
    async (userId: string) => {
      if (userTasks[userId]) return;
      try {
        const { data } = await axios.get<Task[]>(`/tasks/getByUserId/${userId}`, {
          withCredentials: true,
        });
        setUserTasks((prev) => ({ ...prev, [userId]: data }));
      } catch {
        toast.error('Failed to load tasks');
      }
    },
    [userTasks]
  );

  useEffect(() => {
    fetchUsersWithSummary();
    fetchCounts();
    fetchLeaveRequests();
  }, [fetchUsersWithSummary, fetchCounts, fetchLeaveRequests]);

  useEffect(() => {
    if (selectedUser) {
      fetchTasksForUser(selectedUser.id);
    }
  }, [selectedUser, fetchTasksForUser]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const pendingLeaves = useMemo(
    () =>
      leaveRequests
        .flatMap((r) => r.responseListDTOList.map((l) => ({ ...l, user: r.userDetails })))
        .filter((l) => l.status?.toLowerCase() === 'pending'),
    [leaveRequests]
  );

  const badgeColor = (status?: string) =>
    ({
      COMPLETED: 'bg-green-500',
      IN_PROGRESS: 'bg-blue-500',
      PENDING: 'bg-yellow-500',
      APPROVED: 'bg-green-500',
      REJECTED: 'bg-red-500',
    }[(status || '').toUpperCase()] || 'bg-gray-500');

  const priorityColor = (p?: string) =>
    ({
      HIGH: 'text-red-400',
      MEDIUM: 'text-yellow-400',
      LOW: 'text-green-400',
    }[(p || '').toUpperCase()] || 'text-gray-400');

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, tasks & leaves</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Users', count: users.length, icon: <Users className="text-blue-600" /> },
          { label: 'Active Tasks', count: activeCount, icon: <Clock className="text-green-600" /> },
          { label: 'Completed Tasks', count: completedCount, icon: <CheckCircle className="text-purple-600" /> },
          { label: 'Pending Leaves', count: pendingLeaves.length, icon: <Clock className="text-orange-600" /> },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{card.count}</p>
              </div>
              <div className="h-10 w-10">{card.icon}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users list / detail */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200">
          {!selectedUser ? (
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Search users..."
                />
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {loading.users ? (
                  <div className="flex justify-center p-10">
                    <LoadingSpinner />
                  </div>
                ) : (
                  filtered.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-4 hover:border-blue-400 hover:shadow transition cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">
                        {initials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{u.name}</h3>
                        <p className="text-gray-500 truncate">{u.email}</p>
                        <p className="text-sm text-gray-500 truncate">{u.role}</p>
                      </div>
                      <div className="flex space-x-6">
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">{u.activeTasks || 0}</p>
                          <p className="text-gray-500 text-xs">Active</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">{u.completedTasks || 0}</p>
                          <p className="text-gray-500 text-xs">Done</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
              >
                <ArrowLeft className="mr-2" /> Back to Users
              </button>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">{selectedUser.name}</h2>
                <p className="text-gray-500">
                  {selectedUser.email} · {selectedUser.role}
                </p>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {(userTasks[selectedUser.id] ?? []).map((t) => (
                  <div key={t.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{t.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${badgeColor(
                          t.taskStatus
                        )}`}
                      >
                        {t.taskStatus?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-4">
                      <span>Start: {new Date(t.start_time).toLocaleString()}</span>
                      <span className={priorityColor(t.priority)}>{t.priority} Priority</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending leaves */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-h-[600px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Pending Leaves</h3>
              <button
                onClick={fetchLeaveRequests}
                disabled={loading.leaves}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                {loading.leaves ? <LoadingSpinner /> : 'Refresh'}
              </button>
            </div>
            {loading.leaves ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : pendingLeaves.length === 0 ? (
              <p className="text-center text-gray-500 py-10">All clear—no pending requests!</p>
            ) : (
              <div className="space-y-4">
                {pendingLeaves.map((l) => (
                  <div key={l.leaveId} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <p className="font-medium">{l.user.name} ({l.user.role})</p>
                    <p className="text-sm text-gray-500">Email: {l.user.email}</p>
                    <p className="text-sm text-gray-500">Leaves left: {l.user.leaveCount ?? 0}</p>
                    <p className="text-sm text-gray-500">
                      Dates: {formatDateRange(l.startDate, l.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">Reason: {l.reason}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${badgeColor(
                        l.status
                      )}`}
                    >
                      {l.status?.toUpperCase()}
                    </span>
                    <div className="flex space-x-4 mt-3">
                      <button
                        onClick={() => handleLeaveAction(l.leaveId, 'approve')}
                        disabled={loading.leaveAction}
                        className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition"
                      >
                        <Check className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleLeaveAction(l.leaveId, 'reject')}
                        disabled={loading.leaveAction}
                        className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                      >
                        <X className="mr-1" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Task generation placeholder */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Task</h3>
            <p className="text-gray-500">Coming soon…</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
