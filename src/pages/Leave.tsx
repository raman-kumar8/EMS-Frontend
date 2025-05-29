import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import AddLeaveModal from "../components/AddLeaveModal";

export const Leave = () => {
  const [showModal, setShowModal] = useState(false);
  const [leaveList, setLeaveList] = useState([]);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`/leaves/getAll`, {
        withCredentials: true,
      });
      setLeaveList(response.data);
    } catch (error) {
      console.error("Failed to fetch leave list:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen w-full bg-blue-50 px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-blue-700">Your Leaves</h1>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-xl shadow-md"
          onClick={() => setShowModal(true)}
        >
          + Add Leave
        </Button>
      </div>

      {/* Modal for Adding Leave */}
      <AddLeaveModal open={showModal} update={fetchLeaves} onClose={() => setShowModal(false)} onAddSuccess={fetchLeaves} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {leaveList.length > 0 ? (
          leaveList.map((leave) => (
            <div key={leave.id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-green-900">{leave.type}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${leave.status === "Approved" ? "bg-green-200 text-green-700" : leave.status === "Pending" ? "bg-yellow-200 text-yellow-700" : "bg-red-200 text-red-700"}`}>{leave.status}</span>
              </div>
              <div className="flex justify-between text-xs text-green-500 mb-2">
                <span>From: {leave.from}</span>
                <span>To: {leave.to}</span>
              </div>
              <div className="text-sm text-green-700 mb-2">Reason: {leave.reason}</div>
              <div className="flex gap-2 mt-auto">
                {/* You can add edit/delete buttons here if needed */}
              </div>
            </div>
          ))
        ) : (
          <p>No leaves available</p>
        )}
      </div>
    </div>
  );
};

export default Leave;
