import React, { useState, useEffect } from 'react';
import { X, UserCheck, UserX, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateRecruiterStatusAdmin } from '@/src/lib/requests/admin';

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
  status?: "ACTIVE" | "SUSPENDED";
  account_status?: "ACTIVE" | "SUSPENDED";
}

interface UserModalProps {
  showUserModal: boolean;
  setShowUserModal: (show: boolean) => void;
  currentUser: User | null;
  onStatusUpdate?: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ 
  showUserModal, 
  setShowUserModal, 
  currentUser,
  onStatusUpdate 
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"ACTIVE" | "SUSPENDED">("SUSPENDED");

  useEffect(() => {
    const status = currentUser?.account_status || currentUser?.status;
    if (status) {
      setCurrentStatus(status);
    } else {
      setCurrentStatus("SUSPENDED");
    }
  }, [currentUser]);

  if (!showUserModal) return null;

  const getUserName = (user: User | null): string => {
    if (!user) return '';
    return user.bio_data?.full_name || user.bio_data?.user_name || '';
  };

  const getUserEmail = (user: User | null): string => {
    if (!user) return '';
    return user.auth?.email || '';
  };

  const getCompanyName = (user: User | null): string => {
    if (!user || user.userType !== 'recruiter') return '';
    return user.company_info?.company_name || 'Not specified';
  };

  const getUserLocation = (user: User | null): string => {
    if (!user) return '';
    if (user.profile?.location) {
      if (typeof user.profile.location === 'string') {
        return user.profile.location;
      } else if (user.profile.location && typeof user.profile.location === 'object' && 'state' in user.profile.location) {
        return `${user.profile.location.state}, ${user.profile.location.lga}`;
      }
    }
    return 'Not specified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (newStatus: "ACTIVE" | "SUSPENDED") => {
    if (!currentUser || currentUser.userType !== 'recruiter') return;

    setIsUpdatingStatus(true);
    
    const updatePromise = updateRecruiterStatusAdmin(currentUser._id, newStatus);
    
    toast.promise(
      updatePromise,
      {
        loading: `${newStatus === 'ACTIVE' ? 'Activating' : 'Suspending'} recruiter...`,
        success: `Recruiter ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'} successfully!`,
        error: (err: any) => `Failed to update status: ${err?.message || 'Unknown error'}`
      }
    );

    try {
      await updatePromise;
      setCurrentStatus(newStatus);
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Update status error:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!currentUser || currentUser.userType !== 'recruiter') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <button 
              onClick={() => setShowUserModal(false)} 
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">This feature is only available for recruiters.</p>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recruiter Status Management</h3>
          <button 
            onClick={() => setShowUserModal(false)} 
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            aria-label="Close modal"
            disabled={isUpdatingStatus}
          >
            <X size={24} />
          </button>
        </div>

        {/* User Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {getUserName(currentUser)}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {getUserEmail(currentUser)}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Company:</span> {getCompanyName(currentUser)}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Location:</span> {getUserLocation(currentUser)}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Joined:</span> {formatDate(currentUser.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                currentStatus === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentStatus === 'ACTIVE' ? (
                <>
                  <UserCheck size={16} className="mr-1" />
                  Active
                </>
              ) : (
                <>
                  <UserX size={16} className="mr-1" />
                  Suspended
                </>
              )}
            </span>
          </div>
        </div>

        {/* Status Actions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
          <div className="space-y-3">
            {currentStatus !== 'ACTIVE' && (
              <button
                onClick={() => handleStatusUpdate('ACTIVE')}
                disabled={isUpdatingStatus}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdatingStatus ? (
                  <Loader size={18} className="animate-spin mr-2" />
                ) : (
                  <UserCheck size={18} className="mr-2" />
                )}
                {isUpdatingStatus ? 'Updating...' : 'Activate Recruiter'}
              </button>
            )}
            
            {currentStatus !== 'SUSPENDED' && (
              <button
                onClick={() => handleStatusUpdate('SUSPENDED')}
                disabled={isUpdatingStatus}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdatingStatus ? (
                  <Loader size={18} className="animate-spin mr-2" />
                ) : (
                  <UserX size={18} className="mr-2" />
                )}
                {isUpdatingStatus ? 'Updating...' : 'Suspend Recruiter'}
              </button>
            )}
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <div>
              <h4 className="text-blue-800 font-medium text-sm">Status Information</h4>
              <ul className="text-blue-700 text-xs mt-1 space-y-1">
                <li>• <strong>Active:</strong> Recruiter can access their account and post jobs</li>
                <li>• <strong>Suspended:</strong> Recruiter cannot access their account (default for new accounts)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowUserModal(false)}
            disabled={isUpdatingStatus}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;