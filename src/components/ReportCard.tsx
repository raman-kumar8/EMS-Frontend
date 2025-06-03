import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  Loader,
  MoreVertical,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
} from 'lucide-react';

// Mock dayjs functionality
const dayjs = (date, format) => {
  const d = format ? new Date(`1970-01-01T${date}Z`) : new Date(date);
  return {
    format: (formatStr) => {
      if (formatStr === 'DD MMM YYYY, hh:mm A') {
        return d.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      if (formatStr === 'hh:mm:ss') {
        return d.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
      return d.toLocaleDateString();
    }
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
};

const typeConfig = {
  WEEKLY_SUMMARY: { 
    icon: TrendingUp, 
    color: 'text-blue-700', 
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    label: 'Weekly Summary'
  },
  MONTHLY_PERFORMANCE: { 
    icon: BarChart3, 
    color: 'text-purple-700', 
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    iconBg: 'bg-purple-500',
    label: 'Monthly Performance'
  },
  PROJECT_ANALYTICS: { 
    icon: PieChart, 
    color: 'text-indigo-700', 
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    iconBg: 'bg-indigo-500',
    label: 'Project Analytics'
  },
  TEAM_INSIGHTS: { 
    icon: Users, 
    color: 'text-emerald-700', 
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-500',
    label: 'Team Insights'
  },
};

const ReportCard = ({ report, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const StatusIcon = statusConfig[report.status]?.icon || Clock;
  const TypeIcon = typeConfig[report.type]?.icon || FileText;
  const statusInfo = statusConfig[report.status] || statusConfig.PENDING;
  const typeInfo = typeConfig[report.type] || typeConfig.WEEKLY_SUMMARY;

  // Format dates
  const createdAtFormatted = dayjs(report.created_at || new Date()).format('DD MMM YYYY, hh:mm A');
  const generatedTimeFormatted = report.generatedTime 
    ? dayjs(report.generatedTime, 'HH:mm:ss.SSS').format('hh:mm:ss')
    : '';

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete?.(report.reportId);
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <div className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1 ${statusInfo.shadow}`}>
      {/* Animated gradient border */}
      <div className={`h-1.5 bg-gradient-to-r ${statusInfo.gradient} ${statusInfo.pulse ? 'animate-pulse' : ''}`}></div>
      
      {/* Glass morphism overlay for processing */}
      {report.status === 'PROCESSING' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm z-10 pointer-events-none"></div>
      )}

      <div className="p-8 relative">
        {/* Header with improved layout */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            {/* Enhanced type icon */}
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${typeInfo.bg} shadow-lg`}>
              <div className={`absolute inset-0 ${typeInfo.iconBg} rounded-2xl opacity-10`}></div>
              <TypeIcon size={24} className={`${typeInfo.color} relative z-10`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {report.reportName || 'Untitled Report'}
                </h3>
                <span className="text-sm text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-lg">
                  {typeInfo.label}
                </span>
              </div>
              
              {/* Enhanced status badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} shadow-sm`}>
                <StatusIcon 
                  size={16} 
                  className={`${report.status === 'PROCESSING' ? 'animate-spin' : ''} ${statusInfo.pulse ? 'animate-pulse' : ''}`} 
                />
                <span className="capitalize">{report?.status?.toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Dropdown menu wrapper with pointer-events-auto and high z-index */}
          <div className="relative z-20 pointer-events-auto">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={18} className="text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30">
                {report.status === 'COMPLETED' && report.s3Url && (
                  <>
                    <button
  onClick={() => {
    const cleanUrl = report.s3Url.replace(/^"+|"+$/g, '');
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
      const cleanUrl = report.s3Url.replace(/^"+|"+$/g, '');
      const response = await fetch(cleanUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = cleanUrl.split('/').pop() || 'report.pdf'; // fallback filename
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

<hr className="my-2 border-gray-100" />

                  </>
                )}
                <button
                  onClick={()=>{
                    handleDelete();
                    setShowDropdown(false);
                  }}
                  disabled={isDeleting}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 disabled:opacity-50"
                >
                  <Trash2 size={16} className={isDeleting ? 'animate-spin' : ''} />
                  {isDeleting ? 'Deleting...' : 'Delete Report'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced description */}
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {report.summary || 'This report provides comprehensive insights and analytics. Click to view detailed findings and recommendations.'}
          </p>
        </div>

        {/* Error message with better styling */}
        {report.status === 'FAILED' && report.error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium text-sm mb-1">Error Details</p>
                <p className="text-red-700 text-sm">{report.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Created</p>
              <p className="text-sm text-gray-900 font-semibold">{createdAtFormatted}</p>
            </div>
          </div>

          {generatedTimeFormatted && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Generated</p>
                <p className="text-sm text-gray-900 font-semibold">{generatedTimeFormatted}</p>
              </div>
            </div>
          )}
        </div>

        {/* Task tags */}
        {report.reportTask?.includedTaskNames && report.reportTask.includedTaskNames.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 font-medium mb-3">Included Tasks</p>
            <div className="flex flex-wrap gap-2">
              {report.reportTask.includedTaskNames.slice(0, 3).map((task, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                >
                  {task}
                </span>
              ))}
              {report.reportTask.includedTaskNames.length > 3 && (
                <span className="inline-block text-xs text-gray-400 px-2 py-1">
                  +{report.reportTask.includedTaskNames.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Report ID (debug/info) */}
        
      </div>
    </div>
  );
};

export default ReportCard;
