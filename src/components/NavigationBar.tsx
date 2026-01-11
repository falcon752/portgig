/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { navigationItems, navigationItemsMobile } from "../constants";
import AuthStorage from "../lib/requests/auth.new";
import { NotificationService } from "../lib/requests/notifications";
import { fetchRecruiterProfile } from "../redux/features/user/recruiterSlice";
import { fetchUserProfile } from "../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import NavLink from "./NavLink";
import {
  getRecruiterDashboard,
  type RecruiterDashboardData,
} from "../lib/requests/recruiterApi";
import { getUserChatRooms } from "@/src/lib/firebase/chat";
import { getUserId } from "@/src/utils/chats";

interface NotificationState {
  totalCount: number;
  lastViewedCount: number;
  lastFetchedCount: number;
}

interface MessageState {
  totalUnread: number;
  lastViewedCount: number;
}

interface NavigationBarProps {
  minimal?: boolean;
  // onProfileInfoUpdate?: (profileName: string, profilePicture: string) => void;
}

// Helper to get user profile image with fallback
const getUserProfileImage = (user: any) =>
  user?.profile?.profile_picture ||
  user?.bio_data?.profile_picture ||
  "/assets/creative.svg";

const getRecruiterNavigationItems = (
  dashboardData: RecruiterDashboardData | null
) => {
  const jobPostedItems =
    dashboardData?.job_titles?.map((jobTitle) => ({
      label: jobTitle,
      link: `/recruiter-dashboard/jobs/${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    })) || [];

  return [
    {
      category: "Job Posted",
      items: [
        { label: "Create new job", link: "/recruiter-dashboard/post-jobs" },
        { label: "Active jobs", link: "/recruiter-dashboard/active-jobs" },
      ],
    },
    {
      category: "Job Posted",
      items: jobPostedItems,
    },
    {
      category: "Applicants",
      items: [
        {
          label: "Shortlisted candidates",
          link: "/recruiter-dashboard/shortlisted-candidates",
        },
      ],
    },
    {
      category: "Messages",
      items: [
        {
          label: "View Messages",
          link: "/chats",
        },
      ],
    },
    {
      category: "Help & Support",
      items: [],
    },
  ];
};

const NavigationBar = ({
  minimal,
}: // onProfileInfoUpdate,
NavigationBarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);

  const [profileModal, setProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardData | null>(null);

  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      totalCount: 0,
      lastViewedCount: 0,
      lastFetchedCount: 0,
    }
  );

  const [messageState, setMessageState] = useState<MessageState>({
    totalUnread: 0,
    lastViewedCount: 0,
  });

  const isRecruiter = !!recruiterProfile && !profile;
  const isCreator = !!profile && !recruiterProfile;
  const userType = isRecruiter ? "recruiter" : isCreator ? "creator" : null;

  const currentUser = profile || recruiterProfile;
  const currentUserId = getUserId(currentUser);

  // Get profile name and picture directly from Redux
  const profileName =
    recruiterProfile?.bio_data?.full_name ||
    profile?.bio_data?.user_name ||
    "User";

  const profilePicture =
    recruiterProfile?.profile?.profile_picture ||
    profile?.profile?.profile_picture ||
    "/assets/creative.svg";

  // Pass profile info to parent if needed
  // useEffect(() => {
  //   if (onProfileInfoUpdate) {
  //     onProfileInfoUpdate(profileName, profilePicture);
  //   }
  // }, [profileName, profilePicture]);

  const unreadMessageCount = useMemo(() => {
    return Math.max(0, messageState.totalUnread - messageState.lastViewedCount);
  }, [messageState.totalUnread, messageState.lastViewedCount]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleProfileContextmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileModal(!profileModal);
  };

  const handleUserLogout = () => {
    setIsLoggingOut(true);
    toast.success("Logging out...");
    AuthStorage.clearAuth();

    setNotificationState({
      totalCount: 0,
      lastViewedCount: 0,
      lastFetchedCount: 0,
    });

    setMessageState({
      totalUnread: 0,
      lastViewedCount: 0,
    });

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const handleMessageClick = () => {
    setMessageState((prev) => ({
      ...prev,
      lastViewedCount: prev.totalUnread,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `messageLastViewed_${currentUserId}`,
        messageState.totalUnread.toString()
      );
    }

    setIsMobileMenuOpen(false);
  };

  const fetchNotificationCount = async () => {
    try {
      const isAuthenticated = AuthStorage.isAuthenticated();
      if (!isAuthenticated || !userType) return;

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

  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = getUserChatRooms(currentUserId, (rooms) => {
      const totalUnread = rooms.reduce((total, room) => {
        const unreadCount = room.unreadCounts?.[currentUserId] || 0;
        return total + unreadCount;
      }, 0);

      setMessageState((prev) => ({
        ...prev,
        totalUnread,
      }));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserId]);

  // Load persisted message state
  useEffect(() => {
    if (typeof window !== "undefined" && currentUserId) {
      const persistedLastViewed = localStorage.getItem(
        `messageLastViewed_${currentUserId}`
      );
      const lastViewedCount = persistedLastViewed
        ? Number.parseInt(persistedLastViewed)
        : 0;

      setMessageState((prev) => ({
        ...prev,
        lastViewedCount,
      }));
    }
  }, [currentUserId]);

  // Load persisted notification state
  useEffect(() => {
    if (typeof window !== "undefined" && userType) {
      const persistedLastViewed = localStorage.getItem(
        `notificationLastViewed_${userType}`
      );
      const lastViewedCount = persistedLastViewed
        ? Number.parseInt(persistedLastViewed)
        : 0;

      setNotificationState((prev) => ({
        ...prev,
        lastViewedCount,
      }));
    }
  }, [userType]);

  // Fetch notifications periodically
  useEffect(() => {
    const isAuthenticated = AuthStorage.isAuthenticated();
    if (!isAuthenticated) return;

    fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(intervalId);
  }, [userType]);

  // Fetch user profile
  useEffect(() => {
    const isAuthenticated = AuthStorage.isAuthenticated();
    if (!isAuthenticated) return;

    const currentUserType = AuthStorage.getUserType();
    if (currentUserType === "recruiter") {
      dispatch(fetchRecruiterProfile());
      const fetchDashboardData = async () => {
        try {
          const data = await getRecruiterDashboard();
          setDashboardData(data);
        } catch (error) {
          console.error(
            "Failed to fetch dashboard data for navigation:",
            error
          );
          setDashboardData({
            total_jobs_posted: 0,
            total_applicants: 0,
            job_titles: [],
            shortlisted_applicants: [],
            selected_applicants: [],
            not_qualified_applicants: [],
            applicant_details: [],
            latest_application: {
              job_title: "",
              applicant_info: {
                id: "",
                bio_data: {
                  full_name: "",
                  user_name: "",
                  profile_picture: "",
                },
                profile: {
                  years_of_experience: "",
                  field: "",
                  industry: "",
                  location: {
                    state: "",
                    lga: "",
                    _id: "",
                  },
                  profile_picture: "",
                },
                resume: {
                  skills: [],
                  other_skills: [],
                  certifications: [],
                  experience: [],
                  education: [],
                },
                rating: 0,
                profile_views: 0,
                social_clicks: {
                  linkedin: 0,
                  twitter: 0,
                  instagram: 0,
                  tiktok: 0,
                },
              },
              application_date: "",
            },
          });
        }
      };
      fetchDashboardData();
    } else {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  const homeLink = useMemo(() => {
    if (recruiterProfile) return "/recruiter-homepage";
    if (profile) return "/creative-homepage";
    return "/";
  }, [profile, recruiterProfile]);

  return (
    <nav className="sticky w-full top-0 z-50 h-14 text-primary bg-white">
      <div className="bodyMargin h-full flex items-center justify-between">
        {/* DESKTOP LAYOUT */}
        <div className="max-lg:hidden flex items-center">
          <Link href={homeLink}>
            <Image
              src="/assets/PortgigLogo.png"
              alt="Portgig Logo"
              quality={100}
              width={100}
              height={70}
              className="cursor-pointer"
            />
          </Link>
        </div>

        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {!minimal && (
              <button onClick={toggleMobileMenu} className="shrink-0">
                <Image
                  src="/assets/nav-menu.svg"
                  alt="Menu Icon"
                  width={32}
                  height={32}
                />
              </button>
            )}

            {!minimal && (
              <Link href={homeLink}>
                <Image
                  src="/assets/PortgigLogo.png"
                  alt="Portgig Logo"
                  quality={100}
                  width={80}
                  height={56}
                  className="cursor-pointer"
                />
              </Link>
            )}
          </div>

          <div className="shrink-0">
            {!profile && !recruiterProfile ? (
              <div className="bg-primary! text-white rounded-full text-center text-xs cursor-pointer px-3 py-1.5 flex items-center justify-center gap-1">
                <Link href="/onboarding" className="text-xs">
                  Sign up
                </Link>
                <span>/</span>
                <Link href="/onboarding" className="text-xs">
                  Log in
                </Link>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center">
                  {/* Profile Image */}
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={profilePicture}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/creative.svg";
                      }}
                    />
                  </div>

                  {/* Button with name */}
                  <button
                    type="button"
                    onClick={handleProfileContextmenu}
                    className="bg-primary! text-white rounded-md text-center text-xs capitalize cursor-pointer px-3 py-1.5 -ml-1"
                  >
                    {profileName}
                  </button>
                </div>

                {profileModal && (
                  <div className="absolute top-12 right-0 bg-white rounded-lg px-2 py-1 w-[120px] z-50 flex flex-col justify-start items-start gap-2 shadow-lg border">
                    <button
                      type="button"
                      onClick={() => {
                        const dashboardRoute =
                          userType === "creator"
                            ? "/creative-dashboard"
                            : "/recruiter-dashboard";
                        window.location.href = dashboardRoute;
                      }}
                      className="h-12 px-4 rounded-md w-full hover:bg-gray-200 cursor-pointer"
                    >
                      Visit Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleUserLogout}
                      disabled={isLoggingOut}
                      className="h-10 px-3 rounded-md w-full hover:bg-gray-200 cursor-pointer disabled:opacity-50 text-sm"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav Links */}
        {!minimal && (
          <div className="max-lg:hidden w-[900px] font-semibold text-primary text-[18px] font-urbanist mx-auto">
            <ul className="flex gap-6 justify-center">
              {navigationItems.map((item, index) => {
                if (item.link.startsWith("http")) {
                  return (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cursor-pointer hover:underline hover:decoration-primary pb-1 ${
                        pathname === item.link
                          ? "border-b-2 border-primary"
                          : ""
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                }

                const href =
                  item.label === "Home"
                    ? homeLink
                    : item.label === "Messages"
                    ? "/chats"
                    : item.link;

                if (item.label === "Messages") {
                  return (
                    <li key={index}>
                      <Link
                        href="/chats"
                        onClick={handleMessageClick}
                        className={`cursor-pointer hover:underline hover:decoration-primary pb-1 relative ${
                          pathname === "/chats"
                            ? "border-b-2 border-primary"
                            : ""
                        }`}
                      >
                        {item.label}
                        {unreadMessageCount > 0 && (
                          <span className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                }

                return (
                  <NavLink href={href} key={index}>
                    <li
                      className={`cursor-pointer hover:underline hover:decoration-primary pb-1 relative ${
                        pathname === href ? "border-b-2 border-primary" : ""
                      }`}
                    >
                      {item.label}
                    </li>
                  </NavLink>
                );
              })}
            </ul>
          </div>
        )}

        {/* Desktop Profile or Sign up / Login */}
        <div className="max-lg:hidden flex items-center">
          {!profile && !recruiterProfile ? (
            <div className="bg-primary! text-white rounded-full text-center text-sm cursor-pointer px-4 py-2 flex items-center justify-center gap-2">
              <Link href="/onboarding">Sign up</Link>
              <span>/</span>
              <Link href="/onboarding">Log in</Link>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center">
                {" "}
                {/* smaller gap */}
                {/* Profile Image */}
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={profilePicture}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/creative.svg";
                    }}
                  />
                </div>
                {/* Button with name */}
                <button
                  type="button"
                  onClick={handleProfileContextmenu}
                  className="bg-primary! text-white rounded-md text-center text-sm capitalize cursor-pointer px-4 py-2 -ml-1"
                >
                  Hey, {profileName}
                </button>
              </div>

              {profileModal && (
                <div className="absolute top-14 left-0 bg-white rounded-lg px-2 py-1 w-[150px] z-50 flex flex-col justify-start items-start gap-3 shadow-lg border">
                  <button
                    type="button"
                    onClick={() => {
                      const dashboardRoute =
                        userType === "creator"
                          ? "/creative-dashboard"
                          : "/recruiter-dashboard";
                      window.location.href = dashboardRoute;
                    }}
                    className="h-12 px-4 rounded-md w-full hover:bg-gray-200 cursor-pointer"
                  >
                    Visit Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleUserLogout}
                    disabled={isLoggingOut}
                    className="h-12 px-4 rounded-md w-full hover:bg-gray-200 cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!minimal && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Mobile Sidebar */}
              <motion.div
                className={`fixed top-0 left-0 w-[280px] h-full shadow-lg z-50 flex flex-col px-6 py-8 ${
                  isRecruiter
                    ? "bg-[#0A1754] text-white"
                    : "bg-white text-primary"
                }`}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <Link href={homeLink}>
                    <Image
                      src={
                        isRecruiter
                          ? "/assets/white-logo.png"
                          : "/assets/PortgigLogo.png"
                      }
                      alt="Portgig Logo"
                      quality={100}
                      width={100}
                      height={70}
                      className="cursor-pointer"
                    />
                  </Link>
                  <button onClick={toggleMobileMenu}>
                    <AiOutlineClose
                      className={`w-6 h-6 ${
                        isRecruiter ? "text-white" : "text-black"
                      }`}
                    />
                  </button>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto font-urbanist flex flex-col">
                  {isRecruiter ? (
                    <>
                      {pathname ===
                        "/recruiter-dashboard/recruiter-edit-profile" ||
                      pathname ===
                        "/recruiter-dashboard/recruiter-change-password" ? (
                        <>
                          {/* Account Settings */}
                          <div className="flex-1">
                            <div className="mb-6 border-b border-white">
                              <h3 className="text-xl font-semibold text-white text-center">
                                Account Settings
                              </h3>
                            </div>
                            <div className="flex flex-col gap-5 ml-4">
                              <Link
                                href="/recruiter-dashboard/recruiter-edit-profile"
                                className={`px-4 py-3 rounded-md font-medium text-center font-inter ${
                                  pathname ===
                                  "/recruiter-dashboard/recruiter-edit-profile"
                                    ? "bg-white text-[#0A1754] font-semibold shadow-md"
                                    : "bg-white text-[#0A1754] hover:bg-gray-100 hover:shadow-md"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Profile & Account
                              </Link>
                              <Link
                                href="/recruiter-dashboard/recruiter-change-password"
                                className={`px-4 py-3 rounded font-medium text-center ${
                                  pathname ===
                                  "/recruiter-dashboard/recruiter-change-password"
                                    ? "bg-white text-[#0A1754] font-semibold shadow-md"
                                    : "bg-white text-[#0A1754] hover:bg-gray-100 hover:shadow-md"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Change Password
                              </Link>
                            </div>
                          </div>

                          {/* Help & Support */}
                          <div className="pb-4 flex flex-col items-center cursor-pointer gap-3 mt-8">
                            <Link
                              href="/dashboard/help"
                              className="text-white text-sm hover:underline font-inter font-semibold"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Help & Support
                            </Link>
                            <p className="font-inter text-xs text-white text-center">
                              Report an issue/Contact support
                            </p>
                          </div>
                        </>
                      ) : (
                        // Dynamic Recruiter Navigation
                        <div className="space-y-8">
                          {getRecruiterNavigationItems(dashboardData).map(
                            (section, sectionIndex) => (
                              <div key={sectionIndex}>
                                {/* Section Header */}
                                <div className="mb-6 border-b border-white">
                                  <h3 className="text-xl font-semibold text-white text-center">
                                    {section.category}
                                  </h3>
                                </div>
                                {/* Section Items */}
                                {section.items.length > 0 ? (
                                  <ul className="space-y-4 ml-4">
                                    {section.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="relative">
                                        {section.category === "Messages" ? (
                                          <Link
                                            href={item.link}
                                            onClick={handleMessageClick}
                                            className={`block text-base transition-colors duration-200 ${
                                              pathname === item.link
                                                ? "text-white font-semibold"
                                                : "text-white/90"
                                            } hover:text-white`}
                                          >
                                            {item.label}
                                            {unreadMessageCount > 0 && (
                                              <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                                                {unreadMessageCount > 9
                                                  ? "9+"
                                                  : unreadMessageCount}
                                              </span>
                                            )}
                                          </Link>
                                        ) : (
                                          <Link
                                            href={item.link}
                                            className={`block text-base transition-colors duration-200 ${
                                              pathname === item.link
                                                ? "text-white font-semibold"
                                                : "text-white/90"
                                            } hover:text-white`}
                                            onClick={() =>
                                              setIsMobileMenuOpen(false)
                                            }
                                          >
                                            {item.label}
                                          </Link>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-white/70 text-sm ml-4">
                                    {section.category === "Job Posted" &&
                                      "No jobs posted yet"}
                                    {section.category === "Applicants" &&
                                      "No applicants yet"}
                                    {section.category === "Messages" &&
                                      "No messages"}
                                    {section.category === "Help & Support" &&
                                      ""}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    // Creative/Regular User Navigation
                    <ul className="flex flex-col gap-6 text-lg font-medium text-primary">
                      {navigationItemsMobile.map((item, index) => {
                        const href =
                          item.label === "Home"
                            ? homeLink
                            : item.label === "Messages"
                            ? "/chats"
                            : item.link;

                        return (
                          <li key={index} className="relative">
                            {item.label === "Messages" ? (
                              <Link
                                href="/chats"
                                onClick={handleMessageClick}
                                className={`block ${
                                  pathname === "/chats"
                                    ? "text-primary font-bold"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.label}
                                {unreadMessageCount > 0 && (
                                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                                    {unreadMessageCount > 9
                                      ? "9+"
                                      : unreadMessageCount}
                                  </span>
                                )}
                              </Link>
                            ) : (
                              <Link
                                href={href}
                                className={`block ${
                                  pathname === href
                                    ? "text-primary font-bold"
                                    : "text-gray-700"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Auth buttons */}
                <div className="pb-6 mb-10">
                  {!profile && !recruiterProfile ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/onboarding"
                        className={`py-3 px-4 rounded-full text-sm text-center font-medium ${
                          isRecruiter
                            ? "bg-white text-[#0A1754] hover:bg-gray-100"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                      <Link
                        href="/login"
                        className={`py-3 px-4 rounded-full text-sm text-center font-medium border ${
                          isRecruiter
                            ? "border-white text-white hover:bg-white/10"
                            : "border-primary text-primary hover:bg-primary/5"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleUserLogout}
                      className={`text-left w-full py-3 px-4 rounded-full text-sm font-medium border ${
                        isRecruiter
                          ? "text-red-300 border-red-500 hover:bg-red-300/10"
                          : ""
                      }`}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </nav>
  );
};

export default NavigationBar;
