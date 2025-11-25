"use client";
import React, { useState, useMemo } from "react";
import { fetchCreatorsApi } from "@/src/lib/requests/creators";
import { IoIosArrowForward } from "react-icons/io";
import { LoadingSpinner } from "@/src/utils/util_component";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  FilterData,
  SearchData,
} from "@/src/app/(root)/(creative)/creatives-hub/page";

type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Mid-level"
  | "Professional"
  | "Expert";

const mapExperienceToSkillLevel = (
  yearsOfExperience: string | number | null | undefined
): SkillLevel => {
  if (yearsOfExperience == null) return "Beginner";

  let years = 0;

  try {
    if (typeof yearsOfExperience === "string") {
      if (yearsOfExperience.trim() === "") return "Beginner";

      const match = yearsOfExperience.match(/(\d+)/);
      years = match ? Number.parseInt(match[1], 10) : 0;
    } else if (typeof yearsOfExperience === "number") {
      years = yearsOfExperience;
    }

    years = isNaN(years) ? 0 : Math.max(0, years);
  } catch (error) {
    console.warn("Error parsing years of experience:", error);
    return "Beginner";
  }

  if (years <= 1) return "Beginner";
  if (years === 2) return "Intermediate";
  if (years === 3) return "Mid-level";
  if (years >= 4 && years <= 6) return "Professional";
  return "Expert";
};

const getCreativeData = (creative: any) => {
  if (!creative) {
    return {
      id: "",
      fullName: "Unknown",
      field: "N/A",
      industry: "N/A",
      state: "N/A",
      lga: "N/A",
      bio: "No introduction available",
      profilePicture: "/assets/creative.svg",
      yearsOfExperience: 0,
      skillLevel: "Beginner" as SkillLevel,
    };
  }

  return {
    id: creative._id || creative.id || "",
    fullName:
      creative.bio_data?.full_name || creative.profile?.full_name || "Unknown",
    field: creative.profile?.profile?.field || creative.profile?.field || "N/A",
    industry:
      creative.profile?.profile?.industry ||
      creative.profile?.industry ||
      "N/A",
    state:
      creative.profile?.profile?.location?.state ||
      creative.profile?.location?.state ||
      "N/A",
    lga:
      creative.profile?.profile?.location?.lga ||
      creative.profile?.location?.lga ||
      "N/A",
    bio:
      creative.profile?.profile?.bio ||
      creative.bio_data?.bio ||
      creative.profile?.bio ||
      "No introduction available",
    profilePicture:
      creative.profile?.profile?.profile_picture ||
      creative.profile?.profile_picture ||
      "/assets/creative.svg",
    yearsOfExperience:
      creative.profile?.profile?.years_of_experience ||
      creative.profile?.years_of_experience ||
      0,
    skillLevel: mapExperienceToSkillLevel(
      creative.profile?.profile?.years_of_experience ||
        creative.profile?.years_of_experience
    ),
  };
};

interface CreativesProps {
  filters: FilterData;
  searchData: SearchData;
  onClearFilters: () => void;
}

const Creatives: React.FC<CreativesProps> = ({
  filters,
  searchData,
  onClearFilters,
}) => {
  const navigate = useRouter();
  const creativesPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);

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

  const filteredCreatives = useMemo(() => {
    if (!creators.length) return [];

    let filtered = creators;

    if (searchData.role) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return (
          creativeData.field
            .toLowerCase()
            .includes(searchData.role.toLowerCase()) ||
          creativeData.fullName
            .toLowerCase()
            .includes(searchData.role.toLowerCase())
        );
      });
    }

    if (searchData.industry) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return creativeData.industry
          .toLowerCase()
          .includes(searchData.industry.toLowerCase());
      });
    }

    if (searchData.location) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return (
          creativeData.state
            .toLowerCase()
            .includes(searchData.location.toLowerCase()) ||
          creativeData.lga
            .toLowerCase()
            .includes(searchData.location.toLowerCase())
        );
      });
    }

    if (searchData.state) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return creativeData.state
          .toLowerCase()
          .includes(searchData.state.toLowerCase());
      });
    }

    if (searchData.lg) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return creativeData.lga
          .toLowerCase()
          .includes(searchData.lg.toLowerCase());
      });
    }

    // Apply advanced filters
    if (filters.field) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return creativeData.field.toLowerCase() === filters.field.toLowerCase();
      });
    }

    if (filters.industry) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return (
          creativeData.industry.toLowerCase() === filters.industry.toLowerCase()
        );
      });
    }

    if (filters.state) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return creativeData.state.toLowerCase() === filters.state.toLowerCase();
      });
    }

    if (filters.localGovernment) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return (
          creativeData.lga.toLowerCase() ===
          filters.localGovernment.toLowerCase()
        );
      });
    }

    if (filters.experienceLevels.length > 0) {
      filtered = filtered.filter((creative: any) => {
        const creativeData = getCreativeData(creative);
        return filters.experienceLevels.includes(creativeData.skillLevel);
      });
    }

    return filtered;
  }, [creators, filters, searchData]);

  const hasActiveFiltersOrSearch = useMemo(() => {
    const hasFilters =
      filters.field ||
      filters.industry ||
      filters.state ||
      filters.localGovernment ||
      filters.experienceLevels.length > 0;
    const hasSearch =
      searchData.role ||
      searchData.industry ||
      searchData.location ||
      searchData.state ||
      searchData.lg;
    return hasFilters || hasSearch;
  }, [filters, searchData]);

  const totalPages = Math.ceil(filteredCreatives.length / creativesPerPage);
  const startIndex = currentPage * creativesPerPage;
  const endIndex = startIndex + creativesPerPage;
  const currentCreatives = filteredCreatives.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [filters, searchData]);

  const handleViewPortfolio = (creativeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (creativeId) {
      navigate.push(`/profile-card/${creativeId}`);
    } else {
      console.error("Creative ID is missing");
    }
  };

  const handleContact = (creative: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Contact creative:", creative);
  };

  if (isLoading) {
    return (
      <div className="center h-full my-5">
        <LoadingSpinner className="border-primary w-16 h-16" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">
            {error?.message || "An unknown error occurred."}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">No Creatives found.</p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredCreatives.length === 0 && hasActiveFiltersOrSearch) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">
            No creatives found matching your filters or search.
          </p>
          <button
            onClick={onClearFilters}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/80 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="p-5">
      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-textColor text-sm">
          Showing {currentCreatives.length} of {filteredCreatives.length}{" "}
          creatives
          {hasActiveFiltersOrSearch && (
            <span className="ml-2 text-primary font-medium">
              (filtered results)
            </span>
          )}
        </p>
        {hasActiveFiltersOrSearch && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-500 hover:text-red-700 underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-y-15">
        {currentCreatives.map((creative, index) => {
          const creativeData = getCreativeData(creative);

          return (
            <div
              key={creativeData.id || index}
              className={`flex flex-col gap-2 pb-5 px-5 rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                index % 3 === 1
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              }`}
            >
              <div className="flex justify-between items-center">
                {/* Profile picture with Next.js Image component */}
                <div className="relative h-[100px] w-[100px] rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={creativeData.profilePicture}
                    alt={`${creativeData.fullName}'s profile picture`}
                    fill
                    className="object-cover"
                    sizes="100px"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/creative.svg";
                    }}
                  />
                </div>
                <div className="bg-secondary/80 text-white py-1 px-5 font-ramaraja">
                  {creativeData.skillLevel}
                </div>
              </div>
              <h2 className="font-bold text-sm px-5 line-clamp-1">
                {creativeData.fullName}
              </h2>
              <h2
                className={`font-extralight text-sm px-5 line-clamp-1 ${
                  index % 3 === 1 ? "text-white" : "text-primary"
                }`}
              >
                {creativeData.field} / {creativeData.state}, {creativeData.lga}
              </h2>
              <div
                className={`h-14 p-1 border text-xs line-clamp-3 ${
                  index % 3 === 1
                    ? "bg-primary text-white border-white/20"
                    : "bg-gray-50 text-primary border-gray-100"
                }`}
              >
                {creativeData.bio}
              </div>
              <div className="flex justify-between px-2 mt-5">
                <button
                  onClick={(e) => handleViewPortfolio(creativeData.id, e)}
                  className={`py-2 px-3 w-fit self-end rounded-lg text-sm font-medium cursor-pointer transition-colors hover:opacity-90 ${
                    index % 3 === 1
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  }`}
                  disabled={!creativeData.id}
                >
                  View Profile
                </button>
                <button
                  onClick={(e) => handleContact(creative, e)}
                  className={`py-2 px-3 w-fit self-end rounded-lg text-sm font-medium cursor-pointer transition-colors hover:opacity-90 ${
                    index % 3 === 1
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  Contact Me
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold font-inter transition-colors ${
                currentPage === index
                  ? "bg-primary text-white cursor-not-allowed"
                  : "text-secondary hover:bg-accents"
              }`}
              disabled={currentPage === index}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold border border-accents transition-colors ${
              currentPage >= totalPages - 1
                ? "bg-accents cursor-not-allowed"
                : "text-secondary hover:bg-accents"
            }`}
            disabled={currentPage >= totalPages - 1}
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </section>
  );
};

export default Creatives;
