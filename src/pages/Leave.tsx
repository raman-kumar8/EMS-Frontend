import React, { useEffect, useState } from "react";
import LeaveComponent from "../components/LeaveComponent";
import AddLeaveModal from "../components/AddLeaveModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export const Leave = () => {
  const {user} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [leaveList, setLeaveList] = useState([]);


  const fetchLeaveList = async () => {
    try {
      let response;
      let allLeaves = [];

      if (user.role === "admin") {
        response = await axios.get(`leaves/admin/getAll`
          //http://localhost:8083/api/v1/admin/getAll
          , {
          withCredentials: true,
        });

        // Flatten each user's leaves and attach their info to each leave
        allLeaves = response.data.flatMap(user =>
          (user.responseListDTOList || []).map(leave => ({
            ...leave,
            employeeName: user.userDetails.name,
            employeeEmail: user.userDetails.email,
            employeeRole: user.userDetails.role
          }))
        );
      } else {
        response = await axios.get(`leaves/leave/getAll`
          //http://localhost:8083/api/v1/leave/getAll
          , {
          withCredentials: true,
        });

        // For normal users, it's already a list of leave entries
        allLeaves = response.data.map(leave => ({
          ...leave,
          employeeName: user.name,
          employeeEmail: user.email,
          employeeRole: user.role
        }));
      }

      // ✅ Sort so that 'pending' leaves come first
      allLeaves.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });

      setLeaveList(allLeaves);
      //console.log("Fetched leave list:", response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        //console.error("Server fetch error:", err.response?.data);
        toast.error("Failed to fetch leave data: " + (err.response?.data?.message || err.message));
      } else {
        toast.error("Unexpected error: " + err.message);
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
              key={leave.leaveId} // ✅ FIXED
              leave={leave}
              employeeName={leave.employeeName} // ✅ FIXED
              employeeEmail={leave.employeeEmail} // ✅ FIXED
              employeeRole={leave.employeeRole} // ✅ FIXED
              onUpdate={fetchLeaveList}
              currUser={user} // ✅ FIXED
            />
          ))
        ) : (
          <p>No leave applications found</p>
        )}
      </div>
    </div>
  );
};
