"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Buttons } from "@/src/components/export_components";
import { LoadingSpinner } from "@/src/utils/util_component";
import { fetchCreatorProfileApi } from "@/src/lib/requests/creative-profile";
import { CreatorProfileData } from "@/src/lib/requests/creative-profile"; 

type DateFilter = {
  label: string;
  days: number;
};

const dateFilters: DateFilter[] = [
  { label: "7 Days", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "All Time", days: 0 }, 
];

const ViewedByPage = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<DateFilter>(dateFilters[4]); 

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CreatorProfileData>({
    queryKey: ["creatorProfile"],
    queryFn: async () => {
      const response = await fetchCreatorProfileApi();
      return response.data; 
    },
  });

  const viewHistory = profileData?.profile_views?.view_history || [];

  const filterViewsByDate = (viewHistory: any[]) => {
    if (!viewHistory?.length) return [];
    
    if (selectedPeriod.days === 0) return viewHistory;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - selectedPeriod.days);
    
    return viewHistory.filter(view => {
      const viewDate = new Date(view.viewed_at);
      return viewDate >= cutoffDate;
    });
  };

  const filteredViews = filterViewsByDate(viewHistory);

  // Format time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const viewDate = new Date(dateString);
    const diffInMs = now.getTime() - viewDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return viewDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const handleViewProfile = (viewerId: string | null) => {
    if (viewerId) {
      router.push(`/profile-card/${viewerId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="border-primary w-16 h-16" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">{error?.message || "Failed to load profile views"}</p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bodyMargin text-primary my-20 flex flex-col gap-5">
      {/* Date Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
        {dateFilters.map((filter) => (
          <button
            key={filter.days}
            onClick={() => setSelectedPeriod(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod.days === filter.days
                ? "bg-primary text-white"
                : "bg-gray-200 text-primary hover:bg-gray-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="font-bold lg:text-lg bg-primary text-white rounded-sm flex justify-around py-5">
        <h2>List of people who viewed your profile</h2>
        <h2>{filteredViews.length}</h2>
      </div>

      {/* Views List */}
      <div className="flex flex-col gap-5">
        {filteredViews.length > 0 ? (
          filteredViews.map((view, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-sm px-2 md:px-10 lg:px-20 py-4"
            >
              <div className="flex justify-between items-center flex-wrap w-full gap-4">
                <div className="flex gap-5 items-center min-w-0 flex-1">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0">
                    <Image
                      src="/assets/creativeImage.svg"
                      alt="viewer profile"
                      fill
                      className="object-cover rounded-full"
                      sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h2 className="font-bold text-xs sm:text-sm md:text-lg line-clamp-1">
                      {view.viewer.viewer_name || "Unknown Viewer"}
                    </h2>
                    <p className="text-xs sm:text-sm line-clamp-1 capitalize text-gray-600">
                      {view.recipient_role} {view.viewer.viewer_id ? "" : "• Anonymous"}
                    </p>
                  </div>
                </div>
                
                <h2 className="text-xs sm:text-sm md:text-lg text-center whitespace-nowrap">
                  {getTimeAgo(view.viewed_at)}
                </h2>
                
                <Buttons
                  onClick={() => handleViewProfile(view.viewer.viewer_id)}
                  label={view.viewer.viewer_id ? "View Profile" : "Anonymous"}
                  className={`rounded-sm! text-xs sm:text-sm md:text-lg cursor-pointer ${
                    view.viewer.viewer_id 
                      ? "bg-primary! text-white hover:bg-primary/90!" 
                      : "bg-gray-400! text-white cursor-not-allowed"
                  }`}
                  disabled={!view.viewer.viewer_id}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center">
              <div className="mb-4">
                <Image
                  src="/assets/creative.svg"
                  alt="No views"
                  width={120}
                  height={120}
                  className="mx-auto opacity-50"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Profile Views Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {selectedPeriod.days === 0 
                  ? "You haven't received any profile views yet. Share your profile to get noticed by recruiters and clients!"
                  : `No one has viewed your profile in the last ${selectedPeriod.label.toLowerCase()}. Try sharing your profile on social media or job boards.`
                }
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-400">Tips to get more views:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Complete your profile with a professional photo</li>
                  <li>• Add relevant skills and experience</li>
                  <li>• Share your portfolio on social media</li>
                  <li>• Engage with other creatives and recruiters</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <Buttons
          onClick={() => router.back()}
          label="← Back to Analytics"
          className="bg-primary! text-white px-6 py-2 rounded-lg!"
        />
      </div>
    </main>
  );
};

export default ViewedByPage;