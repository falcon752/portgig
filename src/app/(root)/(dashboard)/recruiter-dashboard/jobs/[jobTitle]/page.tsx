"use client";
import { useState, useEffect, use } from "react";
import { Filter } from "lucide-react";
import { Pagination } from "@/src/components/Pagination";
import Image from "next/image";
import { getJobApplications } from "@/src/lib/requests/recruiterApi";
import AuthStorage from "@/src/lib/requests/auth.new";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { fetchRecruiterProfile } from "@/src/redux/features/user/recruiterSlice";
import { fetchUserProfile } from "@/src/redux/features/user/userSlice";
import { createOrGetChatRoom } from "@/src/lib/firebase/chat";
import { getUserId } from "@/src/utils/chats";
import { useRouter } from "next/navigation";
import { CandidateInfoPanel } from "@/src/components/Candidate-info-panel";
import { CandidateCard } from "@/src/components/Candidate-card";

interface JobApplicationPageProps {
  params: Promise<{ jobTitle: string }>;
}

interface JobApplicationResponse {
  page_data: any;
  total_applications: number;
  shortlisted_talents: number;
  selected_candidates_count: number;
  candidates: any[];
  job_description?: string;
  requirements?: string[];
}

const formatJobTitleForDisplay = (jobTitleSlug: string) => {
  return decodeURIComponent(jobTitleSlug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface CandidateCardProps {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  skillLevel:
    | "Beginner"
    | "Intermediate"
    | "Mid-level"
    | "Professional"
    | "Expert";
  avatar: string;
  industry?: string;
  cover_letter?: string;
  profile?: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onChat?: () => void;
  chatLoading?: boolean;
}

export default function JobApplicationPage({
  params,
}: JobApplicationPageProps) {
  const resolvedParams = use(params);
  const { jobTitle: jobTitleSlug } = resolvedParams;
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  const [userType] = useState(AuthStorage.getUserType());

  const [jobDetails, setJobDetails] = useState<JobApplicationResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  const [extractedIds, setExtractedIds] = useState({
    jobId: null as string | null,
    recruiterId: null as string | null,
    creatorIds: [] as string[],
  });

  const jobTitleForDisplay = formatJobTitleForDisplay(jobTitleSlug);

  const profilePicture =
    userType === "recruiter"
      ? recruiterProfile?.profile?.profile_picture || "/assets/creative.svg"
      : profile?.profile?.profile_picture || "/assets/creative.svg";

  const currentUser = userType === "recruiter" ? recruiterProfile : profile;
  const currentUserId = getUserId(currentUser);
  const currentUserType = userType;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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
    const fetchJobData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getJobApplications(jobTitleSlug, experienceFilter);
        const job = data?.data?.page_data?.[0];
        const candidates = job?.applicants || [];

        const ids = {
          jobId: job?._id || null,
          recruiterId: job?.recruiter_id || null,
          creatorIds: candidates.map((applicant: any) => applicant.id),
        };

        setExtractedIds(ids);
        setJobDetails({
          ...data.data,
          candidates: candidates,
          total_applications: candidates.length,
          shortlisted_talents: job?.applicant_status_counts?.shortlisted || 0,
          selected_candidates_count:
            job?.applicant_status_counts?.selected || 0,
        });

        if (!isMobile) {
          // Desktop: auto-select first candidate if none selected
          if (candidates.length > 0 && !selectedCandidateId) {
            setSelectedCandidateId(candidates[0].id);
          }
        } else {
          // Mobile: always start with no selection
          setSelectedCandidateId(null);
        }
      } catch (err) {
        console.error("Failed to fetch job application data:", err);
        setError("Failed to load job applications. Please try again.");
        setJobDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobTitleSlug, experienceFilter, isMobile]);

  const candidates = jobDetails?.candidates || [];
  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || null;

  const handleStartChat = async (candidate: any) => {
    const candidateUserId = getUserId(candidate);

    if (
      !currentUserId ||
      !candidateUserId ||
      chatLoading ||
      !currentUser ||
      !candidate
    ) {
      console.error("Missing required data:", {
        currentUserId,
        candidateUserId,
        hasCurrentUser: !!currentUser,
        hasCandidate: !!candidate,
      });
      return;
    }

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
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleViewCV = () => {
    console.log("CV viewing handled by CandidateInfoPanel");
  };

  const handleStatusUpdate = (status: string) => {
    console.log(
      `Status updated to: ${status} for candidate: ${selectedCandidateId}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Loading job applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!jobDetails || candidates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">
          No candidates found for &rdquo;{jobTitleForDisplay}&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 max-w-7xl mx-auto">
      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="mb-4 md:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-sm text-black max-md:mb-5">
              <Image
                src="/assets/Vector.png"
                alt="Dashboard icon"
                width={20}
                height={20}
                className="md:w-6 md:h-6 lg:w-7 lg:h-7"
              />
              <span className="text-xs md:text-xl lg:text-2xl font-bold font-raleway text-[#0A1754]">
                Dashboard
              </span>
            </div>
            <div className="max-md:hidden w-full max-w-xs mx-auto lg:mx-0 flex items-center justify-center">
              <Image
                src={profilePicture || "/placeholder.svg"}
                alt="User profile"
                width={600}
                height={600}
                className="rounded-full object-cover w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
              />
            </div>
          </div>
          <h1 className="text-sm md:text-xl lg:text-2xl font-bold text-[#0A1754] max-md:mb-7 font-raleway md:ml-10 lg:ml-12">
            {jobTitleForDisplay} Application
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-10 mb-0 max-w-4xl md:ml-10 lg:ml-12 font-raleway font-bold">
          <div className="bg-[#0A1754] text-white p-3 md:p-5 lg:p-6 rounded-lg text-center">
            <h3 className="text-[10px] md:text-base lg:text-xl font-medium mb-1">
              Total Applications
            </h3>
            <p className="text-xs md:text-2xl lg:text-4xl font-bold">
              {jobDetails.total_applications}
            </p>
          </div>
          <div className="bg-[#0A1754] text-white p-3 md:p-5 lg:p-6 rounded-lg text-center">
            <h3 className="text-[10px] md:text-base lg:text-xl font-medium mb-1">
              Shortlisted Talents
            </h3>
            <p className="text-xs md:text-2xl lg:text-4xl font-bold">
              {jobDetails.shortlisted_talents}
            </p>
          </div>
          <div className="bg-[#0A1754] text-white p-3 md:p-5 lg:p-6 rounded-lg text-center">
            <h3 className="text-[10px] md:text-base lg:text-xl font-medium mb-1">
              Selected Candidate
            </h3>
            <p className="text-xs md:text-2xl lg:text-4xl font-bold">
              {jobDetails.selected_candidates_count}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-5 max-xl:hidden">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[90vw] border-b-2 border-black" />
      </div>

      <div className="flex flex-col md:flex-row flex-1 h-full">
        <div
          className={`flex-1 w-full md:max-w-[50%] px-4 md:px-6 lg:px-8 ${
            selectedCandidateId ? "hidden md:block" : "block"
          }`}
        >
          <div className="mb-4 md:mb-6">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <select
                className="w-full appearance-none border border-gray-300 rounded-md pl-10 md:pl-12 pr-10 py-3 md:py-4 bg-white text-gray-700 text-sm md:text-base font-raleway focus:outline-none focus:ring-2 focus:ring-[#0A1754] cursor-pointer"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                <option value="all" className="font-raleway">
                  Filter by Experience
                </option>
                <option value="expert" className="font-raleway">
                  Expert
                </option>
                <option value="intermediate" className="font-raleway">
                  Intermediate
                </option>
                <option value="beginner" className="font-raleway">
                  Beginner
                </option>
                <option value="mid-level" className="font-raleway">
                  Mid-level
                </option>
                <option value="professional" className="font-raleway">
                  Professional
                </option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-600 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 lg:space-y-5 max-md:mt-5 mb-4 md:mb-6">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  {...mapApiCandidateToCardProps(candidate)}
                  isSelected={selectedCandidateId === candidate.id}
                  onSelect={setSelectedCandidateId}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center text-sm md:text-base">
                No candidates found for this job with the current filters.
              </p>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(jobDetails.total_applications / 10)}
            onPageChange={setCurrentPage}
          />
        </div>

        <div className="hidden md:flex flex-1 max-w-[50%] md:ml-12 lg:ml-20">
          {selectedCandidate ? (
            <CandidateInfoPanel
              candidate={mapApiCandidateToCardProps(selectedCandidate)}
              jobId={extractedIds.jobId}
              recruiterId={extractedIds.recruiterId}
              onStatusUpdate={handleStatusUpdate}
              onViewCV={handleViewCV}
              onChat={() => handleStartChat(selectedCandidate)}
              chatLoading={chatLoading}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-sm md:text-base lg:text-lg">
                Select a candidate to view details.
              </p>
            </div>
          )}
        </div>

        {selectedCandidate && (
          <div className="md:hidden fixed inset-0 bg-white z-40 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setSelectedCandidateId(null)}
                className="max-md:mt-10 lg:mb-4 flex items-center text-[#0A1754] font-bold text-lg hover:text-opacity-80 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to list
              </button>
              <CandidateInfoPanel
                candidate={mapApiCandidateToCardProps(selectedCandidate)}
                jobId={extractedIds.jobId}
                recruiterId={extractedIds.recruiterId}
                onStatusUpdate={handleStatusUpdate}
                onViewCV={handleViewCV}
                onChat={() => handleStartChat(selectedCandidate)}
                chatLoading={chatLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapApiCandidateToCardProps = (applicant: any): CandidateCardProps => {
  const profile = applicant.profile || {};
  const locationData = profile.location || {};

  const yearsExpText = profile.years_of_experience || "0";
  const yearsExp = Number.parseInt(yearsExpText) || 0;

  let skillLevel: CandidateCardProps["skillLevel"] = "Beginner";

  if (yearsExp >= 5) skillLevel = "Expert";
  else if (yearsExp >= 3) skillLevel = "Professional";
  else if (yearsExp >= 2) skillLevel = "Mid-level";
  else if (yearsExp >= 1) skillLevel = "Intermediate";

  return {
    id: applicant.id,
    name: applicant.full_name || profile.full_name || "Unknown Candidate",
    role: profile.field || profile.industry || "Not specified",
    location:
      `${locationData.lga || ""}, ${locationData.state || ""}`.trim() ||
      "Location not specified",
    email: applicant.email || profile.email || "N/A",
    skillLevel: skillLevel,
    avatar: profile.profile_picture || "/assets/creative.svg",
    industry: profile.industry,
    cover_letter: applicant.cover_letter,
    profile: profile,
  };
};
