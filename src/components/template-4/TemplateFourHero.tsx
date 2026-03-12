"use client";
import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { getImageUrl } from "@/src/utils/image-url";

interface TemplateFourHeroProps {
  displayName: string;
  jobTitles: string[];
  location: string;
  headShot: string;
  portfolioData: any;
}

const TemplateFourHero = ({
  displayName,
  jobTitles,
  location,
  headShot,
  portfolioData,
}: TemplateFourHeroProps) => {
  const { getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);
  const correctedHeadShot = getImageUrl(headShot) || headShot || "/placeholder.svg";
  return (
    <section className="bg-[#faf7f3] px-5 md:px-10 lg:px-20 py-10 border-b border-[#E77C29]">
      <div className="flex items-center gap-6">
        {/* AVATAR */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          <Image
            src={correctedHeadShot}
            alt={displayName || "Profile image"}
            width={150}
            height={150}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-xl font-semibold" style={getHeadingStyle()}>
            {displayName || "Your Name"}
          </h1>

          <p className="text-sm" style={getBodyStyle()}>
            {[...(jobTitles || []), location].filter(Boolean).join(", ") ||
              "Your role, Location"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TemplateFourHero;
