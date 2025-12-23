"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, Suspense } from "react";
import { MessageCircle, Bell } from "lucide-react";
import { AuthStorage } from "../lib/requests/auth.new";
import { NotificationService } from "../lib/requests/notifications";
import { getUserChatRooms } from "@/src/lib/firebase/chat";
import { getUserId } from "@/src/utils/chats";
import { useAppSelector } from "@/src/redux/hooks";

type UserType = "creator" | "recruiter";

interface NavigationItem {
  id: string;
  href: string;
  iconSrc?: string;
  isLucide?: boolean;
  lucideIcon?: React.ComponentType<any>;
}

interface NotificationState {
  totalCount: number;
  lastViewedCount: number;
  lastFetchedCount: number;
}

interface MessageState {
  totalUnread: number;
  lastViewedCount: number;
}

function BottomNavigationFallback() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A1754]">
      <div className="flex items-center justify-around px-4 py-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1"
          >
            <div className="h-6 w-6 bg-white/20 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </nav>
  );
}

function BottomNavigationContent() {
  const pathname = usePathname();

  const noBottomNavPaths = [
    "/dashboard",
    "/dashboard/recruiter-dashboard",
    "/JobBoard",
    "/recruiter",
  ];

  if (noBottomNavPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const router = useRouter();
  const searchParams = useSearchParams();

  const [userType, setUserType] = useState<UserType>("creator");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);

  const currentUser = profile || recruiterProfile;
  const currentUserId = getUserId(currentUser);

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

  const unreadNotificationCount = useMemo(() => {
    return Math.max(
      0,
      notificationState.totalCount - notificationState.lastViewedCount
    );
  }, [notificationState.totalCount, notificationState.lastViewedCount]);

  const unreadMessageCount = useMemo(() => {
    return Math.max(
      0,
      messageState.totalUnread - messageState.lastViewedCount
    );
  }, [messageState.totalUnread, messageState.lastViewedCount]);


  useEffect(() => {
    const loadPersistedNotificationState = () => {
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
    };

    loadPersistedNotificationState();
  }, [userType]);

  useEffect(() => {
    if (typeof window !== "undefined" && currentUserId) {
      const persistedLastViewed = localStorage.getItem(
        `messageLastViewed_${currentUserId}`
      );
      const lastViewedCount = persistedLastViewed
        ? parseInt(persistedLastViewed)
        : 0;

      setMessageState((prev) => ({
        ...prev,
        lastViewedCount,
      }));
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = getUserChatRooms(currentUserId, (rooms) => {
      const unreadTotal = rooms.reduce((acc, room) => {
        const unreadCount = room.unreadCounts?.[currentUserId] || 0;
        return acc + unreadCount;
      }, 0);

      setMessageState((prev) => ({
        ...prev,
        totalUnread: unreadTotal,
      }));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserId]);

  useEffect(() => {
    const isAuthenticated = AuthStorage.isAuthenticated();
    const currentUserType = AuthStorage.getUserType();

    setIsLoggedIn(isAuthenticated);

    if (isAuthenticated && currentUserType) {
      setUserType(currentUserType as UserType);

      fetchNotificationCount(currentUserType as UserType);
    } else {
      const userTypeFromParams = searchParams.get("userType") as UserType;
      if (
        userTypeFromParams === "creator" ||
        userTypeFromParams === "recruiter"
      ) {
        setUserType(userTypeFromParams);
        return;
      }

      const getUserTypeFromPath = (path: string): UserType => {
        if (
          path.includes("/creative-dashboard") ||
          path.includes("/creative")
        ) {
          return "creator";
        } else if (
          path.includes("/recruiter-dashboard") ||
          path.includes("/recruiter")
        ) {
          return "recruiter";
        }
        return "creator";
      };

      setUserType(getUserTypeFromPath(pathname));
    }
  }, [pathname, searchParams]);

  const fetchNotificationCount = async (role: UserType) => {
    try {
      const apiRole = role === "creator" ? "Creator" : "Recruiter";
      const newTotalCount = await NotificationService.getNotificationCount(
        apiRole
      );

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
      setNotificationState((prev) => ({
        ...prev,
        totalCount: 0,
        lastFetchedCount: 0,
      }));
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !userType) return;

    fetchNotificationCount(userType);

    const intervalId = setInterval(() => {
      fetchNotificationCount(userType);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, userType]);

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

    const notificationRoute =
      userType === "creator"
        ? "/creator-notifications"
        : "/recruiter-notifications";
    router.push(notificationRoute);
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

    router.push("/chats");
  };

  const renderIcon = (item: NavigationItem) => {
    if (item.isLucide && item.lucideIcon) {
      const IconComponent = item.lucideIcon;
      return <IconComponent className={cn("h-6 w-6 text-white")} />;
    } else if (item.iconSrc) {
      return (
        <Image
          src={item.iconSrc}
          alt={item.id}
          width={24}
          height={24}
          className="w-6 h-6 text-white"
        />
      );
    }
    return null;
  };

  const getNavigationItems = (
    userType: UserType,
    isLoggedIn: boolean
  ): NavigationItem[] => {
    const getHomeRoute = () => {
      if (!isLoggedIn) return "/";
      return userType === "creator"
        ? "/creative-homepage"
        : "/recruiter-homepage";
    };

    const getNotificationRoute = () => {
      return userType === "creator"
        ? "/creator-notifications"
        : "/recruiter-notifications";
    };

    return [
      { id: "home", href: getHomeRoute(), iconSrc: "/assets/home.svg" },
      {
        id: "creatives-hub",
        href: "/creatives-hub",
        iconSrc: "/assets/hub.svg",
      },
      { id: "jobs", href: "/job-hub", iconSrc: "/assets/job.svg" },
      {
        id: "messages",
        href: "/chats",
        isLucide: true,
        lucideIcon: MessageCircle,
      },
      {
        id: "notifications",
        href: getNotificationRoute(),
        isLucide: true,
        lucideIcon: Bell,
      },
      {
        id: "dashboard",
        href:
          userType === "creator"
            ? "/creative-dashboard"
            : "/recruiter-dashboard",
        iconSrc: "/assets/dashboard.svg",
      },
    ];
  };

  const navigationItems = getNavigationItems(userType, isLoggedIn);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A1754]">
      <div className="flex items-center justify-around px-4 py-3">
        {navigationItems.map((item) => {
          const iconWrapperStyle = cn(
            "flex items-center justify-center rounded p-2 text-white relative",
            userType === "creator"
              ? "bg-[#D9D9D91C] text-white"
              : "border border-black"
          );

          if (item.id === "notifications") {
            return (
              <button
                key={item.id}
                onClick={handleNotificationClick}
                className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 relative"
              >
                <div className={iconWrapperStyle}>
                  {renderIcon(item)}

                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          if (item.id === "messages") {
            return (
              <button
                key={item.id}
                onClick={handleMessageClick}
                className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 relative"
              >
                <div className={iconWrapperStyle}>
                  {renderIcon(item)}

                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          // Regular items
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 relative"
            >
              <div className={iconWrapperStyle}>{renderIcon(item)}</div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function BottomNavigation() {
  return (
    <Suspense fallback={<BottomNavigationFallback />}>
      <BottomNavigationContent />
    </Suspense>
  );
}