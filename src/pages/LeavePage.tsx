import { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, AlertCircle, Clock, FileText, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import AddLeaveModal from "../components/AddLeaveModal";
import LeaveComponent from "../components/LeaveComponent";
import { useAuth } from "../context/AuthContext";

import type Leave from "@/interfaces/Leave";

// Enriched leave with user details
interface EnrichedLeave extends Leave {
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
}

// Admin response structure
interface AdminUserResponse {
  userDetails: {
    name: string;
    email: string;
    role: string;
  };
  responseListDTOList: Leave[];
}

const LeavePage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [leaveList, setLeaveList] = useState<EnrichedLeave[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchLeaveList = async () => {
    try {
      let allLeaves: EnrichedLeave[] = [];

      if (user?.role === "admin") {
        const res = await axios.get<AdminUserResponse[]>(`leaves/admin/getAll`, { withCredentials: true });
        allLeaves = res.data.flatMap((adminUser) =>
          (adminUser.responseListDTOList || []).map((leave) => ({
            ...leave,
            employeeName: adminUser.userDetails.name,
            employeeEmail: adminUser.userDetails.email,
            employeeRole: adminUser.userDetails.role,
          }))
        );
      } else {
        const res = await axios.get<Leave[]>(`leaves/leave/getAll`, { withCredentials: true });
        allLeaves = res.data.map((leave) => ({
          ...leave,
          employeeName: user!.name,
          employeeEmail: user!.email,
          employeeRole: user!.role,
        }));
      }

      // Prioritize PENDING
      allLeaves.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });

      setLeaveList(allLeaves);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchLeaveList();
  }, []);

  const filteredLeaves = leaveList.filter((leave) => {
    const matchesSearch =
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || leave.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statCards = [
    { title: "Total Leaves", count: leaveList.length, icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Approved", count: leaveList.filter(l => l.status === "APPROVED").length, icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" },
    { title: "Pending", count: leaveList.filter(l => l.status === "PENDING").length, icon: Clock, bg: "bg-yellow-100", color: "text-yellow-600" },
    { title: "Rejected", count: leaveList.filter(l => l.status === "REJECTED").length, icon: AlertCircle, bg: "bg-red-100", color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Leave Dashboard</h1>
            <p className="text-gray-600">Track, apply, and manage your leaves</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Apply Leave
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
                placeholder="Search leaves by reason or employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leave List */}
        {filteredLeaves.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeaves.map((leave) => (
              <LeaveComponent
                key={leave.leaveId}
                leave={leave}
                employeeName={leave.employeeName}
                employeeEmail={leave.employeeEmail}
                employeeRole={leave.employeeRole}
                onUpdate={fetchLeaveList}
                currUser={user!}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No leave applications found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "ALL"
                ? "Try adjusting your search or filter criteria"
                : "Apply for your first leave"}
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Apply Leave
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddLeaveModal open={showModal} onClose={() => setShowModal(false)} onAddSuccess={fetchLeaveList} />
    </div>
  );
};

export default LeavePage;
