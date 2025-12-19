/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import Link from "next/link";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
  isPhotographerTemplateSpecific,
} from "@/types/portfolio";

interface TemplatesixJobsProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixJobs({
  portfolioData,
}: TemplatesixJobsProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { customStyles, getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolio);

  const jobsOpenTo = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.jobs_open_to || []
    : [];

  const whyWorkWithMe =
    portfolio.what_you_get_working_with_me ||
    "As a passionate and detail-oriented professional, I bring creativity, precision, and storytelling into every project. My commitment to professionalism, quick turnaround, and client satisfaction makes me the ideal choice for your needs. Let's create something amazing together!";

  const socialLinks = portfolio.social || {};

  console.log("TemplatesixJobs: Rendering with data:", {
    jobsOpenTo,
    whyWorkWithMe,
    socialLinks,
  });

  return (
    <div className="bg-black text-white py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2
            className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-2"
            style={getHeadingStyle()}
          >
            Jobs
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-[#FCC92F] mb-8 md:mb-10 lg:mb-12 px-4">
            OPEN TO ALL KINDS OF GIGS
          </h3>
        </div>
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          {jobsOpenTo.length > 0 ? (
            <div className="space-y-4 md:space-y-5 lg:space-y-6">
              {jobsOpenTo.map((job, index) => (
                <div key={index} className="mb-4 md:mb-5 lg:mb-6">
                  <h4 className="text-lg md:text-xl lg:text-3xl font-bold mb-3">{job}</h4>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-base md:text-lg text-gray-400 mb-8 md:mb-10 lg:mb-12 px-4">
              No specific job types listed. Add some in your portfolio settings!
            </p>
          )}
        </div>

        <div className="text-center">
          <h3
            className="text-base md:text-xl lg:text-4xl mb-6 md:mb-8 mt-10 md:mt-12 lg:mt-16 font-bold text-[#FCC92F] px-4"
            style={getHeadingStyle()}
          >
            WHY YOU SHOULD WORK WITH ME
          </h3>
          <div className="bg-[#2B2B2B] px-5 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 rounded-lg text-center max-w-5xl mx-auto">
            <p className="text-white text-sm md:text-base lg:text-xl font-normal leading-relaxed">
              {whyWorkWithMe}
            </p>
          </div>
          <p className="text-base md:text-xl lg:text-3xl font-bold font-lateef pt-4 md:pt-6 px-4">
            Looking forward to working with you
          </p>
        </div>
      </div>
    </div>
  );
}