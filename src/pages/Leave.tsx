import  { useEffect, useState } from "react";
import LeaveComponent from "../components/LeaveComponent";
import AddLeaveModal from "../components/AddLeaveModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.js";

import type Leave from "@/interfaces/Leave.js";


// Type for the enriched leave item
interface EnrichedLeave extends Leave {
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
}

// Admin response structure (if not already defined in your project)
interface AdminUserResponse {
  userDetails: {
    name: string;
    email: string;
    role: string;
  };
  responseListDTOList: Leave[]; // List of leave entries
}

export const Leave = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [leaveList, setLeaveList] = useState<EnrichedLeave[]>([]);

  const fetchLeaveList = async (): Promise<void> => {
    try {
      let allLeaves: EnrichedLeave[] = [];

      if (user?.role === "admin") {
        const response = await axios.get<AdminUserResponse[]>(
          `leaves/admin/getAll`,
          { withCredentials: true }
        );

        
        allLeaves = response.data.flatMap((adminUser) =>
          (adminUser.responseListDTOList || []).map((leave) => ({
            ...leave,
            employeeName: adminUser.userDetails.name,
            employeeEmail: adminUser.userDetails.email,
            employeeRole: adminUser.userDetails.role,
          }))
        );
      } else {
        const response = await axios.get<Leave[]>(
          `leaves/leave/getAll`,
          { withCredentials: true }
        );

        allLeaves = response.data.map((leave) => ({
          ...leave,
          employeeName: user!.name,
          employeeEmail: user!.email,
          employeeRole: user!.role,
        }));
      }

      // Sort PENDING leaves first
      allLeaves.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });

      setLeaveList(allLeaves);
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
    fetchLeaveList();
  }, []);

  return (
    <div className="min-h-screen w-full bg-blue-50 px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-blue-700">Your Leaves</h1>
        <Button
          className="bg-blue-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-xl shadow-md"
          onClick={() => setShowModal(true)}
        >
          + Apply Leave
        </Button>
      </div>

      <AddLeaveModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAddSuccess={fetchLeaveList}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {leaveList.length > 0 ? (
          leaveList.map((leave) => (
            <LeaveComponent
              key={leave.leaveId}
              leave={leave}
              employeeName={leave.employeeName}
              employeeEmail={leave.employeeEmail}
              employeeRole={leave.employeeRole}
              onUpdate={fetchLeaveList}
              currUser={user!}
            />
          ))
        ) : (
          <p>No leave applications found</p>
        )}
      </div>
    </div>
  );
};
