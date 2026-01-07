"use client";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { CandidateCard } from "@/src/components/Candidate-card";
import { Pagination } from "@/src/components/Pagination";
import Image from "next/image";
import { CandidateInfo } from "@/src/components/recruiter-dashboard/Candidate-info";
import {
  getRecruiterDashboard,
  updateApplicantStatus,
} from "@/src/lib/requests/recruiterApi";
import toast from "react-hot-toast";
import AuthStorage from "@/src/lib/requests/auth.new";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { fetchRecruiterProfile } from "@/src/redux/features/user/recruiterSlice";
import { fetchUserProfile } from "@/src/redux/features/user/userSlice";
import { createOrGetChatRoom } from "@/src/lib/firebase/chat";
import { getUserId } from "@/src/utils/chats";
import { useRouter } from "next/navigation";

import type {
  RecruiterDashboardData,
  ShortlistedCandidate as ApiShortlistedCandidate,
  ApplicantInfo as ApiApplicantInfo,
} from "@/src/lib/requests/recruiterApi";

type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Mid-level"
  | "Professional"
  | "Expert";

interface EnhancedShortlistedCandidate extends ApiShortlistedCandidate {
  cover_letter?: string;
  job_id?: string;
}

interface EnhancedApplicantInfo extends ApiApplicantInfo {
  profile: ApiApplicantInfo["profile"] & {
    email?: string;
    full_name?: string;
    bio?: string;
    phone_number?: string;
  };
}

interface TransformedCandidate {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  avatar: string;
  skillLevel: SkillLevel;
  cover_letter?: string;
  profile: EnhancedApplicantInfo;
  industry?: string;
  yearsOfExperience: string;
  field: string;
  applicationDate: string;
  jobId: string | null;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onChat?: () => void;
  chatLoading?: boolean;
}

const mapExperienceToSkillLevel = (yearsOfExperience: string): SkillLevel => {
  const yearMatch = yearsOfExperience?.match(/(\d+)/);
  const years = yearMatch ? Number.parseInt(yearMatch[1], 10) : 0;

  if (years <= 1) return "Beginner";
  if (years === 2) return "Intermediate";
  if (years === 3) return "Mid-level";
  if (years >= 4 && years <= 6) return "Professional";
  return "Expert";
};

export default function ShortlistedCandidatesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  const [userType] = useState(AuthStorage.getUserType());

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);

  const profilePicture =
    userType === "recruiter"
      ? recruiterProfile?.profile?.profile_picture || "/assets/creative.svg"
      : profile?.profile?.profile_picture || "/assets/creative.svg";

  const currentUser = userType === "recruiter" ? recruiterProfile : profile;
  const currentUserId = getUserId(currentUser);
  const currentUserType = userType;

  useEffect(() => {
    if (AuthStorage.isAuthenticated()) {
      if (userType === "recruiter") {
        dispatch(fetchRecruiterProfile());
      } else {
        dispatch(fetchUserProfile());
      }
    }
  }, [dispatch, userType]);

  // Safe transform function
  const transformShortlistedData = (
    shortlistedApplicants: EnhancedShortlistedCandidate[] = []
  ): TransformedCandidate[] => {
    return shortlistedApplicants.filter(Boolean).map((applicant, index) => {
      const profileInfo: EnhancedApplicantInfo["profile"] =
        applicant?.applicant_info?.profile ||
        ({} as EnhancedApplicantInfo["profile"]);
      const bioData = applicant?.applicant_info?.bio_data || {};

      return {
        id: applicant?.applicant_info?.id || `shortlisted-${index + 1}`,
        name: bioData.full_name || "No Name",
        role: applicant?.job_title || "N/A",
        location:
          `${profileInfo?.location?.lga || ""}, ${
            profileInfo?.location?.state || ""
          }`.replace(/^, |, $/g, "") || "Location not specified",
        email: (profileInfo as { email?: string })?.email || "N/A", // ✅ cast here
        skillLevel: mapExperienceToSkillLevel(
          profileInfo?.years_of_experience || "0"
        ),
        avatar: profileInfo?.profile_picture || "/assets/creative.svg",
        industry: profileInfo?.industry,
        cover_letter: applicant?.cover_letter,
        profile: applicant?.applicant_info as EnhancedApplicantInfo,
        yearsOfExperience: profileInfo?.years_of_experience || "0",
        field: profileInfo?.field || "N/A",
        applicationDate: applicant?.application_date || "N/A",
        jobId: applicant?.job_id || null,
      };
    });
  };

  const handleCandidateRemoved = (candidateId: string) => {
    if (!dashboardData) return;

    const updatedShortlisted = dashboardData.shortlisted_applicants.filter(
      (applicant) => applicant?.applicant_info?.id !== candidateId
    );

    setDashboardData({
      ...dashboardData,
      shortlisted_applicants: updatedShortlisted,
    });

    if (selectedCandidateId === candidateId) {
      const transformed = transformShortlistedData(updatedShortlisted);
      setSelectedCandidateId(transformed.length > 0 ? transformed[0].id : null);
    }
  };

  const handleStartChat = async (candidate: TransformedCandidate) => {
    const candidateUserId = getUserId(candidate);
    if (
      !currentUserId ||
      !candidateUserId ||
      chatLoading ||
      !currentUser ||
      !candidate
    )
      return;

    setChatLoading(true);
    try {
      const candidateUserType = "creative";
      const chatId = await createOrGetChatRoom(
        currentUser,
        candidate,
        currentUserType === "creator" ? "creative" : "recruiter",
        candidateUserType
      );
      router.push(`/chats/${chatId}`);
    } catch (err) {
      console.error("Error starting chat:", err);
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRecruiterDashboard();
        setDashboardData(data);
        setError(null);

        if (data?.shortlisted_applicants?.length > 0) {
          // Desktop only: auto-select first candidate
          if (window.innerWidth >= 768) {
            const transformed = transformShortlistedData(
              data.shortlisted_applicants
            );
            setSelectedCandidateId(transformed[0]?.id || null);
          } else {
            // Mobile: show list first
            setSelectedCandidateId(null);
          }
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch shortlisted candidates";
        setError(message);
        console.error("Error fetching shortlisted candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refetchTrigger]);

  const handleStatusUpdate = async (status: string, candidateId?: string) => {
    const candidates = dashboardData
      ? transformShortlistedData(dashboardData.shortlisted_applicants)
      : [];
    const candidateToUpdate = candidates.find(
      (c) => c.id === (candidateId || selectedCandidateId)
    );
    if (!candidateToUpdate) return;

    try {
      const result = await updateApplicantStatus({
        job_id: candidateToUpdate.jobId || "unknown",
        creator_id: candidateToUpdate.id,
        status: status as
          | "PENDING"
          | "SHORTLISTED"
          | "NOT_QUALIFIED"
          | "SELECTED",
      });
      toast.success(result.message || "Status updated successfully!");
      setRefetchTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err.message || "Error updating status. Please try again.");
    }
  };

  const candidates = dashboardData
    ? transformShortlistedData(dashboardData.shortlisted_applicants)
    : [];

  const filteredCandidates = candidates.filter((candidate) => {
    if (experienceFilter === "all") return true;
    return (
      candidate.skillLevel.toLowerCase() === experienceFilter.toLowerCase()
    );
  });

  const shortlistedCount = candidates.length;
  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || null;

  if (loading)
    return (
      <p className="text-center py-20">Loading Shortlisted Candidates...</p>
    );
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;

  return (
    <div className="bg-gray-50 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="w-full px-4 py-6 md:px-6">
        <div className="hidden md:flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-black">
            <Image
              src="/assets/Vector.png"
              alt="Dashboard icon"
              width={20}
              height={20}
            />
            <span className="text-2xl font-bold font-raleway text-[#0A1754]">
              Dashboard
            </span>
          </div>
          <div className="flex items-center justify-center mr-10">
            <Image
              src={profilePicture || "/placeholder.svg"}
              alt="User profile"
              width={200}
              height={200}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-[10px] font-bold text-[#0A1754] font-raleway md:text-2xl lg:ml-10">
            Shortlisted Candidates Applications
          </h1>
          <div className="bg-[#0A1754] text-white px-3 py-2 rounded-md text-[10px] font-bold font-raleway md:hidden">
            Shortlisted Talents
            <p className="text-center">({shortlistedCount})</p>
          </div>
          <span className="hidden md:block text-[10px] md:text-xl lg:text-2xl font-bold font-raleway text-black lg:mr-20">
            Shortlisted Talents ({shortlistedCount})
          </span>
        </div>
      </div>

      <div className="border-b-2 border-black mb-5" />

      <div className="flex flex-col md:flex-row flex-1 h-full px-4 md:px-6">
        {/* Left Side - Candidates List */}
        <div className="w-full md:flex-1 md:max-w-[50%]">
          <div className="mb-6 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
            <select
              className="w-full appearance-none border border-gray-300 rounded-md pl-10 pr-10 py-3 bg-white text-gray-700 font-raleway focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <option value="all">Filter by Experience</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (2 years)</option>
              <option value="mid-level">Mid-level (3 years)</option>
              <option value="professional">Professional (4-6 years)</option>
              <option value="expert">Expert (7+ years)</option>
            </select>
          </div>

          {filteredCandidates.length > 0 ? (
            <>
              <div className="space-y-3 mb-6">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    {...candidate}
                    isSelected={selectedCandidateId === candidate.id}
                    onSelect={setSelectedCandidateId}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCandidates.length / 10)}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#0A1754] text-lg">
                {experienceFilter === "all"
                  ? "No shortlisted candidates found"
                  : `No ${experienceFilter} candidates found`}
              </p>
              <p className="text-[#0A1754] text-sm mt-2">
                {experienceFilter === "all"
                  ? "Candidates will appear here once they are shortlisted for jobs"
                  : "Try selecting a different experience level filter"}
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Candidate Info */}
        <div className="hidden md:block md:flex-1 md:max-w-[50%] md:ml-20">
          <CandidateInfo
            candidate={selectedCandidate}
            onCandidateRemoved={handleCandidateRemoved}
            onStatusUpdate={handleStatusUpdate}
            onChat={
              selectedCandidate
                ? () => handleStartChat(selectedCandidate)
                : undefined
            }
          />
        </div>
      </div>

      {/* Mobile Candidate Info */}
      {selectedCandidate && (
        <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setSelectedCandidateId(null)}
              className="mb-4 text-[#0A1754] font-bold"
            >
              ← Back to list
            </button>
            <CandidateInfo
              candidate={selectedCandidate}
              onCandidateRemoved={handleCandidateRemoved}
              onStatusUpdate={handleStatusUpdate}
              onChat={() => handleStartChat(selectedCandidate)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
