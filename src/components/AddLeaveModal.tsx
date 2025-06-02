import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";

const AddLeaveModal = ({ open, onClose, onAddSuccess }) => {
  const initialFormState = {
    reason: "",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(initialFormState);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {

      await axios.post(
        `leaves/leave/apply`
        //http://localhost:8083/api/v1/leave/apply
        ,
        { ...form},
        { withCredentials: true }
      );

      toast.success("Leave applied successfully");
      setForm(initialFormState);
      onAddSuccess?.();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Server validation error:", err.response?.data);
        toast.error("Failed to apply for leave: " + (err.response?.data?.message || err.message));
      } else {
        toast.error("Unexpected error: " + err.message);
      }
    }

  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-700 text-2xl font-semibold">
            Apply for Leave
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Reason</label>
            <Textarea
              placeholder="Enter reason for leave"
              value={form.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Start Date</label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">End Date</label>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            Submit Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveModal;
