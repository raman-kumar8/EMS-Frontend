import React, { useEffect, useState } from "react";
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

import type User from "@/interfaces/User";
import AdminAddTaskModal from "./ui/AdminAddTaskModal";

interface AddAdminTaskModalProps {
  open: boolean;
  onClose: () => void;
  update: () => void;
}

const AdminTaskModal: React.FC<AddAdminTaskModalProps> = ({
  open,
  onClose,
  update,
  
}) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    findAllUser();
  }, []);

  const findAllUser = async () => {
    try {
      const response = await axios.get<User[]>(`/users/users/getAll`, {
        withCredentials: true,
      });
      response.data = response.data.filter((data) => data.role === "user");
      setUsers(response.data);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        const serverMessage = err.response?.data?.message || "Server error occurred";
        toast.error(serverMessage);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      console.log(users); // Optional: Implement search filtering here if needed
    } catch (error) {
      
      
        if (typeof error === 'object' && error !== null && 'message' in error) {
          
          const err = error as { response?: { data?: { message?: string } } };
          
        const serverMessage = err.response?.data?.message || 'Server error occurred';
        toast.error(serverMessage);
        } else {
          toast.error('An unknown error occurred');
        }


    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setTaskModalOpen(true);
    onClose();
  };

  const handleTaskModalClose = () => {
    setTaskModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-700 text-2xl font-semibold">
              Assign Task to User
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search user by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {users.length > 0 && (
              <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-blue-100 rounded cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {taskModalOpen && selectedUser && (
        <AdminAddTaskModal
            id={selectedUser.id}
          open={taskModalOpen}
          onClose={handleTaskModalClose}
          update={update}
          onTaskAdded={() => {
            handleTaskModalClose();
            toast.success("Task assigned to user successfully");
          }}
        />
      )}
    </>
  );
};

export default AdminTaskModal;
