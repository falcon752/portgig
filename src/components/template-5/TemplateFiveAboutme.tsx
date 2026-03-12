"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveAboutMeProps {
  aboutMe: string;
  portfolioData?: any;
}

export default function TemplateFiveAboutMe({
  aboutMe,
  portfolioData,
}: TemplateFiveAboutMeProps) {
  const { getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <section className="bg-[#f9f9f9] py-12 text-[#0A1754]">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
      {/* Section Title */}
      <h3
        className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal mb-3"
        style={getHeadingStyle({})}
      >
        About me
      </h3>

      {/* Content Card */}
      <div
        className="bg-white border border-[#7fd3f7] font-semibold rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed"
        style={getBodyStyle({})}
      >
        {aboutMe ||
          `Creative and detail-oriented Graphic Designer with years of experience
          in brand identity, social media design, and marketing visuals. Adept at
          transforming concepts into compelling visuals that enhance brand
          presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a
          strong understanding of design principles and user experience.
          Passionate about delivering high-quality designs that resonate with
          audiences and drive engagement.`}
      </div>
      </div>
    </section>
  );
}
