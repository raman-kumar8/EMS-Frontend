import React, { useState, useEffect } from 'react';


import {
  FileText , Filter, Search,
  AlertCircle, CheckCircle, Loader,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import type Report from '@/interfaces/Report';
import ReportCardAdmin from "@/components/ReportCardAdmin.tsx";



const ReportAdminPage: React.FC = () => {

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');





  const fetchReport = async ()=>{
    try {
      const res = await axios.get(`/reports/report/admin/getAll`, { withCredentials: true });

      const reportsData = res.data as Report[];

      setReports(reportsData);
      setLoading(false)
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const err = error as { response?: { data?: { message?: string } } };

        const serverMessage = err.response?.data?.message ?? 'Server error occurred';
        toast.error(serverMessage);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  }
  useEffect(() => {



    fetchReport();
  }, []);







  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader size={24} className="animate-spin" />
          <span className="text-lg font-medium">Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports Dashboard</h1>
            <p className="text-gray-600">Generate, manage, and download your reports</p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Reports', count: reports.length, icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600' },
            { title: 'Completed', count: reports.filter(r => r.status === 'COMPLETED').length, icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' },
            { title: 'Processing', count: reports.filter(r => r.status === 'PROCESSING').length, icon: Loader, bg: 'bg-blue-100', color: 'text-blue-600' },
            { title: 'Failed', count: reports.filter(r => r.status === 'FAILED').length, icon: AlertCircle, bg: 'bg-red-100', color: 'text-red-600' }
          ].map(({ title, count, icon: Icon, bg, color }) => (
            <div key={title} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={color} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{title}</p>
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report List */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCardAdmin  key={report.reportId}  report={report} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'ALL'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by generating your first report'}
            </p>

          </div>
        )}
      </div>




    </div>
  );
};

export default ReportAdminPage;
