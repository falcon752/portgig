"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCreatorsApi } from "@/src/lib/requests/creatorsForRecruiter";
import { trackProfileViewApi } from "@/src/lib/requests/creative-profile";
import { LoadingSpinner } from "@/src/utils/util_component";
import Buttons from "@/src/components/Buttons";
import { IoMdCheckmark } from "react-icons/io";
import { HiXMark } from "react-icons/hi2";
import { createOrGetChatRoom } from "@/src/lib/firebase/chat";
import { useAppSelector } from "@/src/redux/hooks";
import { useState, useEffect } from "react";
import { getUserId } from "@/src/utils/chats";

type SkillLevel = "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert";

const mapExperienceToSkillLevel = (yearsOfExperience: string | number): SkillLevel => {
  const years =
    typeof yearsOfExperience === "string"
      ? yearsOfExperience.match(/(\d+)/)
        ? Number.parseInt(yearsOfExperience.match(/(\d+)/)?.[1] || "0", 10)
        : Number(yearsOfExperience) || 0
      : yearsOfExperience || 0;

  if (years <= 1) return "Beginner";
  else if (years === 2) return "Intermediate";
  else if (years === 3) return "Mid-level";
  else if (years >= 4 && years <= 6) return "Professional";
  else return "Expert";
};

const ProfileCard = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const creativeId = params.id as string;
  const [chatLoading, setChatLoading] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);

  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  const currentUser = profile || recruiterProfile;
  const currentUserId = getUserId(currentUser);
  const currentUserType = profile ? "creator" : "recruiter";

  const { data: creatorsResponse, isLoading, isError, error } = useQuery({
    queryKey: ["creators"],
    queryFn: fetchCreatorsApi,
  });
  const creators = creatorsResponse?.data?.page_data || [];
  const creative = creators.find((c: any) => c._id === creativeId);

  useEffect(() => {
    const trackView = async () => {
      if (
        viewTracked ||
        !currentUserId ||
        !creative ||
        currentUserId === creativeId
      ) {
        return;
      }

      try {
        await trackProfileViewApi({
          userId: creativeId,
          viewerId: currentUserId,
          recipientRole: currentUserType === "recruiter" ? "recruiter" : "creator",
        });

        setViewTracked(true);
      } catch {
        // silently fail
      }
    };

    if (creative && currentUserId && !viewTracked) {
      trackView();
    }
  }, [creative, currentUserId, creativeId, viewTracked, currentUserType]);

  const handleGoBack = () => {
    router.push("/creatives-hub");
  };

  const handleViewPortfolio = () => {
    if (creative?.portfolio?.template_type) {
      let portfolioPath = "";
      switch (creative.portfolio.template_type) {
        case "WRITER":
          portfolioPath = `/template-4/${creativeId}`;
          break;
        case "VIDEOGRAPHER":
          portfolioPath = `/template-2/${creativeId}`;
          break;
        case "DEVELOPER":
          portfolioPath = `/template-3/${creativeId}`;
          break;
        case "PHOTOGRAPHER":
          portfolioPath = `/template-6/${creativeId}`;
          break;
        case "SOCIAL_MEDIA_MANAGER":
          portfolioPath = `/template-5/${creativeId}`;
          break;
        case "DESIGNER":
          portfolioPath = `/template-1/${creativeId}`;
          break;
        default:
          return;
      }
      router.push(portfolioPath);
    }
  };

  const handleStartChat = async () => {
    const creativeUserId = getUserId(creative);

    if (!currentUserId || !creativeUserId || chatLoading || !currentUser || !creative) {
      return;
    }

    setChatLoading(true);
    try {
      const creativeUserType = "creative";

      const chatId = await createOrGetChatRoom(
        currentUser,
        creative,
        currentUserType === "creator" ? "creative" : "recruiter",
        creativeUserType
      );

      router.push(`/chats/${chatId}`);
    } catch {
      alert("Failed to start chat. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="center h-screen">
        <LoadingSpinner className="border-primary w-16 h-16" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-secondary text-lg font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">{error?.message || "An error occurred."}</p>
        </div>
      </div>
    );
  }

  if (!creative) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-secondary text-lg font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Creative not found.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="my-20 text-primary font-raleway">
      <div className="mx-3">
        <div className="relative w-full max-w-5xl lg:mx-auto flex flex-col gap-10 shadow rounded px-0 sm:px-10 lg:px-12 py-6 sm:py-10 lg:py-12 bg-primary lg:bg-white text-white lg:text-primary transition-all duration-300 
          md:gap-8 md:px-8 md:py-10 md:rounded-2xl md:max-w-4xl">
          
          {/* Skill Label */}
          <div className="absolute -top-6 right-4 lg:-top-8 bg-[#5B84C4] text-white px-6 py-1 text-sm lg:text-2xl font-ramaraja shadow md:-top-5 md:text-base md:px-4">
            {mapExperienceToSkillLevel(creative.profile?.years_of_experience || 0)}
          </div>

          {/* Top Section */}
          <div className="flex flex-row items-start gap-6 lg:gap-10 w-full md:gap-5 md:flex-wrap md:justify-center">
            <div className="flex flex-col items-center gap-3 min-w-[100px] md:min-w-[120px] md:items-center">
              <Image
                src={creative.profile?.profile_picture || "/assets/creativeImage.svg"}
                alt="profile image"
                width={144}
                height={144}
                className="h-36 w-36 rounded-full object-cover md:h-40 md:w-40"
              />
            </div>
            <div className="flex-1 text-left md:text-center md:max-w-md">
              <h2 className="text-xl md:text-2xl lg:text-5xl font-bold mb-1 md:mb-2">
                {creative.bio_data?.full_name || "Unknown"}
              </h2>
              <p className="text-sm lg:text-2xl mb-1 whitespace-nowrap md:text-base">
                {creative.profile?.field || "N/A"} / {creative.profile?.location?.state || "N/A"}
              </p>
              <p className="text-[8px] lg:text-xl leading-relaxed text-white lg:text-primary max-md:mt-10 md:text-sm md:leading-relaxed md:max-w-xl md:mx-auto">
                {creative.bio_data?.bio || creative.profile?.bio || "No bio available"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-4 w-full px-4 md:px-0 md:justify-center md:gap-6 md:flex-wrap">
            <Buttons
              label={chatLoading ? "Starting Chat..." : "Let's Chat"}
              className="flex-1 max-w-[210px] bg-white! text-primary! lg:bg-primary! lg:text-white! rounded! px-6! py-3! text-sm! sm:text-base! lg:text-xl! whitespace-nowrap disabled:opacity-50 md:text-base!"
              onClick={handleStartChat}
              disabled={chatLoading || !currentUser}
            />
            <Buttons
              label="View My Portfolio"
              className="flex-1 max-w-[210px] bg-white! text-primary! lg:bg-primary! lg:text-white! rounded! px-6! py-3! text-sm! sm:text-base! lg:text-xl! whitespace-nowrap md:text-base!"
              onClick={handleViewPortfolio}
            />
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="-mx-4 sm:mx-auto flex justify-between max-w-5xl mt-10 px-8 sm:px-0 md:max-w-4xl md:px-10">
        <button
          onClick={handleGoBack}
          className="bg-primary text-white px-4 sm:px-8 py-3 rounded-full flex items-center justify-center min-w-[140px] sm:min-w-[160px] cursor-pointer md:min-w-[150px]"
        >
          <HiXMark className="text-xl font-bold" />
        </button>
        <button
          onClick={handleGoBack}
          className="bg-primary text-white px-4 sm:px-8 py-3 rounded-full flex items-center justify-center min-w-[140px] sm:min-w-[160px] cursor-pointer md:min-w-[150px]"
        >
          <IoMdCheckmark className="text-lg" />
        </button>
      </div>
    </main>
  );
};

export default ProfileCard;
