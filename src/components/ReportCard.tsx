import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  Loader,
} from 'lucide-react';
import dayjs from 'dayjs';

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
  onDelete?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const StatusIcon = statusConfig[report.status].icon;
  const status = statusConfig[report.status];

  // Format created_at date
  const createdAt = dayjs(report.created_at).format('DD MMM YYYY, hh:mm A');

  // Format generatedTime if it exists
  const generatedTime = report.generatedTime
    ? dayjs(report.generatedTime, 'HH:mm:ss.SSS').format('hh:mm:ss A') // Added A for AM/PM
    : '';

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      onDelete?.(report.reportId);
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 truncate">
            {report.reportName || 'Untitled Report'}
          </h3>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border}`}
          >
            <StatusIcon className={`w-4 h-4 ${report.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
            <span className="capitalize">{report.status.toLowerCase()}</span>
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

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this report permanently?')) {
              handleDelete();
            }
          }}
          disabled={isDeleting}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 ${
            isDeleting
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <Trash2 size={16} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ReportCard;