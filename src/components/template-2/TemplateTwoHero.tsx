"use client";

import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { getImageUrl } from "@/src/utils/image-url";

interface TemplateTwoHeroProps {
  displayName?: string;
  jobTitles?: string[];
  location?: string;
  headShot?: string;
  portfolioData?: any;
}

const TemplateTwoHero = ({
  displayName = "Dennis Akpa",
  jobTitles = ["Videographer/Editor"],
  location = "Lagos State",
  headShot = "/assets/template2.png",
  portfolioData,
}: TemplateTwoHeroProps) => {
  const { customStyles, getHeadingStyle, getBodyStyle, getAccentStyle } = usePortfolioCustomizations(portfolioData);
  const correctedHeadShot = getImageUrl(headShot) || headShot;

  return (
    <section className="bg-black">
      <div className="max-w-[1400px] mx-auto flex flex-col-reverse md:flex-row gap-2 md:gap-10 pt-15 md:pt-50 px-5 md:px-10">
      {/* Text */}
      <div
        className="flex flex-col font-bold mb-4 md:mb-0 md:w-1/2 justify-center text-center md:text-left md:-translate-y-10"
        style={{ fontFamily: "The Next Font, sans-serif", fontStyle: "normal" }}
      >
        <h2 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black" style={getHeadingStyle()}>
          {displayName}
        </h2>
        <h2 className="text-xs md:text-base mt-1" style={getBodyStyle()}>
          {jobTitles.join(" / ")}, <span>{location}</span>
        </h2>
      </div>

      {/* Image */}
      <div className="relative flex justify-center items-end md:w-1/2 h-64 md:h-auto mb-6 md:mb-0">
        {/* Background circle */}
        <div className="absolute bottom-0 left-[45%] md:left-auto md:right-20 -translate-x-1/2 md:translate-x-0 z-20 h-56 w-56 md:h-60 md:w-60 lg:h-72 lg:w-72 rounded-full" style={{ backgroundColor: getAccentStyle().color }} />

        {/* Headshot container */}
        <div className="absolute bottom-0 left-[55%] md:left-auto md:right-10 -translate-x-1/2 md:translate-x-0 z-30 h-56 w-56 md:h-60 md:w-60 lg:h-72 lg:w-72 rounded-full overflow-hidden">
          <Image
            src={correctedHeadShot}
            alt={`${displayName}'s headshot`}
            width={384}
            height={384}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      </div>
    </section>
  );
};

export default TemplateTwoHero;
