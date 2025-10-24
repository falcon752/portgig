"use client";
import React, { useState } from "react";
import { fetchCreatorsApi } from "@/src/lib/requests/creatorsForRecruiter" 
import { IoIosArrowForward } from "react-icons/io";
import { LooadingSpinner } from "@/src/utils/util_component";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type SkillLevel = "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert"

// Function to map years of experience to skill level
const mapExperienceToSkillLevel = (yearsOfExperience: string | number): SkillLevel => {
  // Convert to number if it's a string, or use directly if it's already a number
  const years = typeof yearsOfExperience === 'string' 
    ? (yearsOfExperience.match(/(\d+)/) ? Number.parseInt(yearsOfExperience.match(/(\d+)/)?.[1] || '0', 10) : Number(yearsOfExperience) || 0)
    : yearsOfExperience || 0

  if (years <= 1) {
    return "Beginner" 
  } else if (years === 2) {
    return "Intermediate" 
  } else if (years === 3) {
    return "Mid-level" 
  } else if (years >= 4 && years <= 6) {
    return "Professional" 
  } else {
    return "Expert" 
  }
}

const RecruiterCreatives = () => {
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

  // Extract the actual creators array from the response
  const creators = creatorsResponse?.data?.page_data || [];
  const totalPages = Math.ceil(creators.length / creativesPerPage);

  const startIndex = currentPage * creativesPerPage;
  const endIndex = startIndex + creativesPerPage;
  const currentCreatives = creators.slice(startIndex, endIndex);

  // Function to handle portfolio view
  const handleViewPortfolio = (creativeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate.push(`/profile-card/${creativeId}`);
  };

  // Function to handle contact
  const handleContact = (creative: any, e: React.MouseEvent) => {
    e.stopPropagation();
    // You can implement contact functionality here
    console.log("Contact creative:", creative);
  };

  if (isLoading) {
    return (
      <div className="center h-full my-5">
        <LooadingSpinner className="border-primary w-16 h-16" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">{error?.message || "An unknown error occurred."}</p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
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
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {currentCreatives.map((creative, index) => (
          <div
            key={creative._id}
            className={`flex flex-col gap-2 pb-5 px-5 rounded-lg shadow-lg cursor-pointer ${
              index % 3 === 1
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }`}>
            <div className="flex justify-between items-center">
              <div className="h-[100px] w-[100px] overflow-hidden">
                {/* Placeholder for profile picture since API doesn't seem to have image field */}
                <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              </div>
              <div className="bg-secondary/80 text-white py-1 px-5 font-ramaraja">
                {mapExperienceToSkillLevel(creative.profile?.years_of_experience || 0)}
              </div>
            </div>
            <h2 className="font-bold text-sm px-5 line-clamp-1">
              {creative.bio_data?.full_name || "Unknown"}
            </h2>
            <h2 className="text-primary font-extralight text-sm px-5 line-clamp-1">
              {creative.profile?.field || "N/A"} / {creative.profile?.location?.state || "N/A"}, {creative.profile?.location?.lga || "N/A"}
            </h2>
            <div
              className={`h-14 p-1 border text-xs line-clamp-3 ${
                index % 3 === 1
                  ? "bg-primary text-white"
                  : "bg-gray50 text-primary border-gray100"
              }`}>
              {creative.bio_data?.bio || "No introduction available"}
            </div>
            <div className="flex justify-between px-2 mt-5">
              <button
                onClick={(e) => handleViewPortfolio(creative._id, e)}
                className={`py-2 px-3 w-fit self-end rounded-lg text-sm font-medium cursor-pointer ${
                  index % 3 === 1
                    ? "bg-white text-primary"
                    : "bg-primary text-white"
                }`}>
                View Profile
              </button>
              <button
                onClick={(e) => handleContact(creative, e)}
                className={`py-2 px-3 w-fit self-end rounded-lg text-sm font-medium cursor-pointer ${
                  index % 3 === 1
                    ? "bg-white text-primary"
                    : "bg-primary text-white"
                }`}>
                Contact Me
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {/* Generate buttons dynamically based on total pages */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold font-inter ${
              currentPage === index
                ? "bg-primary text-white cursor-not-allowed"
                : "text-secondary hover:bg-accents"
            }`}>
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold border border-accents ${
            currentPage >= totalPages - 1
              ? "bg-accents cursor-not-allowed"
              : "text-secondary hover:bg-accents"
          }`}
          disabled={currentPage >= totalPages - 1}>
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
};

export default RecruiterCreatives;