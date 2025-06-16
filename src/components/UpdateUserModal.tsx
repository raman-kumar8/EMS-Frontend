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


interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

interface UserForm {
  name: string;
  email: string;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  open,
  onClose,
  onUpdateSuccess,
}) => {
  const initialFormState: UserForm = {
    name: "",
    email: "",
  };

  const [form, setForm] = useState<UserForm>(initialFormState);

  const handleChange = (key: keyof UserForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `users/users/update`,
        { ...form },
        { withCredentials: true }
      );

      toast.success("User updated successfully");
      setForm(initialFormState);
      onUpdateSuccess?.();
      onClose();
    } catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
   const err = error as { response?: { data?: { message?: string } } };
    
  const serverMessage = err.response?.data?.message || 'Server error occurred';
  toast.error(serverMessage);
  } else {
    toast.error('An unknown error occurred');
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
