"use client";

import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveHeroProps {
  displayName: string;
  jobTitles: string[];
  location: string;
  headShot: string;
  portfolioData?: any;
}

export default function TemplateHero({
  displayName,
  jobTitles,
  location,
  headShot,
  portfolioData,
}: TemplateFiveHeroProps) {
  const { getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  const formattedJobTitles =
    jobTitles.length > 0
      ? jobTitles.join(", ")
      : "Strategic Social Media Manager";

  return (
    <section className="bg-[#f9f9f9] py-10">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center px-6 text-center">
      
      {/* Avatar */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-[#7fd3f7]">
        <Image
          src={headShot || "/placeholder.svg"}
          alt={displayName}
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <h1
        className="-mt-6 text-[60px] sm:text-[75px] md:text-[90px] font-medium font-[MTNBrighterSans] leading-[1.83] tracking-normal whitespace-nowrap text-black"
        style={getHeadingStyle({})}
      >
        {displayName}
      </h1>

      {/* Role + Location */}
      <p
        className="-mt-6 text-base md:text-lg font-semibold text-gray-700"
        style={getBodyStyle({})}
      >
        {formattedJobTitles}
        {location && `, ${location}`}
      </p>

      </div>
    </section>
  );
}
