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

const RecruiterDashboardHero = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  const [userType] = useState(AuthStorage.getUserType());
  const [notificationState, setNotificationState] = useState({
    totalCount: 0,
    lastViewedCount: 0,
    lastFetchedCount: 0,
  });

  useEffect(() => {
    const isAuthenticated = AuthStorage.isAuthenticated();
    if (isAuthenticated) {
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
        const isAuthenticated = AuthStorage.isAuthenticated();
        if (!isAuthenticated) return;

        const currentUserType = AuthStorage.getUserType();
        if (!currentUserType) return;

        const apiRole = currentUserType === "creator" ? "Creator" : "Recruiter";
        const newTotalCount = await NotificationService.getNotificationCount(apiRole);

        setNotificationState((prev) => {
          if (prev.lastFetchedCount === newTotalCount) {
            return prev;
          }
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

    const loadPersistedNotificationState = () => {
      if (typeof window !== "undefined" && userType) {
        const persistedLastViewed = localStorage.getItem(`notificationLastViewed_${userType}`);
        const lastViewedCount = persistedLastViewed ? parseInt(persistedLastViewed) : 0;

        setNotificationState((prev) => ({
          ...prev,
          lastViewedCount,
        }));
      }
    };

    loadPersistedNotificationState();
    fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 30000);

    return () => clearInterval(intervalId);
  }, [userType]);

  const unreadNotificationCount = useMemo(() => {
    return Math.max(0, notificationState.totalCount - notificationState.lastViewedCount);
  }, [notificationState.totalCount, notificationState.lastViewedCount]);

  const handleNotificationClick = () => {
    setNotificationState((prev) => ({
      ...prev,
      lastViewedCount: prev.totalCount,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(`notificationLastViewed_${userType}`, notificationState.totalCount.toString());
    }

    window.location.href = "/recruiter-notifications";
  };

  const userName =
    profile?.bio_data?.user_name ||
    recruiterProfile?.bio_data?.full_name ||
    "there";

  const profilePicture =
    userType === "recruiter"
      ? recruiterProfile?.profile?.profile_picture || "/assets/creative.svg"
      : profile?.profile?.profile_picture || "/assets/creative.svg";

  const links = [
    {
      label: "Edit Profile",
      path: "/recruiter-dashboard/recruiter-edit-profile",
    },
    {
      label: "Post Job",
      path: "/recruiter-dashboard/post-jobs",
    },
    { label: "View messages", path: "/chats" },
  ];

  return (
    <section className="bg-white md:bg-primary text-primary md:text-white py-10 px-1 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Mobile Profile Section */}
        <div className="md:hidden flex flex-col items-center gap-6">
          <div className="w-full max-w-xs mx-auto lg:mx-0 bg-white flex items-center justify-center">
            <Image
              src={profilePicture}
              alt="User profile"
              width={600}
              height={600}
              className="rounded-full object-cover w-34 h-34 sm:w-32 sm:h-32 md:w-48 md:h-48"
            />
          </div>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {/* First row - Two buttons side by side */}
            <div className="flex gap-3">
              <Link href={links[0].path} className="flex-1">
                <Buttons
                  label={links[0].label}
                  className="w-full bg-[#0A1754] text-white! text-sm rounded-full py-3 px-6 cursor-pointer font-semibold font-raleway"
                />
              </Link>
              <Link href={links[1].path} className="flex-1">
                <Buttons
                  label={links[1].label}
                  className="w-full bg-[#0A1754] text-white! text-sm rounded-full py-3 px-6 cursor-pointer font-semibold font-raleway"
                />
              </Link>
            </div>

            {/* Second row - View messages button centered */}
            <div className="flex justify-center">
              <Link href={links[2].path}>
                <Buttons
                  label={links[2].label}
                  className="bg-[#0A1754] text-white! text-sm rounded-full py-3 px-8 cursor-pointer font-semibold font-raleway"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet & Desktop Layout - Hidden on mobile */}
        <div className="hidden md:block">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6">
            {/* Notification Bell - Tablet only, positioned before text */}
            <div className="lg:hidden flex justify-end w-full">
              <button onClick={handleNotificationClick} className="relative">
                <Bell className="w-7 h-7 text-white cursor-pointer" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Text Block */}
            <div className="border-4 border-white rounded-xl p-4 sm:p-6 lg:p-10 w-full lg:max-w-4xl">
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold font-raleway text-white">
                Hi, {userName}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg font-inter mt-2">
                Your creativity is your superpower! 🚀 Keep building, keep
                innovating, and let your work speak for itself. The right
                opportunity is just around the corner,go grab it!
              </p>
            </div>

            {/* Image - Desktop only with bell */}
            <div className="hidden lg:block w-full max-w-xs mx-auto lg:mx-0 lg:mb-30 relative">
              <Image
                src={profilePicture}
                alt="User profile"
                width={600}
                height={600}
                className="rounded-full object-cover w-34 h-34 sm:w-32 sm:h-32 md:w-48 md:h-48"
              />
              <div className="absolute top-0 right-0">
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

          {/* Centered Image - Tablet only */}
          <div className="lg:hidden flex justify-center mt-6 mb-4">
            <Image
              src={profilePicture}
              alt="User profile"
              width={600}
              height={600}
              className="rounded-full object-cover w-40 h-40"
            />
          </div>

          {/* Subheading */}
          <h2 className="text-sm sm:text-sm lg:text-xl font-semibold font-raleway text-center lg:text-left mt-4 mb-2">
            Let&apos;s dive in
          </h2>

          {/* Buttons Section */}
          <div className="flex flex-wrap justify-center lg:justify-between gap-3 sm:gap-5">
            {links.map((link, index) => (
              <Link key={index} href={link.path}>
                <Buttons
                  label={link.label}
                  className="w-[180px] sm:w-[180px] md:w-[200px] lg:w-[270px] bg-white text-primary! text-[10px] sm:text-xs md:text-sm lg:text-lg rounded-full py-2 px-5 cursor-pointer font-semibold font-raleway"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterDashboardHero;