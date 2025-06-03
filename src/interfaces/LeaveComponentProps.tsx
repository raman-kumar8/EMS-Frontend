import type Leave from "./Leave";

export default interface LeaveComponentProps {
  leave: Leave;
  onUpdate: () => void;
  employeeName: string;
  employeeEmail: string;
  employeeRole?: string;
  currUser?: unknown;
}
