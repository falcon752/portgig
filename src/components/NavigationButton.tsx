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

/* =========================
   ROLE-BASED NAV CONFIG
========================= */

const CREATOR_NAV: NavigationItem[] = [
  { id: "home", href: "/creative-homepage", iconSrc: "/assets/home.svg" },
  { id: "creatives-hub", href: "/creatives-hub", iconSrc: "/assets/hub.svg" },
  { id: "jobs", href: "/job-hub", iconSrc: "/assets/job.svg" },
  {
    id: "messages",
    href: "/chats",
    isLucide: true,
    lucideIcon: MessageCircle,
  },
  {
    id: "notifications",
    href: "/creator-notifications",
    isLucide: true,
    lucideIcon: Bell,
  },
  {
    id: "dashboard",
    href: "/creative-dashboard",
    iconSrc: "/assets/dashboard.svg",
  },
];

const RECRUITER_NAV: NavigationItem[] = [
  { id: "home", href: "/recruiter-homepage", iconSrc: "/assets/home.svg" },
  { id: "recruiter-creatives-hub", href: "/recruiter-creatives-hub", iconSrc: "/assets/hub.svg" },
  {
    id: "messages",
    href: "/chats",
    isLucide: true,
    lucideIcon: MessageCircle,
  },
  {
    id: "notifications",
    href: "/recruiter-notifications",
    isLucide: true,
    lucideIcon: Bell,
  },
  {
    id: "dashboard",
    href: "/recruiter-dashboard",
    iconSrc: "/assets/dashboard.svg",
  },
];

/* =========================
   FALLBACK
========================= */

function BottomNavigationFallback() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A1754]">
      <div className="flex items-center justify-around px-4 py-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1"
          >
            <div className="h-6 w-6 bg-white/20 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </nav>
  );
}

/* =========================
   MAIN CONTENT
========================= */

function BottomNavigationContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userType, setUserType] = useState<UserType>("creator");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);

  const currentUser = profile || recruiterProfile;
  const currentUserId = getUserId(currentUser);

  const [notificationState, setNotificationState] =
    useState<NotificationState>({
      totalCount: 0,
      lastViewedCount: 0,
      lastFetchedCount: 0,
    });

  const [messageState, setMessageState] = useState<MessageState>({
    totalUnread: 0,
    lastViewedCount: 0,
  });

  const unreadNotificationCount = useMemo(
    () =>
      Math.max(
        0,
        notificationState.totalCount - notificationState.lastViewedCount
      ),
    [notificationState]
  );

  const unreadMessageCount = useMemo(
    () =>
      Math.max(
        0,
        messageState.totalUnread - messageState.lastViewedCount
      ),
    [messageState]
  );

  /* =========================
     USER TYPE DETECTION
  ========================= */

  useEffect(() => {
    const isAuthenticated = AuthStorage.isAuthenticated();
    const storedUserType = AuthStorage.getUserType();

    setIsLoggedIn(isAuthenticated);

    if (isAuthenticated && storedUserType) {
      setUserType(storedUserType as UserType);
      fetchNotificationCount(storedUserType as UserType);
      return;
    }

    const paramType = searchParams.get("userType");
    if (paramType === "creator" || paramType === "recruiter") {
      setUserType(paramType);
      return;
    }

    if (
      pathname.includes("/recruiter") ||
      pathname.includes("/recruiter-dashboard")
    ) {
      setUserType("recruiter");
    } else {
      setUserType("creator");
    }
  }, [pathname, searchParams]);

  /* =========================
     NOTIFICATIONS
  ========================= */

  const fetchNotificationCount = async (role: UserType) => {
    try {
      const apiRole = role === "creator" ? "Creator" : "Recruiter";
      const count = await NotificationService.getNotificationCount(apiRole);

      setNotificationState((prev) =>
        prev.lastFetchedCount === count
          ? prev
          : {
              totalCount: count,
              lastViewedCount: prev.lastViewedCount,
              lastFetchedCount: count,
            }
      );
    } catch {
      setNotificationState({
        totalCount: 0,
        lastViewedCount: 0,
        lastFetchedCount: 0,
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotificationCount(userType);
    const interval = setInterval(
      () => fetchNotificationCount(userType),
      30000
    );

    return () => clearInterval(interval);
  }, [isLoggedIn, userType]);

  /* =========================
     MESSAGES
  ========================= */

  useEffect(() => {
    if (!currentUserId) return;

    const unsub = getUserChatRooms(currentUserId, (rooms) => {
      const total = rooms.reduce(
        (sum, r) => sum + (r.unreadCounts?.[currentUserId] || 0),
        0
      );
      setMessageState((prev) => ({ ...prev, totalUnread: total }));
    });

    return () => unsub && unsub();
  }, [currentUserId]);

  /* =========================
     NAV ITEMS
  ========================= */

  const navigationItems = useMemo(() => {
    if (!isLoggedIn) {
      return [{ id: "home", href: "/", iconSrc: "/assets/home.svg" }];
    }
    return userType === "recruiter" ? RECRUITER_NAV : CREATOR_NAV;
  }, [isLoggedIn, userType]);

  /* =========================
     RENDER HELPERS
  ========================= */

  const renderIcon = (item: NavigationItem) => {
    if (item.isLucide && item.lucideIcon) {
      const Icon = item.lucideIcon;
      return <Icon className="h-6 w-6 text-white" />;
    }
    if (item.iconSrc) {
      return (
        <Image
          src={item.iconSrc}
          alt={item.id}
          width={24}
          height={24}
        />
      );
    }
    return null;
  };

  /* =========================
     HANDLERS
  ========================= */

  const handleNotificationClick = () => {
    setNotificationState((prev) => ({
      ...prev,
      lastViewedCount: prev.totalCount,
    }));

    localStorage.setItem(
      `notificationLastViewed_${userType}`,
      notificationState.totalCount.toString()
    );

    router.push(
      userType === "creator"
        ? "/creator-notifications"
        : "/recruiter-notifications"
    );
  };

  const handleMessageClick = () => {
    setMessageState((prev) => ({
      ...prev,
      lastViewedCount: prev.totalUnread,
    }));

    localStorage.setItem(
      `messageLastViewed_${currentUserId}`,
      messageState.totalUnread.toString()
    );

    router.push("/chats");
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A1754]">
      <div className="flex items-center justify-around px-4 py-3">
        {navigationItems.map((item) => {
          const wrapperClass = cn(
            "flex items-center justify-center rounded p-2 relative",
            "bg-[#D9D9D91C]"
          );

          if (item.id === "notifications") {
            return (
              <button key={item.id} onClick={handleNotificationClick}>
                <div className={wrapperClass}>
                  {renderIcon(item)}
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          if (item.id === "messages") {
            return (
              <button key={item.id} onClick={handleMessageClick}>
                <div className={wrapperClass}>
                  {renderIcon(item)}
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          return (
            <button key={item.id} onClick={() => router.push(item.href)}>
              <div className={wrapperClass}>{renderIcon(item)}</div>
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
