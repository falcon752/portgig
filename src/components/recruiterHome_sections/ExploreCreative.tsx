"use client";

import { Buttons } from "@/src/components/export_components";
import { fetchCreatorsApi } from "@/src/lib/requests/creatorsForRecruiter";
import { cn } from "@/src/utils/cn";
import { LoadingSpinner } from "@/src/utils/util_component";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo, useState } from "react";
import { getUserId } from "@/src/utils/chats";
import { useAppSelector } from "@/src/redux/hooks";
import { createOrGetChatRoom } from "@/src/lib/firebase/chat";
import toast from "react-hot-toast";

type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Mid-level"
  | "Professional"
  | "Expert";

type FilterData = {
  title: string;
  category: string;
  location: string;
  experienceLevels: string[];
  employmentTypes: string[];
};

interface ExploreCreativeProps {
  searchFilters?: FilterData | null;
}

const mapExperienceToSkillLevel = (
  yearsOfExperience: string | number
): SkillLevel => {
  const years =
    typeof yearsOfExperience === "string"
      ? yearsOfExperience.match(/(\d+)/)
        ? Number.parseInt(yearsOfExperience.match(/(\d+)/)?.[1] || "0", 10)
        : Number(yearsOfExperience) || 0
      : yearsOfExperience || 0;

  if (years <= 1) {
    return "Beginner";
  } else if (years === 2) {
    return "Intermediate";
  } else if (years === 3) {
    return "Mid-level";
  } else if (years >= 4 && years <= 6) {
    return "Professional";
  } else {
    return "Expert";
  }
};

export default function ExploreCreative({
  searchFilters,
}: ExploreCreativeProps) {
  const navigate = useRouter();
  const [chatLoading, setChatLoading] = useState<string | null>(null);
  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);

  const currentUser = profile || recruiterProfile;

  const {
    data: creatorsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["creators"],
    queryFn: fetchCreatorsApi,
  });

  const creators = creatorsResponse?.data?.page_data || [];

  const filteredCreators = useMemo(() => {
    if (!searchFilters) return creators;

    return creators.filter((creator) => {
      const matchesTitle =
        !searchFilters.title ||
        creator.profile?.field
          ?.toLowerCase()
          .includes(searchFilters.title.toLowerCase()) ||
        creator.bio_data?.full_name
          ?.toLowerCase()
          .includes(searchFilters.title.toLowerCase());

      const matchesCategory =
        !searchFilters.category ||
        creator.profile?.field
          ?.toLowerCase()
          .includes(searchFilters.category.toLowerCase());

      const matchesLocation =
        !searchFilters.location ||
        creator.profile?.location?.state
          ?.toLowerCase()
          .includes(searchFilters.location.toLowerCase()) ||
        creator.profile?.location?.lga
          ?.toLowerCase()
          .includes(searchFilters.location.toLowerCase());

      return matchesTitle && matchesCategory && matchesLocation;
    });
  }, [creators, searchFilters]);

  const handleViewProfile = (creatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate.push(`/recruiter-profile-card/${creatorId}`);
  };

  const handleStartChat = async (creative: any) => {
    const currentUserId = getUserId(currentUser);
    const creativeId = getUserId(creative);

    if (
      !currentUserId ||
      !creativeId ||
      chatLoading === creative._id ||
      !currentUser ||
      !creative
    ) {
      console.error("Missing required data for chat:", {
        currentUserId,
        creativeId,
        hasCurrentUser: !!currentUser,
        hasCreative: !!creative,
        chatLoading: chatLoading === creative._id,
      });
      return;
    }

    setChatLoading(creative._id);
    try {
      const currentUserType = profile ? "creative" : "recruiter";
      const creativeUserType = "creative";

      const chatId = await createOrGetChatRoom(
        currentUser,
        creative,
        currentUserType,
        creativeUserType
      );

      navigate.push(`/chats/${chatId}`);
    } catch {
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setChatLoading(null);
    }
  };

  const displayCreators = useMemo(() => {
  // Shuffle filteredCreators
  const shuffled = [...filteredCreators].sort(() => 0.5 - Math.random());
  // Take only first 10
  return shuffled.slice(0, 10);
}, [filteredCreators]);

  const hasSearchFilters =
    searchFilters &&
    (searchFilters.title || searchFilters.category || searchFilters.location);

  return (
    <section className={cn("flex flex-col gap-6 font-raleway")}>
      <div className={cn("flex items-center bodyMargin")}>
        <h2
          className={cn(
            "text-lg sm:text-xl lg:text-2xl font-bold pl-4 sm:pl-10 text-[#00489A] mt-4"
          )}
        >
          {hasSearchFilters
            ? `Search Results (${displayCreators.length} found)`
            : "Browse Creatives"}
        </h2>
      </div>
      <div
        className={cn(
          "bodyMargin grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        )}
      >
        {isLoading ? (
          <div
            className={cn(
              "col-span-full flex justify-center items-center h-64"
            )}
          >
            <LoadingSpinner className={cn("border-primary w-16 h-16")} />
          </div>
        ) : isError ? (
          <div
            className={cn(
              "col-span-full flex items-center justify-center min-h-[300px]"
            )}
          >
            <div
              className={cn(
                "text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md"
              )}
            >
              <p className={cn("text-red-500 mb-4")}>
                {error?.message || "An unknown error occurred."}
              </p>
              <button
                onClick={() => refetch()}
                className={cn(
                  "bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                )}
              >
                Retry
              </button>
            </div>
          </div>
        ) : displayCreators.length === 0 ? (
          <div
            className={cn(
              "col-span-full flex items-center justify-center min-h-[300px]"
            )}
          >
            <div
              className={cn(
                "text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md"
              )}
            >
              <p className={cn("text-gray-500 mb-4")}>
                {hasSearchFilters
                  ? "No creatives match your search criteria."
                  : "No Creatives found."}
              </p>
              <button
                onClick={() => refetch()}
                className={cn(
                  "bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                )}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          displayCreators.map((creator) => {
            const profilePicture =
              creator.profile?.profile_picture || "/assets/creative.svg";

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
                      creator.profile.years_of_experience
                    )}
                  </div>
                </div>
                <h2 className={cn("font-bold text-sm px-5")}>
                  {creator.bio_data.full_name}
                </h2>
                <h3 className={cn("font-extralight text-sm px-5 line-clamp-1")}>
                  {creator.profile?.field} / {creator?.profile?.location?.state},{" "}
                  {creator?.profile?.location?.lga}
                </h3>
                <div
                  className={cn(
                    "h-14 p-1 border border-gray-100 bg-gray-50 text-primary text-xs line-clamp-3"
                  )}
                >
                  {creator.profile?.bio || "No introduction available"}
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
          })
        )}
      </div>
      <div className={cn("bodyMargin flex justify-end")}>
        <Link href="/recruiter-creatives-hub">
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