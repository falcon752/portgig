"use client";
import { useState, useEffect } from "react";
import {
  getRecruiterDashboard,
  type RecruiterDashboardData,
} from "@/src/lib/requests/recruiterApi";
import Link from "next/link";
import Image from "next/image";

type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Mid-level"
  | "Professional"
  | "Expert";

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

const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const JobApplied = () => {
  const [dashboardData, setDashboardData] =
    useState<RecruiterDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getRecruiterDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch applicants data");
          console.error("Applicants fetch error:", err);
        } else {
          setError("Failed to fetch applicants data");
          console.error("Unknown applicants fetch error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <section className="lg:bodyMargin flex flex-col gap-8 font-raleway px-1 sm:px-6 md:px-12 py-6">
          <div className="h-auto p-4 bg-[#0A1754] w-full flex items-center rounded-md">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white lg:pl-5 font-raleway">
              Applicants
            </h2>
          </div>
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        </section>
        <div className="lg:h-46 h-auto p-4 bg-[#0A1754] w-full flex flex-col items-center text-center py-5 lg:py-10 lg:pl-10 text-white lg:ml-1">
          <p className="text-sm sm:text-lg md:text-xl lg:text-3xl font-bold">
            {"Need Help Finding the right Talent?"}
          </p>
          <p className="text-xs sm:text-sm lg:text-xl mt-2 font-medium font-urbanist leading-[100%]">
            Contact us at hiretalents@portgig.com to get started!
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <section className="lg:bodyMargin flex flex-col gap-8 font-raleway px-1 sm:px-6 md:px-12 py-6">
          <div className="h-auto p-4 bg-[#0A1754] w-full flex items-center rounded-md">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white lg:pl-5 font-raleway">
              Applicants
            </h2>
          </div>
          <div className="flex justify-center items-center h-32">
            <p className="text-red-600">
              Error loading applicants data. Please try again later.
            </p>
          </div>
        </section>
        <div className="lg:h-46 h-auto p-4 bg-[#0A1754] w-full flex flex-col items-center text-center py-5 lg:py-10 lg:pl-10 text-white lg:ml-1">
          <p className="text-sm sm:text-lg md:text-xl lg:text-3xl font-bold">
            {"Need Help Finding the right Talent?"}
          </p>
          <p className="text-xs sm:text-sm lg:text-xl mt-2 font-medium font-urbanist leading-[100%]">
            Contact us at hiretalents@portgig.com to get started!
          </p>
        </div>
      </div>
    );
  }

  const applicants = dashboardData?.applicant_details || [];

  return (
    <div>
      <section className="lg:bodyMargin flex flex-col gap-8 font-raleway px-1 sm:px-6 md:px-12 py-6">
        <div className="h-auto p-4 bg-[#0A1754] w-full flex items-center rounded-md">
          <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white lg:pl-5 font-raleway">
            Applicants
          </h2>
        </div>

        {/* Applicants Grid */}
        {applicants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applicants.slice(0, 8).map((applicant, index) => (
              <div
                key={index}
                className="relative bg-gray-100 rounded-lg p-6 flex items-center gap-4"
              >
                <div className="absolute -top-3 right-4 bg-[#5A8FCF] text-white px-3 py-2 text-sm font-semibold font-ramaraja font-number lg:text-xl">
                  {mapExperienceToSkillLevel(
                    applicant.applicant_info.profile.years_of_experience
                  )}
                </div>

                <div className="h-[100px] w-[100px] bg-gray-200 rounded-full shrink-0 overflow-hidden">
                  <Image
                    src={
                      applicant.applicant_info.profile.profile_picture ||
                      "/assets/creative.svg"
                    }
                    alt={applicant.applicant_info.bio_data.full_name}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-raleway font-bold text-[#0A1754] mb-1">
                    {applicant.applicant_info.bio_data.full_name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {applicant.applicant_info.profile.field}
                  </p>
                  <p className="text-[#0A1754] text-sm font-raleway font-light mt-1">
                    {capitalizeFirstLetter(applicant.job_title)}/{" "}
                    {applicant.applicant_info.profile.location.state} State
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">No applicants found.</p>
          </div>
        )}

        {/* View All Button */}
        {applicants.length > 8 && (
          <div className="flex justify-end max-md:mr-2">
            <Link
              href="/recruiter-dashboard/all-applicants"
              className="bg-[#0A1754] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0A1754]/90 transition-colors"
            >
              View all
            </Link>
          </div>
        )}
      </section>

      <div className="lg:h-46 h-auto p-4 bg-[#0A1754] w-full flex flex-col items-center text-center py-5 lg:py-10 lg:pl-10 text-white lg:ml-1">
        <p className="text-sm sm:text-lg md:text-xl lg:text-3xl font-bold">
          {"Need Help Finding the right Talent?"}
        </p>
        <p className="text-xs sm:text-sm lg:text-xl mt-2 font-medium font-urbanist leading-[100%]">
          Contact us at hiretalents@portgig.com to get started!
        </p>
      </div>
    </div>
  );
};

export default JobApplied;
