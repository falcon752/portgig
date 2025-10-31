"use client";

import { Buttons } from "@/src/components/export_components";
import { fetchCreatorsApi, type Creator } from "@/src/lib/requests/creators";
import { cn } from "@/src/utils/cn";
import { LooadingSpinner } from "@/src/utils/util_component";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/src/utils/chats";
import { useAppSelector } from "@/src/redux/hooks";
import { useState } from "react";
import { createOrGetChatRoom } from "@/src/lib/firebase/chat";
import Image from "next/image";

type SkillLevel = "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert";

const mapExperienceToSkillLevel = (yearsOfExperience: string | number): SkillLevel => {
  const years =
    typeof yearsOfExperience === "string"
      ? yearsOfExperience.match(/(\d+)/)
        ? Number.parseInt(yearsOfExperience.match(/(\d+)/)?.[1] || "0", 10)
        : Number(yearsOfExperience) || 0
      : yearsOfExperience || 0;

  if (years <= 1) return "Beginner";
  if (years === 2) return "Intermediate";
  if (years === 3) return "Mid-level";
  if (years >= 4 && years <= 6) return "Professional";
  return "Expert";
};

const getCreatorDisplayInfo = (creator: Creator) => {
  const profilePicture =
    creator.profile?.profile?.profile_picture || "/assets/creative.svg";

  const locationText = creator.profile?.profile?.location
    ? `${creator.profile?.profile?.location?.state}, ${creator?.profile?.profile?.location?.lga}`
    : "Location not specified";

  const fieldText =
    creator.profile?.profile?.field ||
    creator.profile?.profile?.industry ||
    "Field not specified";

  const bioText =
    creator.profile?.profile?.bio ||
    creator.bio_data?.bio ||
    "No introduction available";

  return { profilePicture, locationText, fieldText, bioText };
};

export default function ExploreCreatives() {
  const navigate = useRouter();
  const [chatLoading, setChatLoading] = useState<string | null>(null);
  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  const currentUser = profile || recruiterProfile;

  const { data: creatorsResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["creators"],
    queryFn: fetchCreatorsApi,
  });

  const creators = creatorsResponse?.data?.page_data || [];
  const randomCreators = creators.sort(() => Math.random() - 0.5).slice(0, 9);
  const hasCreators = randomCreators.length > 0;

  const handleViewProfile = (creatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate.push(`/profile-card/${creatorId}`);
  };

  const handleStartChat = async (creative: Creator) => {
    const currentUserId = getUserId(currentUser);
    const creativeId = getUserId(creative);
    if (!currentUserId || !creativeId || chatLoading === creative._id || !currentUser || !creative) return;
    setChatLoading(creative._id);
    try {
      const currentUserType = profile ? "creative" : "recruiter";
      const chatId = await createOrGetChatRoom(currentUser, creative, currentUserType, "creative");
      navigate.push(`/chats/${chatId}`);
    } catch {
      alert("Failed to start chat. Please try again.");
    } finally {
      setChatLoading(null);
    }
  };

  const renderLoadingState = () => (
    <div className={cn("col-span-full flex justify-center items-center h-64")}>
      <LooadingSpinner className={cn("border-primary w-16 h-16")} />
    </div>
  );

  const renderErrorState = () => (
    <div className={cn("col-span-full flex items-center justify-center min-h-[300px]")}>
      <div className={cn("text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md")}>
        <p className={cn("text-red-500 mb-4")}>
          {error?.message || "An unknown error occurred."}
        </p>
        <button
          onClick={() => refetch()}
          className={cn("bg-primary text-white px-4 py-2 rounded-lg cursor-pointer")}
        >
          Retry
        </button>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className={cn("col-span-full flex items-center justify-center min-h-[300px]")}>
      <div className={cn("text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md")}>
        <p className={cn("text-gray-500 mb-4")}>No Creatives found.</p>
        <button
          onClick={() => refetch()}
          className={cn("bg-primary text-white px-4 py-2 rounded-lg cursor-pointer")}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <section className={cn("flex flex-col gap-6 font-raleway")}>
      <div className={cn("max-w-[1200px] mx-auto w-full px-4")}>
        <h2
          className={cn("text-lg sm:text-xl lg:text-2xl font-bold text-[#00489A] mt-4")}
        >
          Meet Creatives
        </h2>
      </div>

      <div
        className={cn(
          "max-w-[1250px] mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        )}
      >
        {isLoading && renderLoadingState()}
        {isError && renderErrorState()}
        {!isLoading && !isError && !hasCreators && renderEmptyState()}

        {!isLoading &&
          !isError &&
          hasCreators &&
          randomCreators.map((creator) => {
            const { profilePicture, locationText, fieldText, bioText } =
              getCreatorDisplayInfo(creator);

            return (
              <div
                key={creator._id}
                className={cn(
                  "flex flex-col gap-2 pb-5 px-5 rounded-lg shadow-lg bg-white text-primary hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                )}
              >
                <div className={cn("flex justify-between items-center")}>
                  <div
                    className={cn(
                      "relative h-[100px] w-[100px] rounded-lg overflow-hidden bg-gray-200"
                    )}
                  >
                    <Image
                      src={profilePicture}
                      alt={`${creator.bio_data.full_name}'s profile picture`}
                      fill
                      className="object-cover"
                      sizes="100px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/creative.svg";
                      }}
                    />
                  </div>
                  <div
                    className={cn(
                      "bg-secondary/70 text-white py-2 px-5 font-ramaraja w-32 md:w-36 text-center"
                    )}
                  >
                    {mapExperienceToSkillLevel(
                      creator.profile?.profile?.years_of_experience || "0"
                    )}
                  </div>
                </div>

                <h2 className={cn("font-bold text-sm px-5")}>
                  {creator.bio_data.full_name}
                </h2>
                <h3 className={cn("font-extralight text-sm px-5 line-clamp-1")}>
                  {fieldText} / {locationText}
                </h3>
                <div
                  className={cn(
                    "h-14 p-1 border border-gray-100 bg-gray-50 text-primary text-xs line-clamp-3"
                  )}
                >
                  {bioText}
                </div>

                <div className={cn("flex justify-between px-2 mt-5")}>
                  <button
                    onClick={(e) => handleViewProfile(creator._id, e)}
                    className={cn(
                      "py-2 px-5 w-fit rounded-lg text-sm font-medium bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors"
                    )}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartChat(creator);
                    }}
                    disabled={chatLoading === creator._id || !currentUser}
                    className={cn(
                      "py-2 px-5 w-fit rounded-lg text-sm font-medium bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {chatLoading === creator._id ? "Connecting..." : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div className={cn("max-w-[1200px] mx-auto w-full flex justify-end px-4")}>
        <Link href="/creatives-hub">
          <Buttons
            label="Visit Creatives Hub"
            className={cn(
              "bg-primary! w-fit rounded-lg font-bold text-sm lg:text-xl text-white hover:bg-opacity-90 transition"
            )}
          />
        </Link>
      </div>
    </section>
  );
}
