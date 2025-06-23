import {
  Calendar,
  FileText,
  Pause,
  Loader,
  CheckCircle,
  Mail,
  UserCircle,
} from "lucide-react";
import dayjs from "dayjs";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type Leave from "@/interfaces/Leave";
import type User from "@/interfaces/User";



interface LeaveComponentProps {
  leave: Leave;
  onUpdate: () => void;
  employeeName: string;
  employeeEmail: string;
  employeeRole?: string;
  currUser: User;
}

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toFirstCapital = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const LeaveComponent: React.FC<LeaveComponentProps> = ({
  leave,
  onUpdate,
  employeeName,
  employeeEmail,
  employeeRole,
  currUser,
}) => {
  type StatusKey = keyof typeof statusConfig;

  const statusConfig = {
    PENDING: { color: "text-amber-600", bg: "bg-amber-50", icon: Pause },
    APPROVED: { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
    REJECTED: { color: "text-red-600", bg: "bg-red-50", icon: FileText },
    PROCESSING: { color: "text-blue-600", bg: "bg-blue-50", icon: Loader },
  } as const;

  // Normalize status key as uppercase string
  const statusKey = (leave.status?.toUpperCase() ?? "PENDING") as StatusKey;

  const status = statusConfig[statusKey] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const handleAction = async (action: "approve" | "reject"): Promise<void> => {
    try {
      await axios.put(
        `leaves/admin/leave/approve?id=${leave.leaveId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Leave ${action === "approve" ? "approved" : "rejected"} successfully`);
      onUpdate();
    }catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
   const err = error as { response?: { data?: { message?: string } } };
    
  const serverMessage = err.response?.data?.message ?? 'Server error occurred';
  toast.error(serverMessage);
  } else {
    toast.error('An unknown error occurred');
  }
}
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r from-sky-100 to-sky-200`}></div>

        <div className="p-6">
          {/* Header with employee info */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{toTitleCase(employeeName)}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <span>{toFirstCapital(employeeEmail)}</span>
              </div>
              {employeeRole && (
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <UserCircle size={16} className="text-green-600" />
                  <span className="italic text-gray-700">{toFirstCapital(employeeRole)}</span>
                </div>
              )}
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 mt-3 rounded-lg ${status.bg} ${status.color} text-sm font-medium`}
            >
              <StatusIcon
                size={16}
                className={leave.status === "PROCESSING" ? "animate-spin" : ""}
              />
              {leave.status?.replace("_", " ") ?? "UNKNOWN"}
            </div>
          </div>

          {/* Reason */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            <strong>Reason:</strong> {leave.reason}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Start Date</p>
                <p className="text-sm font-semibold text-gray-800">
                  {dayjs(leave.startDate).format("DD MMM YYYY")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">End Date</p>
                <p className="text-sm font-semibold text-gray-800">
                  {dayjs(leave.endDate).format("DD MMM YYYY")}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {leave.status === "PENDING" && currUser.role === "admin" && (
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow"
                onClick={() => handleAction("approve")}
              >
                Accept
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow"
                onClick={() => handleAction("reject")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveComponent;
