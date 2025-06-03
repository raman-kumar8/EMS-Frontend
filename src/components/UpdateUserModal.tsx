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
import axios from "axios";
import toast from "react-hot-toast";

const UpdateUserModal = ({ open, onClose, onUpdateSuccess }) => {
  const initialFormState = {
    name: "",
    email: "",
  };

  const [form, setForm] = useState(initialFormState);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
     // console.log({...form});
      await axios.put(
        `users/users/update`,
        //http://localhost:8080/api/v1/users/update
        { ...form },
        { withCredentials: true }
      );

      toast.success("User updated successfully");
      setForm(initialFormState);
      onUpdateSuccess?.();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;

        // Log the entire response object for full debugging info
        console.error("Server Error Response:", responseData);

        // Try to extract multiple possible fields
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          responseData?.errors?.join(", ") || // for validation errors in array
          JSON.stringify(responseData) ||     // fallback to raw JSON
          err.message;

        toast.error("Failed to update user: " + errorMessage);
      } else {
        console.error("Unexpected Error:", err);
        toast.error("Unexpected error: " + err.message);
      }
    }

  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-green-700 text-2xl font-semibold">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-green-900">New Name</label>
            <Input
              placeholder="Enter new name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-green-900">New Email</label>
            <Input
              placeholder="Enter new email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
