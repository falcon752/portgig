import React, { useState, useEffect } from "react";
import { Mail, UserCheck, UserPlus, RefreshCw } from "lucide-react";
import { getDashboardStats } from "@/src/lib/requests/admin";

interface NewsletterManagementProps {
  setShowNewsletterModal: (show: boolean) => void;
  totalCreators: number;
  totalRecruiters: number;
}

const NEWSLETTER_STORAGE_KEY = "newsletter_sent_count";

const NewsletterManagement = ({
  setShowNewsletterModal,
  totalCreators,
  totalRecruiters,
}: NewsletterManagementProps) => {
  const [sentCount, setSentCount] = useState(0);
  const [actualCreators, setActualCreators] = useState(totalCreators);
  const [actualRecruiters, setActualRecruiters] = useState(totalRecruiters);
  const [refreshing, setRefreshing] = useState(false);

  // Load sent count from localStorage on component mount
  useEffect(() => {
    const savedCount = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (savedCount) {
      setSentCount(parseInt(savedCount, 10));
    }
    refreshStats(); 
  }, []);

  const refreshStats = async () => {
    setRefreshing(true);
    try {
      const stats = await getDashboardStats();
      setActualCreators(stats.totalCreators);
      setActualRecruiters(stats.totalRecruiters);
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Newsletter Management
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={refreshStats}
            disabled={refreshing}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
          </button>
          <button
            onClick={() => setShowNewsletterModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center space-x-2 cursor-pointer"
          >
            <Mail size={18} />
            <span>Create Newsletter</span>
          </button>
        </div>
      </div>

      {/* Stats info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="text-blue-500">ℹ️</div>
          <div>
            <p className="text-sm text-blue-800">
              Data from the database are automatically refreshed. Current
              numbers: {actualCreators} creators and {actualRecruiters}{" "}
              recruiters.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Creators
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {refreshing ? "..." : actualCreators.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Recruiters
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {refreshing ? "..." : actualRecruiters.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Newsletters Sent
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {sentCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Preview/Template */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Newsletter Preview
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Create a new newsletter to see preview here
          </p>
          <button
            onClick={() => setShowNewsletterModal(true)}
            className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
          >
            Create Newsletter
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManagement;
