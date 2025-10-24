import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { type Job as AdminJob } from '@/src/lib/requests/admin';

interface JobManagementProps {
  jobs: AdminJob[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

export default function JobManagement({ jobs, loading, onRefresh }: JobManagementProps) {
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  // Helper function to get company name
  const getCompanyName = (job: AdminJob): string => {
    return job.recruiter?.company_name || 'Unknown Company';
  };

  // Helper function to get posted date
  const getPostedDate = (job: AdminJob): string => {
    return job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Unknown date';
  };

  // Helper function to get applicant count
  const getApplicantCount = (applicants: any): number => {
    if (typeof applicants === 'number') {
      return applicants;
    }
    if (applicants && typeof applicants === 'object') {
      if (applicants.applicant_status_counts) {
        const counts = applicants.applicant_status_counts;
        return counts.pending + counts.selected + counts.shortlisted + counts.not_qualified;
      }
      return 0;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 text-lg">Loading jobs...</div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-gray-500 text-lg">No jobs found</div>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
        <div className="flex space-x-2">
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
          <button className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer flex items-center space-x-2">
            <Download size={18} />
            <span>Export Jobs</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCompanyName(job)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getApplicantCount(job.applicants)} applications
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-white text-green-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPostedDate(job)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
