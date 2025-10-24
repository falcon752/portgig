import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  UserRoundCheck,
  Trash2,
  RefreshCw,
  Users,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteUserAccountAdmin, getDashboardStats } from "@/src/lib/requests/admin";

interface User {
  _id: string;
  auth: {
    email: string;
    provider: string;
  };
  bio_data: {
    full_name: string;
    user_name?: string;
  };
  company_info?: {
    company_name: string;
    about_us?: string;
  };
  profile?: {
    phone_number?: string;
    industry?: string;
    location?: string | {
      state: string;
      lga: string;
      _id: string;
    };
    social_links?: {
      twitter?: string;
      instagram?: string;
      website?: string;
      linkedin?: string;
    };
    years_of_experience?: string;
    field?: string;
  };
  rating: number;
  ratings: any[];
  created_at: string;
  updated_at: string;
  __v: number;
  resume?: any;
  profile_views?: any;
  social_clicks?: any;
  userType: "creator" | "recruiter";
}

interface UserManagementProps {
  users: User[];
  allUsers: User[];
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  userFilter: "ALL" | "CREATORS" | "RECRUITERS";
  setUserFilter: React.Dispatch<React.SetStateAction<"ALL" | "CREATORS" | "RECRUITERS">>;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (userId: string) => Promise<void>;
  loading: boolean;
  onRefresh: () => Promise<void>;
}

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalRecruiters: number;
  totalCreators: number;
}

const UserManagement = ({
  users,
  allUsers,
  selectedUsers,
  setSelectedUsers,
  searchQuery,
  setSearchQuery,
  userFilter,
  setUserFilter,
  handleEditUser,
  handleDeleteUser,
  loading,
  onRefresh,
}: UserManagementProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [freshStats, setFreshStats] = useState({ creators: 0, recruiters: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchFreshStats();
  }, []);

  const fetchFreshStats = async () => {
    setStatsLoading(true);
    try {
      const stats: DashboardStats = await getDashboardStats();
      setFreshStats({
        creators: stats.totalCreators,
        recruiters: stats.totalRecruiters,
        total: stats.totalUsers
      });
    } catch (error) {
      console.error('Error fetching fresh stats:', error);
      const localStats = getUserStats();
      setFreshStats(localStats);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);

    const deletePromise = deleteUserAccountAdmin(userToDelete._id, userToDelete.userType);

    toast.promise(
      deletePromise,
      {
        loading: 'Deleting user account...',
        success: 'User account deleted successfully!',
        error: (err: any) => `Failed to delete user: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      }
    );

    try {
      await deletePromise;
      handleDeleteUser(userToDelete._id);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Delete user error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedUsers.length} selected user(s)? This action cannot be undone and these users will lose their accounts permanently.`;

    const confirmed = await new Promise((resolve) => {
      toast((t: any) => (
        <div className="flex flex-col space-y-3">
          <div className="text-sm text-gray-700">{confirmMessage}</div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 cursor-pointer"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 cursor-pointer"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: 10000,
        position: 'top-center',
      });
    });

    if (confirmed) {
      setDeleting(true);
      let deletedCount = 0;
      let failedCount = 0;

      const deletePromises = selectedUsers.map(async (userId) => {
        try {
          const user = sortedUsers.find(u => u._id === userId);
          if (!user) {
            throw new Error('User not found in local data');
          }
          if (user.auth.email === 'portgigacademy@gmail.com' && user.userType === 'recruiter') {
            throw new Error('Cannot delete super admin account');
          }
          await deleteUserAccountAdmin(userId, user.userType);
          handleDeleteUser(userId);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete user ${userId}:`, error);
          failedCount++;
          throw error;
        }
      });

      toast.promise(
        Promise.allSettled(deletePromises),
        {
          loading: `Deleting ${selectedUsers.length} user(s)...`,
          success: () => {
            setSelectedUsers([]);
            if (failedCount === 0) {
              return `Successfully deleted ${deletedCount} user(s)`;
            } else {
              return `Deleted ${deletedCount} user(s), ${failedCount} failed`;
            }
          },
          error: () => `Failed to delete users. ${deletedCount} succeeded, ${failedCount} failed`
        }
      );

      try {
        await Promise.allSettled(deletePromises);
      } catch {
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = sortedUsers.find(u => u._id === userId);
    if (user?.auth.email === 'portgigacademy@gmail.com' && user.userType === 'recruiter') {
      return; // Prevent selecting super admin
    }
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectableUsers = sortedUsers
        .filter(user => !(user.auth.email === 'portgigacademy@gmail.com' && user.userType === 'recruiter'))
        .map(user => user._id);
      setSelectedUsers(selectableUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const getUserStats = () => {
    const creators = allUsers.filter(user => user.userType === 'creator').length;
    const recruiters = allUsers.filter(user => user.userType === 'recruiter').length;
    return { creators, recruiters, total: creators + recruiters };
  };

  const stats = freshStats;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserDisplayName = (user: User) => {
    return user.bio_data?.full_name || user.bio_data?.user_name || 'Unknown User';
  };

  const getUserLocation = (user: User) => {
    if (user.profile?.location) {
      if (typeof user.profile.location === 'string') {
        return user.profile.location;
      } else if (user.profile.location && typeof user.profile.location === 'object' && 'state' in user.profile.location) {
        return `${user.profile.location.state}, ${user.profile.location.lga}`;
      }
    }
    return 'Not specified';
  };

  const getCompanyName = (user: User) => {
    if (user.userType === 'recruiter' && user.company_info?.company_name) {
      return user.company_info.company_name;
    }
    return '-';
  };

  const sortedUsers = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">
            Manage {statsLoading ? '...' : stats.total} users (
            {statsLoading ? '...' : stats.creators} creators,
            {statsLoading ? '...' : stats.recruiters} recruiters)
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchFreshStats}
            disabled={statsLoading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={18} className={statsLoading ? 'animate-spin' : ''} />
            <span>Refresh Stats</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Users</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-semibold">
                {statsLoading ? '...' : stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <UserPlus className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Creators</p>
              <p className="text-xl font-semibold">
                {statsLoading ? '...' : stats.creators}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <UserCheck className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recruiters</p>
              <p className="text-xl font-semibold">
                {statsLoading ? '...' : stats.recruiters}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 border text-black rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value as "ALL" | "CREATORS" | "RECRUITERS")}
            className="appearance-none bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="ALL">All Users</option>
            <option value="CREATORS">Creators Only</option>
            <option value="RECRUITERS">Recruiters Only</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading && users.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}

      {!loading || users.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedUsers.length === sortedUsers
                          .filter(user => !(user.auth.email === 'portgigacademy@gmail.com' && user.userType === 'recruiter'))
                          .length && sortedUsers.length > 0
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Company/Industry
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleUserSelect(user._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={deleting || (user.auth.email === 'portgigacademy@gmail.com' && user.userType === 'recruiter')}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {getUserDisplayName(user)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.auth.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.userType === 'creator'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {user.userType === 'creator' ? 'Creator' : 'Recruiter'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.userType === 'recruiter'
                          ? getCompanyName(user)
                          : user.profile?.industry || 'Not specified'
                        }
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {getUserLocation(user)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {user.auth.email === 'portgigacademy@gmail.com' && user.userType === 'recruiter' ? (
                          <span className="text-gray-500 text-sm">Super Admin</span>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            {user.userType === 'recruiter' && (
                              <button
                                className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                                title="Manage Status"
                                onClick={() => handleEditUser(user)}
                                disabled={deleting}
                              >
                                <UserRoundCheck size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                              title="Delete User"
                              disabled={deleting}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      {searchQuery || userFilter !== 'ALL'
                        ? 'No users match your search criteria'
                        : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Export Selected
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={deleting}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Are you sure you want to delete this user account?
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getUserDisplayName(userToDelete)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {userToDelete.auth.email}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      userToDelete.userType === 'creator'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {userToDelete.userType === 'creator' ? 'Creator' : 'Recruiter'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="text-red-500 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="text-red-800 font-medium text-sm">Warning</h4>
                    <p className="text-red-700 text-sm mt-1">
                      This user will permanently lose their account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;