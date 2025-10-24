import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  UserCheck,
  UserPlus,
  Mail,
  Download,
  RefreshCw,
  Database,
} from "lucide-react";
import {
  getDashboardStats,
  fetchEmailsByType,
  downloadEmailsAsCSV,
  downloadEmailsAsTXT,
  UserType,
} from "@/src/lib/requests/admin";
import toast from "react-hot-toast";

type TabType = "dashboard" | "users" | "jobs" | "newsletter" | "analytics";

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalRecruiters: number;
  totalCreators: number;
}

interface DashboardOverviewProps {
  setActiveTab: (tab: TabType) => void;
  setShowNewsletterModal: (show: boolean) => void;
}

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

interface AdminAction {
  id: number;
  action: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
}

interface EmailDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailDownloadModal: React.FC<EmailDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<UserType>("ALL_CREATORS");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"csv" | "txt">("csv");

  const userTypeOptions = [
    { value: "WRITER", label: "Writers" },
    { value: "DEVELOPER", label: "Developers" },
    { value: "DESIGNER", label: "Designers" },
    { value: "PHOTOGRAPHER", label: "Photographers" },
    { value: "VIDEOGRAPHER", label: "Videographers" },
    { value: "SOCIAL_MEDIA_MANAGER", label: "Social Media Managers" },
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetchEmailsByType(selectedType);

      if (response.emails.length === 0) {
        toast.error("No emails found for the selected user type.");
        return;
      }

      const filename = `${selectedType.toLowerCase()}_emails.${downloadFormat}`;

      if (downloadFormat === "csv") {
        downloadEmailsAsCSV(response.emails, filename);
      } else {
        downloadEmailsAsTXT(response.emails, filename);
      }

      toast.success(
        `Successfully downloaded ${response.emails.length} emails!`
      );
      onClose();
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download emails. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Download User Emails
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as UserType)}
              className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {userTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Download Format
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center text-black">
                <input
                  type="radio"
                  value="csv"
                  checked={downloadFormat === "csv"}
                  onChange={(e) =>
                    setDownloadFormat(e.target.value as "csv" | "txt")
                  }
                  className="mr-2"
                />
                CSV
              </label>
              <label className="flex items-center text-black">
                <input
                  type="radio"
                  value="txt"
                  checked={downloadFormat === "txt"}
                  onChange={(e) =>
                    setDownloadFormat(e.target.value as "csv" | "txt")
                  }
                  className="mr-2"
                />
                TXT
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  setShowNewsletterModal,
}) => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalRecruiters: 0,
    totalCreators: 0,
    loading: true,
    error: null as string | null,
  });

  const [showEmailModal, setShowEmailModal] = useState(false);

  const loadDashboardData = async () => {
    setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const stats: DashboardStats = await getDashboardStats();

      setDashboardData({
        totalUsers: stats.totalUsers,
        totalJobs: stats.totalJobs,
        totalRecruiters: stats.totalRecruiters,
        totalCreators: stats.totalCreators,
        loading: false,
        error: null,
      });
    } catch (error) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data",
      }));
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats: StatItem[] = [
    {
      title: "Total Users",
      value: dashboardData.loading
        ? "..."
        : dashboardData.totalUsers.toLocaleString(),
      change: "+All Users",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Recruiters",
      value: dashboardData.loading
        ? "..."
        : dashboardData.totalRecruiters.toLocaleString(),
      change: "+Recruiters",
      icon: UserCheck,
      color: "bg-purple-500",
    },
    {
      title: "Total Creators",
      value: dashboardData.loading
        ? "..."
        : dashboardData.totalCreators.toLocaleString(),
      change: "+Creators",
      icon: UserPlus,
      color: "bg-indigo-500",
    },
    {
      title: "Total Jobs",
      value: dashboardData.loading
        ? "..."
        : dashboardData.totalJobs.toLocaleString(),
      change: "+Active Jobs",
      icon: Briefcase,
      color: "bg-green-500",
    },
  ];

  const adminActions: AdminAction[] = [
    {
      id: 1,
      action: "View All Users",
      description: "Manage platform users",
      icon: Users,
      onClick: () => setActiveTab("users"),
    },
    {
      id: 2,
      action: "Manage Jobs",
      description: "View and manage job postings",
      icon: Briefcase,
      onClick: () => setActiveTab("jobs"),
    },
    {
      id: 3,
      action: "Send Newsletter",
      description: "Engage with your community",
      icon: Mail,
      onClick: () => setShowNewsletterModal(true),
    },
    {
      id: 4,
      action: "User Management",
      description: "Delete or manage accounts",
      icon: UserCheck,
      onClick: () => setActiveTab("users"),
    },
    {
      id: 5,
      action: "Download User Emails",
      description: "Export user emails by category",
      icon: Database,
      onClick: () => setShowEmailModal(true),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Super Admin Dashboard
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={loadDashboardData}
            disabled={dashboardData.loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              size={18}
              className={dashboardData.loading ? "animate-spin" : ""}
            />
            <span>Refresh</span>
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center space-x-2 cursor-pointer">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {dashboardData.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-500">⚠️</div>
            <div>
              <h4 className="text-red-800 font-medium">Error Loading Data</h4>
              <p className="text-red-600 text-sm">{dashboardData.error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4"
          >
            <div className={`p-3 rounded-full text-white ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
              <span className="text-green-500 text-sm">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer"
            >
              <div className="p-2 bg-blue-50 rounded-full">
                <action.icon className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{action.action}</h4>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-primary">Boost Engagement</h4>
          <p className="text-sm text-primary">
            Send a new newsletter to your users and keep them engaged.
          </p>
        </div>
        <button
          onClick={() => setShowNewsletterModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Send Newsletter
        </button>
      </div>

      <EmailDownloadModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </div>
  );
};

export default DashboardOverview;
