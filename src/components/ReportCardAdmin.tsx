import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Eye,

  AlertCircle,
  Loader, BadgeCheck,
} from "lucide-react";
import dayjs from 'dayjs';
import type User from "@/interfaces/User.tsx";
import toast from "react-hot-toast";
import axios from "axios";

interface Report {
  reportId: string;
  userId: string;
  reportName: string;
  generatedTime?: string;
  summary?: string;
  s3Url?: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING';
  created_at: string;
  updated_at?: string;
  reportTask?: {
    id: string;
    includedTaskNames: string[];
  };
}

const statusConfig = {
  COMPLETED: {
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    icon: CheckCircle,
  },
  PROCESSING: {
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    icon: Loader,
  },
  FAILED: {
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    icon: AlertCircle,
  },
  PENDING: {
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    icon: Clock,
  },
} as const;

interface ReportCardProps {
  report: Report;


}

const ReportCard: React.FC<ReportCardProps> = ({ report  }) => {

 const [name,setName] = useState<string>("");
  const StatusIcon = statusConfig[report.status].icon;
  const status = statusConfig[report.status];

  // Format created_at date
  const createdAt = dayjs(report.created_at).format('DD MMM YYYY, hh:mm A');

  // Format generatedTime if it exists
  const generatedTime = report.generatedTime
    ? dayjs(report.generatedTime, 'HH:mm:ss.SSS').format('hh:mm:ss A') // Added A for AM/PM
    : '';
  const findUserNameById = async (id:string)=>{
    try {
      const response = await  axios.get<User>(`/users/general/id/${id}`)

      return response.data.name.toUpperCase();
    }catch (error: unknown) {
      console.log(error)
      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        const serverMessage = err.response?.data?.message ?? 'Server error occurred';
        toast.error(serverMessage);
      } else {
        toast.error('An unknown error occurred');
      }
    }

  }
  useEffect(() => {
    const getUserName = async () => {
      const name = await findUserNameById(report.userId);
      console.log(name)
      setName(name ?? "User");
    };

    getUserName();
  }, [report.userId]);


  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-start">
        <div className="flex-1 pr-4 flex flex-col items-center justify-center space-x-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 truncate">
            {report.reportName || 'Untitled Report'}
          </h3>
          <div className="flex items-center space-x-6 justify-evenly">
            <h3 className="text-xl text-blue-500 flex space-x-3 items-center justify-center">
              <BadgeCheck/>
               By {name.toUpperCase() ?? 'Name Not Specified'}
            </h3>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border}`}
            >
              <StatusIcon className={`w-4 h-4 ${report.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
              <span className="capitalize">{report.status.toLowerCase()}</span>
            </div>
          </div>
        </div>
        {/* Potentially add more header elements here like a kaba menu etc */}
      </div>

      {/* Summary */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {report.summary ?? 'No summary available for this report.'}
        </p>
      </div>

      {/* Dates & Times */}
      <div className="px-6 py-4 flex flex-wrap justify-between items-center text-xs text-gray-500 border-t border-gray-100">
        <span className="flex items-center gap-2 mb-2 sm:mb-0">
          <Calendar size={15} className="text-gray-400" />
          <span className="text-gray-800 font-medium">Created:</span> {createdAt}
        </span>
        {generatedTime && (
          <span className="flex items-center gap-2 mb-2 sm:mb-0">
            <Clock size={15} className="text-gray-400" />
            <span className="text-gray-800 font-medium">Generated:</span> {generatedTime}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t border-gray-100">
        {report.status === 'COMPLETED' && report.s3Url && (
          <>
            <button
              onClick={() => {
                const cleanUrl = report.s3Url?.replace(/(^"+)|("+$)/g, '') ?? '';
                window.open(cleanUrl, '_blank');
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors duration-200"
            >
              <Eye size={16} />
              View Report
            </button>

            <button
              onClick={async () => {
                try {
                  const cleanUrl = report.s3Url?.replace(/(^"+)|("+$)/g, '') ?? '';
                  const response = await fetch(cleanUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = cleanUrl.split('/').pop() ?? 'report.pdf';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                } catch (e) {
                  console.log(e)
                  alert('Failed to download report.');
                }
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors duration-200"
            >
              <Download size={16} />
              Download
            </button>
          </>
        )}


      </div>
    </div>
  );
};

export default ReportCard;