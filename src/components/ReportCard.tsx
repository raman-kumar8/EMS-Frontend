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
  MoreVertical,

  
} from 'lucide-react';

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

// Mock dayjs functionality (you can replace with real dayjs)
const dayjs = (date: string | Date, format?: string) => {
  const d = format ? new Date(`1970-01-01T${date}Z`) : new Date(date);
  return {
    format: (formatStr: string) => {
      if (formatStr === 'DD MMM YYYY, hh:mm A') {
        return d.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
      if (formatStr === 'hh:mm:ss') {
        return d.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }
      return d.toLocaleDateString();
    },
  };
};

const statusConfig = {
  COMPLETED: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle,
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    shadow: 'shadow-emerald-100',
    pulse: false,
  },
  PROCESSING: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Loader,
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    shadow: 'shadow-blue-100',
    pulse: true,
  },
  FAILED: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    shadow: 'shadow-red-100',
    pulse: false,
  },
  PENDING: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: Clock,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    shadow: 'shadow-amber-100',
    pulse: true,
  },
} as const;



interface ReportCardProps {
  report: Report;
  onDelete?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fixing this line to use the report.status correctly typed
  const StatusIcon = statusConfig[report.status]?.icon ?? Clock;
  

  const statusInfo = statusConfig[report.status] ?? statusConfig.PENDING;
  

  // Format dates
  const createdAtFormatted = dayjs(report.created_at).format('DD MMM YYYY, hh:mm A');
  const generatedTimeFormatted = report.generatedTime
    ? dayjs(report.generatedTime, 'HH:mm:ss.SSS').format('hh:mm:ss')
    : '';

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete?.(report.reportId);
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1 ${statusInfo.shadow}`}
    >
      <div className={`h-1.5 bg-gradient-to-r ${statusInfo.gradient} ${statusInfo.pulse ? 'animate-pulse' : ''}`}></div>

      {report.status === 'PROCESSING' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm z-10 pointer-events-none"></div>
      )}

      <div className="p-8 relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
           

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 truncate">{report.reportName ?? 'Untitled Report'}</h3>
             
              </div>

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} shadow-sm`}
              >
                <StatusIcon
                  size={16}
                  className={`${report.status === 'PROCESSING' ? 'animate-spin' : ''} ${
                    statusInfo.pulse ? 'animate-pulse' : ''
                  }`}
                />
                <span className="capitalize">{report.status.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="relative z-20 pointer-events-auto">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="More actions"
            >
              <MoreVertical size={18} className="text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30">
                {report.status === 'COMPLETED' && report.s3Url && (
                  <>
                    <button
                      onClick={() => {

                        const cleanUrl = report.s3Url?.replace(/(^"+)|("+$)/g, '') ?? '';

                        window.open(cleanUrl, '_blank');
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Eye size={16} />
                      View Report
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          const cleanUrl = report.s3Url?.replace(/(^"+)|("+$)/g, '') ?? '';

                          const response = await fetch(cleanUrl);
                          if (!response.ok) throw new Error('Network response was not ok');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);

                          const a = document.createElement('a');
                          a.href = url;
                          a.download = cleanUrl.split('/').pop() ?? 'report.pdf';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                          setShowDropdown(false);
                        } catch (error) {
                          console.error('Download failed', error);
                          alert('Failed to download file.');
                        }
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Download size={16} />
                      Download
                    </button>

                    <hr className="my-2 border-gray-200" />
                  </>
                )}

                <button
                  disabled={isDeleting}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this report?')) {
                      handleDelete();
                    }
                  }}
                  className={`w-full px-4 py-3 text-left text-sm ${
                    isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'
                  } flex items-center gap-3`}
                >
                  <Trash2 size={16} />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 min-h-[3rem]">
          {report.summary ?? 'No summary available.'}
        </p>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <span>
            <Calendar size={16} className="inline-block mr-1" />
            Created: {createdAtFormatted}
          </span>

          {report.generatedTime && (
            <span>
              <Clock size={16} className="inline-block mr-1" />
              Generated: {generatedTimeFormatted}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
