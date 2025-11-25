"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/src/utils/util_component";
import Link from "next/link";
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
];

const ProfileAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<DateFilter>(dateFilters[2]); 

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
      return response.data; // Extract the data from the response
    },
  });

  const viewHistory = profileData?.profile_views?.view_history || [];

  // Filter view history based on selected period
  const filterViewsByDate = (viewHistory: any[]) => {
    if (!viewHistory?.length) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - selectedPeriod.days);
    
    return viewHistory.filter(view => {
      const viewDate = new Date(view.viewed_at);
      return viewDate >= cutoffDate;
    });
  };

  const filteredViews = filterViewsByDate(viewHistory);
  const filteredViewsCount = filteredViews.length;

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
          <p className="text-red-500 mb-4">{error?.message || "Failed to load profile analytics"}</p>
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
    <section className="text-primary font-raleway">
      {/* Date Filter Buttons */}
      <div className="bodyMargin py-4">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* Header Row with Titles */}
        <div
          className="flex justify-between items-center p-4 mb-4 text-white"
          style={{ backgroundColor: "#00489A" }}
        >
          <h2 className="font-bold text-lg">Profile Analytics</h2>
          <h2 className="font-bold text-lg">Last {selectedPeriod.label}</h2>
        </div>

        <div className="bodyMargin py-6 px-4 sm:px-6">
          {/* Views Row */}
          <div className="flex gap-4">
            <div className="flex flex-col h-18 p-4 justify-center bg-primary rounded-lg text-white flex-1">
              <p className="text-[10px] text-center font-semibold">
                Profile views in {selectedPeriod.label.toLowerCase()}
              </p>
              <h2 className="font-bold text-center text-xl">{filteredViewsCount}</h2>
            </div>

            <Link
              href="/creative-dashboard/viewed-by"
              className="flex flex-col h-18 p-4 justify-center bg-primary rounded-lg text-white flex-1"
            >
              <p className="text-[10px] text-center font-semibold">
                People who viewed your profile
              </p>
              <span className="font-bold text-center text-xl">
                {filteredViewsCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="bodyMargin lg:py-6 lg:px-4 sm:px-6 md:px-12">
        <div className="hidden md:flex md:justify-between md:items-start gap-6">
          {/* Profile Views */}
          <div className="flex flex-col gap-3 w-full md:w-80">
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-center md:text-left md:pb-10">
              Profile Analytics
            </h2>
            <div className="flex flex-col p-4 sm:p-5 justify-center bg-primary rounded-lg text-white w-80 h-32">
              <h3 className="text-sm sm:text-base md:text-lg text-center font-semibold">
                Profile views in {selectedPeriod.label.toLowerCase()}
              </h3>
              <h2 className="font-bold text-center text-xl sm:text-2xl md:text-3xl mt-2">
                {filteredViewsCount}
              </h2>
            </div>
          </div>

          {/* Last Period */}
          <div className="flex flex-col gap-3 w-full md:w-80">
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-center md:text-end md:pb-10">
              Last {selectedPeriod.label}
            </h2>
            <Link
              href="/creative-dashboard/viewed-by"
              className="flex flex-col p-4 sm:p-5 justify-center bg-primary rounded-lg text-white w-80 h-32 hover:bg-primary/90 transition-colors"
            >
              <h3 className="text-sm sm:text-base md:text-lg text-center font-semibold">
                People who viewed your profile
              </h3>
              <span className="font-bold text-center text-xl sm:text-2xl md:text-3xl mt-2">
                {filteredViewsCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileAnalytics;