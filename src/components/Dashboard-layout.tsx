"use client";
import type React from "react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineMenu } from "react-icons/hi";
import {
  User,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  HelpCircle,
  Home,
} from "lucide-react";
import {
  getAllJobs,
  type RecruiterDashboardData,
} from "../lib/requests/recruiterApi";
import Image from "next/image";
import NavigationBar from "@/src/components/NavigationBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  isSection: boolean;
  children?: { title: string; href: string }[];
  fallbackText?: string;
  fallbackHref?: string;
}

// Default sidebar items
const defaultSidebarItems: SidebarItem[] = [
  {
    title: "Profile & Account",
    href: "/recruiter-dashboard",
    icon: User,
    isSection: false,
  },
  {
    title: "Homepage",
    href: "/recruiter-homepage",
    icon: Home,
    isSection: false,
  },
    {
    title: "Creatives Hub",
    href: "/recruiter-creatives-hub",
    icon: Users,
    isSection: false,
  },
  {
    title: "Job Posting",
    icon: Briefcase,
    isSection: true,
    children: [
      {
        title: "Create new job postings",
        href: "/recruiter-dashboard/post-jobs",
      },
      { title: "Active jobs", href: "/recruiter-dashboard/active-jobs" },
    ],
  },
  {
    title: "Job Posted",
    icon: FileText,
    isSection: true,
    children: [],
    fallbackText: "No jobs posted yet",
  },
  {
    title: "Applicants",
    icon: Users,
    isSection: true,
    children: [
      {
        title: "Shortlisted candidates",
        href: "/recruiter-dashboard/shortlisted-candidates",
      },
    ],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    isSection: true,
    children: [],
    fallbackHref: "/chats",
  },
  {
    title: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
    isSection: false,
  },
];

const generateJobHref = (jobTitle: string) => {
  const slug = jobTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `/recruiter-dashboard/jobs/${slug}`;
};

export default function DashboardLayout({
  children,
  sidebarContent,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [profileName, setProfileName] = useState("User");
  const [profilePicture, setProfilePicture] = useState("/assets/creative.svg");
  const [profileModal, setProfileModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await getAllJobs({ status: "ACTIVE" });
        const jobs = response.data.page_data || [];

        const jobTitles = jobs
          .map((job: any) => job.title || job.job_title || "")
          .filter(Boolean);

        const totalApplicants = jobs.reduce((total: number, job: any) => {
          return total + (job.applicants?.length || 0);
        }, 0);

        const transformedData: RecruiterDashboardData = {
          total_jobs_posted: jobs.length,
          total_applicants: totalApplicants,
          job_titles: jobTitles,
          shortlisted_applicants: [],
          selected_applicants: [],
          not_qualified_applicants: [],
          applicant_details: [],
          latest_application: {
            job_title: "",
            applicant_info: {
              id: "",
              bio_data: { full_name: "", user_name: "", profile_picture: "" },
              profile: {
                years_of_experience: "",
                field: "",
                industry: "",
                location: { state: "", lga: "", _id: "" },
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
        };

        setDashboardData(transformedData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const sidebarItems = useMemo(() => {
    if (isLoading || !dashboardData) {
      return defaultSidebarItems.map((item) => ({
        ...item,
        children:
          item.isSection && item.children
            ? item.children.map((child) => ({ ...child, href: "#" }))
            : undefined,
        href: item.href || "#",
      }));
    }

    return defaultSidebarItems.map((item) => {
      if (item.title === "Job Posted") {
        const jobPostedChildren = dashboardData.job_titles.map((jobTitle) => ({
          title: jobTitle,
          href: generateJobHref(jobTitle),
        }));
        return { ...item, children: jobPostedChildren };
      }
      return item;
    });
  }, [dashboardData, isLoading]);

  return (
    <>
      {/* Navigation Bar */}
      <div className="-mb-14 sm:-mb-13 md:-mb-12">
        <NavigationBar
          minimal={true}
          onProfileInfoUpdate={(name, picture) => {
            setProfileName(name);
            setProfilePicture(picture);
          }}
        />
      </div>

      <div className="min-h-screen bg-gray-50 pb-16 relative">
        {/* Profile Dropdown */}
        {/* <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 shadow flex items-center justify-end px-6">
          <div className="relative">
            <div className="flex items-center gap-2">
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
              <button
                type="button"
                onClick={() => setProfileModal((prev) => !prev)}
                className="bg-primary text-white rounded-md text-center text-sm capitalize cursor-pointer px-4 py-2"
              >
                Hey, {profileName}
              </button>
            </div>

            {profileModal && (
              <div className="absolute top-14 right-0 bg-white rounded-lg px-2 py-1 w-[150px] z-50 flex flex-col gap-2 shadow-lg border">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/creative-dashboard")}
                  className="h-10 px-4 rounded-md w-full hover:bg-gray-200 cursor-pointer"
                >
                  Visit Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoggingOut(true)}
                  className="h-10 px-4 rounded-md w-full hover:bg-gray-200 cursor-pointer disabled:opacity-50"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div> */}

        {/* Mobile menu button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-[60] bg-[#0A1754] text-white p-2 rounded-md"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <HiOutlineMenu className="w-6 h-6" />
        </button>

        <div className="flex pt-16">
          {/* Desktop Sidebar */}
          <aside className="w-64 bg-[#0A1754] min-h-[calc(100vh-73px)] text-white font-urbanist max-lg:hidden">
            {sidebarContent || (
              <nav className="p-4 space-y-2">
                {isLoading
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-8 bg-blue-900 rounded-md animate-pulse mb-2"
                      />
                    ))
                  : sidebarItems.map((item, index) => (
                      <div key={index}>
                        {item.isSection ? (
                          <div className="mb-4">
                            <div className="flex items-center space-x-3 py-2 px-3 border-b border-white">
                              <item.icon className="w-5 h-5" />
                              <span className="font-bold text-lg">
                                {item.title}
                              </span>
                            </div>
                            {item.children && item.children.length > 0 ? (
                              <div className="ml-8 mt-2 space-y-1">
                                {item.children.map((child, childIndex) => (
                                  <Link
                                    key={childIndex}
                                    href={child.href}
                                    className={cn(
                                      "block py-2 px-3 text-sm text-white font-urbanist font-normal rounded-md transition-colors hover:bg-blue-800 hover:text-white cursor-pointer",
                                      pathname === child.href &&
                                        "bg-blue-800 text-white font-medium"
                                    )}
                                  >
                                    {child.title}
                                  </Link>
                                ))}
                              </div>
                            ) : item.fallbackHref ? (
                              <Link
                                href={item.fallbackHref}
                                className="text-white/70 text-sm ml-8 mt-2 block hover:text-white transition-colors cursor-pointer"
                              >
                                View all messages
                              </Link>
                            ) : (
                              item.fallbackText && (
                                <p className="text-white/70 text-sm ml-8 mt-2">
                                  {item.fallbackText}
                                </p>
                              )
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href!}
                            className={cn(
                              "flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer",
                              pathname === item.href && "bg-blue-800"
                            )}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-bold text-xl">
                              {item.title}
                            </span>
                          </Link>
                        )}
                      </div>
                    ))}
              </nav>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                onClick={() => setIsMobileSidebarOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="fixed top-0 left-0 w-[280px] h-full shadow-lg z-50 flex flex-col px-6 py-4 bg-[#0A1754] text-white font-urbanist"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Dashboard</h2>
                  <button onClick={() => setIsMobileSidebarOpen(false)}>
                    <AiOutlineClose className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {sidebarItems.map((item, index) => (
                    <div key={index}>
                      {item.isSection ? (
                        <div className="mb-4">
                          <div className="flex items-center space-x-3 py-2 px-3 border-b border-white">
                            <item.icon className="w-5 h-5" />
                            <span className="font-bold text-lg">
                              {item.title}
                            </span>
                          </div>
                          {item.children && item.children.length > 0 ? (
                            <div className="ml-6 mt-2 space-y-1">
                              {item.children.map((child, childIndex) => (
                                <Link
                                  key={childIndex}
                                  href={child.href}
                                  onClick={() => setIsMobileSidebarOpen(false)}
                                  className={cn(
                                    "block py-2 px-3 text-sm text-white rounded-md hover:bg-blue-800 cursor-pointer",
                                    pathname === child.href &&
                                      "bg-blue-800 font-medium"
                                  )}
                                >
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          ) : item.fallbackHref ? (
                            <Link
                              href={item.fallbackHref}
                              onClick={() => setIsMobileSidebarOpen(false)}
                              className="ml-6 mt-2 block text-white/70 text-sm hover:text-white transition-colors cursor-pointer"
                            >
                              View all messages
                            </Link>
                          ) : (
                            item.fallbackText && (
                              <p className="ml-6 mt-2 text-white/70 text-sm">
                                {item.fallbackText}
                              </p>
                            )
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-blue-800 cursor-pointer",
                            pathname === item.href && "bg-blue-800 font-medium"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-bold">{item.title}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    className="w-full py-2 px-4 rounded-md bg-red-500 text-white font-medium hover:bg-red-600"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
