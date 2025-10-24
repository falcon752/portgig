"use client";
import type React from "react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import {
  getAllJobs,
  type RecruiterDashboardData,
} from "../lib/requests/recruiterApi";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

// Helper function specifically for job titles to ensure proper formatting
const generateJobHref = (jobTitle: string) => {
  const slug = jobTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `/recruiter-dashboard/jobs/${slug}`;
};

// Define a more robust interface for sidebar items
interface SidebarItem {
  title: string;
  icon: React.ElementType; 
  href?: string; 
  isSection: boolean; 
  children?: { title: string; href: string }[]; 
  fallbackText?: string; 
  fallbackHref?: string; // Add fallback href for clickable fallback text
}

// Updated default sidebar items with explicit hrefs and fallbackText
const defaultSidebarItems: SidebarItem[] = [
  {
    title: "Profile & Account",
    href: "/recruiter-dashboard",
    icon: User,
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
      { title: "active-jobs", href: "/recruiter-dashboard/active-jobs" },
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
      }
    ],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    isSection: true,
    children: [],
    fallbackHref: "/chats", // Add fallback href for messages
  },
  {
    title: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
    isSection: false,
  },
];

export default function DashboardLayout({
  children,
  sidebarContent,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        // Fetch all active jobs using getAllJobs
        const response = await getAllJobs({ status: 'ACTIVE' });
        const jobs = response.data.page_data || [];
        
        // Extract job titles from the response
        const jobTitles = jobs.map((job: any) => job.title || job.job_title || '').filter(Boolean);
        
        // Calculate total applicants from all jobs
        const totalApplicants = jobs.reduce((total: number, job: any) => {
          const applicantsCount = job.applicants?.length || 0;
          return total + applicantsCount;
        }, 0);

        // Transform the data to match RecruiterDashboardData structure
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
              bio_data: {
                full_name: "", 
                user_name: "",
                profile_picture: "",
              },
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
        console.error("Failed to fetch dashboard data for sidebar:", error);
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
                id:"",
              bio_data: {
                  full_name: "", user_name: "",
                  profile_picture: "",
              },
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
        });
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
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="flex">
        {/* Sidebar */}
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
                            <span className="font-bold text-lg lg:text-xl">
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
                            // For Messages section, make the fallback clickable and redirect to /chats
                            <Link
                              href={item.fallbackHref}
                              className="text-white/70 text-sm ml-8 mt-2 block hover:text-white transition-colors cursor-pointer"
                            >
                              View all messages
                            </Link>
                          ) : (
                            // For other sections, show fallback text only if it exists
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

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}