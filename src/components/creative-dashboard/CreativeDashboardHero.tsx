"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Buttons } from "../export_components";
import AuthStorage from "../../lib/requests/auth.new";
import { NotificationService } from "../../lib/requests/notifications";
import { fetchRecruiterProfile } from "../../redux/features/user/recruiterSlice";
import { fetchUserProfile } from "../../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Bell } from "lucide-react";

const CreativeDashboardHero = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state: { user: any }) => state.user);
  const { recruiterProfile } = useAppSelector(
    (state: { recruiter: any }) => state.recruiter
  );
  const [userType] = useState(AuthStorage.getUserType());
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [notificationState, setNotificationState] = useState({
    totalCount: 0,
    lastViewedCount: 0,
    lastFetchedCount: 0,
  });

  useEffect(() => {
    if (AuthStorage.isAuthenticated()) {
      if (userType === "recruiter") {
        dispatch(fetchRecruiterProfile());
      } else {
        dispatch(fetchUserProfile());
      }
    }
  }, [dispatch, userType]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        if (!AuthStorage.isAuthenticated()) return;

        const apiRole = userType === "creator" ? "Creator" : "Recruiter";
        const newTotalCount = await NotificationService.getNotificationCount(
          apiRole
        );

        setNotificationState((prev) => {
          if (prev.lastFetchedCount === newTotalCount) return prev;
          return {
            totalCount: newTotalCount,
            lastViewedCount: prev.lastViewedCount,
            lastFetchedCount: newTotalCount,
          };
        });
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    if (typeof window !== "undefined" && userType) {
      const persistedLastViewed = localStorage.getItem(
        `notificationLastViewed_${userType}`
      );
      const lastViewedCount = persistedLastViewed
        ? parseInt(persistedLastViewed)
        : 0;

      setNotificationState((prev) => ({
        ...prev,
        lastViewedCount,
      }));
    }

    fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(intervalId);
  }, [userType]);

  const unreadNotificationCount = useMemo(() => {
    return Math.max(
      0,
      notificationState.totalCount - notificationState.lastViewedCount
    );
  }, [notificationState.totalCount, notificationState.lastViewedCount]);

  const handleNotificationClick = () => {
    setNotificationState((prev) => ({
      ...prev,
      lastViewedCount: prev.totalCount,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `notificationLastViewed_${userType}`,
        notificationState.totalCount.toString()
      );
    }

    window.location.href = "/creator-notifications";
  };

  const userName =
    profile?.bio_data?.user_name ||
    recruiterProfile?.bio_data?.full_name ||
    "there";

  const profilePicture =
    profile?.profile?.profile_picture || "/assets/creative.svg";

  const hasPortfolio = profile?.portfolio?.template_type;

  const handlePortfolioClick = () => {
    if (hasPortfolio && profile?.portfolio?.template_type) {
      window.location.href = `/edit-template/${profile.portfolio.template_type.toLowerCase()}`;
    } else {
      setShowPortfolioModal(true);
    }
  };

  const links = [
    { label: "Edit Profile", path: "/creative-dashboard/edit-profile" },
    { label: "Create/Edit your Portfolio", onClick: handlePortfolioClick },
    { label: "Search for new job", path: "job-hub" },
    { label: "View Messages", path: "/chats" },
  ];

  return (
    <>
      <section className="bg-white md:bg-primary text-primary md:text-white py-10 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative">
            {/* Notification Bell on Tablet */}
            <div className="absolute top-0 right-0 md:static md:flex md:justify-end w-full mb-4 lg:hidden">
              <button onClick={handleNotificationClick} className="relative mx-auto md:mx-0">
                <Bell className="w-6 h-6 text-primary md:text-white cursor-pointer" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Text Block */}
            <div className="hidden md:block border-3 border-white rounded-xl p-4 sm:p-6 lg:p-10 w-full lg:max-w-4xl">
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold font-raleway text-white">
                Hi, {userName}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg font-inter mt-2">
                Your creativity is your superpower! 🚀 Keep building, keep
                innovating, and let your work speak for itself. The right
                opportunity is just around the corner—go grab it!
              </p>
            </div>

            {/* Profile Image Section */}
            <div className="w-full max-w-xs mx-auto lg:mx-0">
              <div className="flex flex-col items-center relative">
                <Image
                  src={profilePicture}
                  alt="User profile"
                  width={600}
                  height={600}
                  className="rounded-full object-cover w-34 h-34 sm:w-32 sm:h-32 md:w-48 md:h-48"
                />
                {/* Notification Bell for Desktop */}
                <div className="hidden lg:block absolute top-0 right-0">
                  <button onClick={handleNotificationClick} className="relative">
                    <Bell className="w-6 h-6 text-white cursor-pointer" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subheading */}
          <h2 className="text-sm sm:text-sm lg:text-xl font-semibold font-raleway text-left hidden md:block">
            Let&apos;s dive in
          </h2>

          {/* Buttons Section */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:flex md:flex-wrap md:justify-center lg:justify-start">
            {links.map((link, index) =>
              link.path ? (
                <Link key={index} href={link.path} className="w-full md:w-auto">
                  <Buttons
                    label={link.label}
                    className="w-full md:w-[200px] lg:w-[270px] bg-[#0A1754] md:bg-white text-white! md:text-primary! text-[10px] sm:text-xs md:text-sm lg:text-lg rounded-full py-2 px-5 cursor-pointer font-semibold font-raleway"
                  />
                </Link>
              ) : (
                <div key={index} className="w-full md:w-auto" onClick={link.onClick}>
                  <Buttons
                    label={link.label}
                    className="w-full md:w-[200px] lg:w-[270px] bg-[#0A1754] md:bg-white text-white! md:text-primary! text-[10px] sm:text-xs md:text-sm lg:text-lg rounded-full py-2 px-5 cursor-pointer font-semibold font-raleway"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold font-raleway text-gray-900 mb-2">
                No Portfolio Selected
              </h3>
              <p className="text-sm text-gray-600 mb-6 font-inter">
                You haven’t selected a portfolio template yet. Go to the
                portfolio marketplace, pick a template for your niche and edit
                with your works.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPortfolioModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <Link href="/portfolio" className="flex-1">
                  <button
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
                    onClick={() => setShowPortfolioModal(false)}
                  >
                    Go to Portfolio Marketplace
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreativeDashboardHero;
