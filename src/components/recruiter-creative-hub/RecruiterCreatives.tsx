"use client";

import React, { useState, useMemo } from "react";
import { fetchCreatorsApi } from "@/src/lib/requests/creatorsForRecruiter";
import { IoIosArrowForward } from "react-icons/io";
import { LoadingSpinner } from "@/src/utils/util_component";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export type CreativesSearchFilters = {
  title?: string;
  category?: string;
  location?: string;
  experienceLevels?: string[];
  employmentTypes?: string[];
} | null;

type Props = {
  searchFilters?: CreativesSearchFilters;
};

type SkillLevel = "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert";

// Map years of experience to skill level
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

const RecruiterCreatives = ({ searchFilters }: Props) => {
  const router = useRouter();
  const creativesPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);

  const { data: creatorsResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["creators"],
    queryFn: fetchCreatorsApi,
  });

  const creators = creatorsResponse?.data?.page_data || [];

  const filteredCreators = useMemo(() => {
    if (!searchFilters) return creators;

    return creators.filter((creator: any) => {
      const matchesTitle =
        !searchFilters.title ||
        creator.profile?.field?.toLowerCase().includes(searchFilters.title.toLowerCase()) ||
        creator.bio_data?.full_name?.toLowerCase().includes(searchFilters.title.toLowerCase());

      const matchesCategory =
        !searchFilters.category ||
        creator.profile?.field?.toLowerCase().includes(searchFilters.category.toLowerCase());

      const matchesLocation =
        !searchFilters.location ||
        creator.profile?.location?.state?.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
        creator.profile?.location?.lga?.toLowerCase().includes(searchFilters.location.toLowerCase());

      return matchesTitle && matchesCategory && matchesLocation;
    });
  }, [creators, searchFilters]);

  const totalPages = Math.ceil(filteredCreators.length / creativesPerPage);
  const startIndex = currentPage * creativesPerPage;
  const endIndex = startIndex + creativesPerPage;
  const currentCreatives = filteredCreators.slice(startIndex, endIndex);

  const handleViewProfile = (creativeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/recruiter-profile-card/${creativeId}`);
  };

  const handleContact = (creative: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Contact creative:", creative);
  };

  if (isLoading)
    return (
      <div className="center h-full my-5">
        <LoadingSpinner className="border-primary w-16 h-16" />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">{error?.message || "An unknown error occurred."}</p>
          <button onClick={() => refetch()} className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer">
            Retry
          </button>
        </div>
      </div>
    );

  if (filteredCreators.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No creatives found.</p>
          <button onClick={() => refetch()} className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer">
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <section id="creatives-section" className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {currentCreatives.map((creative, index) => {
          const profilePicture = creative.profile?.profile_picture || "/assets/creative.svg";
          const bio = creative.profile?.bio || creative.bio_data?.bio || "No introduction available";

          // Dark card logic
          const isDarkCard = index % 3 === 1;

          return (
            <div
              key={creative._id}
              className={`flex flex-col gap-2 pb-5 px-5 rounded-lg shadow-lg cursor-pointer ${
                isDarkCard ? "bg-primary text-white" : "bg-white text-primary"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="relative h-[100px] w-[100px] overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={profilePicture}
                    alt={`${creative.bio_data?.full_name || "Creative"} profile`}
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
                  className={`py-1 px-5 font-ramaraja w-32 text-center ${
                    isDarkCard ? "bg-secondary/70 text-white" : "bg-secondary/80 text-white"
                  }`}
                >
                  {mapExperienceToSkillLevel(creative.profile?.years_of_experience || 0)}
                </div>
              </div>

              <h2 className="font-bold text-sm px-5 line-clamp-1">{creative.bio_data?.full_name || "Unknown"}</h2>
              <h3 className={`text-sm font-extralight px-5 line-clamp-1 ${isDarkCard ? "text-white" : "text-primary"}`}>
                {creative.profile?.field || "N/A"} / {creative.profile?.location?.state || "N/A"}, {creative.profile?.location?.lga || "N/A"}
              </h3>

              <div
                className={`h-14 p-1 border text-xs line-clamp-3 ${
                  isDarkCard ? "bg-primary/90 text-white border-white/20" : "bg-gray-50 text-primary border-gray-100"
                }`}
              >
                {bio}
              </div>

              <div className="flex justify-between px-2 mt-5">
                <button
                  onClick={(e) => handleViewProfile(creative._id, e)}
                  className={`py-2 px-3 w-fit self-end rounded-lg text-sm font-medium cursor-pointer ${
                    isDarkCard ? "bg-white text-primary" : "bg-primary text-white"
                  }`}
                >
                  View Profile
                </button>
                <button
                  onClick={(e) => handleContact(creative, e)}
                  className={`py-2 px-3 w-fit self-end rounded-lg text-sm font-medium cursor-pointer ${
                    isDarkCard ? "bg-white text-primary" : "bg-primary text-white"
                  }`}
                >
                  Contact Me
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold font-inter ${
              currentPage === index ? "bg-primary text-white cursor-not-allowed" : "text-secondary hover:bg-accents"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold border border-accents ${
            currentPage >= totalPages - 1 ? "bg-accents cursor-not-allowed" : "text-secondary hover:bg-accents"
          }`}
          disabled={currentPage >= totalPages - 1}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
};

export default RecruiterCreatives;
