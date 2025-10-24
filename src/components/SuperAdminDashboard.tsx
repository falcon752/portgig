"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import JobManagement from "./admin/JobManagement";
import NewsletterManagement from "./admin/NewsletterManagement";
import DashboardOverview from "./admin/DashboardOverview";
import UserManagement from "./admin/UserManagement";
import SuperAdminSidebar from "./admin/SuperAdminSidebar";
import SuperAdminHeader from "./admin/SuperAdminHeader";
import UserModal from "./admin/UserModal";
import NewsletterModal from "./admin/NewsletterModal";
import {
  fetchAllUsersAdmin,
  fetchDashboardJobsAdmin,
  sendNewsletterAdmin,
  deleteUserAccountAdmin,
  type User as AdminUser,
  type Job as AdminJob,
  type NewsletterData,
  type AdminUsersData,
  type DashboardJobsData,
} from "@/src/lib/requests/admin";

interface NewsletterSection {
  title: string;
  content: string;
  image: string;
}

interface NewsletterFormData {
  topic: string;
  description: string;
  mainImage: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  recipientType: string;
  sections: NewsletterSection[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

type TabType = "dashboard" | "users" | "jobs" | "newsletter" | "analytics";
type UserFilterType = "ALL" | "CREATORS" | "RECRUITERS";

interface ExtendedUser extends AdminUser {
  userType: "creator" | "recruiter";
}

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [, setSidebarOpen] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showNewsletterModal, setShowNewsletterModal] =
    useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [userFilter, setUserFilter] = useState<UserFilterType>("ALL");

  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [newsletterData, setNewsletterData] = useState<NewsletterFormData>({
    topic: "",
    description: "",
    mainImage: "",
    content: "",
    ctaLink: "",
    ctaText: "",
    recipientType: "ALL",
    sections: [],
  });

  const loadData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, jobsResponse] = await Promise.all([
        fetchAllUsersAdmin(),
        fetchDashboardJobsAdmin(),
      ]);

      const usersData = usersResponse as unknown as AdminUsersData;
      const jobsData = jobsResponse as unknown as DashboardJobsData;

      const allUsers: ExtendedUser[] = [
        ...usersData.creators.map((user: AdminUser) => ({
          ...user,
          userType: "creator" as const,
        })),
        ...usersData.recruiters.map((user: AdminUser) => ({
          ...user,
          userType: "recruiter" as const,
        })),
      ];

      setUsers(allUsers);
      setJobs(jobsData.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "BarChart3" },
    { id: "users", label: "User Management", icon: "Users" },
    { id: "jobs", label: "Job Management", icon: "Briefcase" },
    { id: "newsletter", label: "Newsletter", icon: "Mail" },
    { id: "analytics", label: "Analytics & Metrics", icon: "TrendingUp" },
  ];

  // Helper function to get user statistics
  const getUserStats = () => {
    const creators = users.filter((user) => user.userType === "creator").length;
    const recruiters = users.filter(
      (user) => user.userType === "recruiter"
    ).length;
    return { creators, recruiters, total: creators + recruiters };
  };

  const handleNewsletterSubmit = async (): Promise<void> => {
    const submitPromise = async () => {
      const payload: NewsletterData = {
        newsletterConfig: {
          topic: newsletterData.topic,
          description: newsletterData.description,
          mainImage: newsletterData.mainImage,
          content: newsletterData.content,
          ctaLink: newsletterData.ctaLink,
          ctaText: newsletterData.ctaText,
          sections: newsletterData.sections,
        },
        newsletterRecipient: {
          recipientType: newsletterData.recipientType as
            | "ALL"
            | "ALL_CREATORS"
            | "ALL_RECRUITERS",
        },
      };
  
      console.log('Sending newsletter payload:', JSON.stringify(payload, null, 2));
  
      try {
        const response = await sendNewsletterAdmin(payload);
        console.log('Newsletter sent successfully:', response);
        
        // Increment the sent count in localStorage
        const currentCount = parseInt(
          localStorage.getItem("newsletter_sent_count") || "0",
          10
        );
        localStorage.setItem(
          "newsletter_sent_count",
          (currentCount + 1).toString()
        );
  
        setShowNewsletterModal(false);
        setNewsletterData({
          topic: "",
          description: "",
          mainImage: "",
          content: "",
          ctaLink: "",
          ctaText: "",
          recipientType: "ALL",
          sections: [],
        });
  
        return "Newsletter sent successfully!";
      } catch (error) {
        console.error('Error sending newsletter:', error);
        throw error; 
      }
    };
  
    toast.promise(submitPromise(), {
      loading: "Sending newsletter...",
      success: (message) => message,
      error: (err) =>
        `Failed to send newsletter: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
    });
  };

  const addNewsletterSection = (): void => {
    setNewsletterData((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: "", image: "" }],
    }));
  };

  const updateNewsletterSection = (
    index: number,
    field: keyof NewsletterSection,
    value: string
  ): void => {
    setNewsletterData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const removeNewsletterSection = (index: number): void => {
    setNewsletterData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleEditUser = (user: ExtendedUser): void => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) {
        throw new Error("User not found");
      }

      await deleteUserAccountAdmin(userId, user.userType);

      setUsers((prev: ExtendedUser[]) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const getFilteredUsers = (): ExtendedUser[] => {
    let filtered = users;

    if (userFilter === "CREATORS") {
      filtered = filtered.filter((user) => user.userType === "creator");
    } else if (userFilter === "RECRUITERS") {
      filtered = filtered.filter((user) => user.userType === "recruiter");
    }

    
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.bio_data?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.auth?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const renderContent = (): React.ReactNode => {
    if (loading && users.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            setActiveTab={setActiveTab}
            setShowNewsletterModal={setShowNewsletterModal}
          />
        );
      case "users":
        return (
          <UserManagement
            users={getFilteredUsers()}
            allUsers={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userFilter={userFilter}
            setUserFilter={setUserFilter}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            loading={loading}
            onRefresh={loadData}
          />
        );
      case "jobs":
        return (
          <JobManagement jobs={jobs} loading={loading} onRefresh={loadData} />
        );
      case "newsletter":
        const stats = getUserStats();
        return (
          <NewsletterManagement
            setShowNewsletterModal={setShowNewsletterModal}
            totalCreators={stats.creators}
            totalRecruiters={stats.recruiters}
          />
        );
      case "analytics":
        return (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">
              Analytics Dashboard Coming Soon
            </h3>
          </div>
        );
      default:
        return (
          <DashboardOverview
            setActiveTab={setActiveTab}
            setShowNewsletterModal={setShowNewsletterModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1">
          <SuperAdminHeader
            activeTab={activeTab}
            menuItems={menuItems}
            setSidebarOpen={setSidebarOpen}
          />

          <div className="p-6">{renderContent()}</div>
        </main>
      </div>

      <UserModal
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        currentUser={currentUser}
      />

      <NewsletterModal
        showNewsletterModal={showNewsletterModal}
        setShowNewsletterModal={setShowNewsletterModal}
        newsletterData={newsletterData}
        setNewsletterData={setNewsletterData}
        handleNewsletterSubmit={handleNewsletterSubmit}
        addNewsletterSection={addNewsletterSection}
        updateNewsletterSection={updateNewsletterSection}
        removeNewsletterSection={removeNewsletterSection}
      />
    </div>
  );
};

export default SuperAdminDashboard;
