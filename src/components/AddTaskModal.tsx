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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
  update: () => void;
}

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

interface TaskFormState {
  taskName: string;
  description: string;
  title: string;
  taskStatus: TaskStatus;
  priority: TaskPriority;
  taskTag: string;
  startTime: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onTaskAdded,
  update,
}) => {
  const initialFormState: TaskFormState = {
    taskName: "",
    description: "",
    title: "",
    taskStatus: "PENDING",
    priority: "MEDIUM",
    taskTag: "",
    startTime: dayjs().format("HH:mm:ss"),
  };

  const [form, setForm] = useState<TaskFormState>(initialFormState);

  const handleChange = (key: keyof TaskFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const findUserId = await axios.get<string>(`/users/general/validate`, {
        withCredentials: true,
      });
      const userId = findUserId.data;

      await axios.post(
        `tasks/add`,
        { ...form, userId, startTime: dayjs().format("HH:mm:ss") },
        { withCredentials: true }
      );

      onTaskAdded?.();
      onClose();
      update();
      toast.success("Task Added Successfully");
      setForm(initialFormState);
    } catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;
    toast.error(message);
  } else {
    toast.error('An unknown error occurred');
  }
}
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-700 text-2xl font-semibold">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Task Name</label>
            <Input
              placeholder="Enter task name"
              value={form.taskName}
              onChange={(e) => handleChange("taskName", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Description</label>
            <Textarea
              placeholder="Write task description..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Title</label>
            <Input
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Tag</label>
            <Input
              placeholder="e.g. Frontend, Backend"
              value={form.taskTag}
              onChange={(e) => handleChange("taskTag", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Priority</label>
            <Select
              value={form.priority}
              onValueChange={(value: TaskPriority) =>
                handleChange("priority", value)
              }
            >
              <SelectTrigger className="bg-white border border-blue-200 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-blue-900">Status</label>
            <Select
              value={form.taskStatus}
              onValueChange={(value: TaskStatus) =>
                handleChange("taskStatus", value)
              }
            >
              <SelectTrigger className="bg-white border border-blue-200 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
