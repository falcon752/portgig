"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveSkillsProps {
  mySkillSet?: string[];
  portfolioData?: any;
}

export default function Skills({ mySkillSet, portfolioData }: TemplateFiveSkillsProps) {
  const { getHeadingStyle, getBodyStyle, customBackgroundColor } = usePortfolioCustomizations(portfolioData);

  // Default skills if none provided
  const skills = mySkillSet && mySkillSet.length > 0 ? mySkillSet : [
    "Social Media Strategy & Growth",
    "Content Creation (Graphics & Video)",
    "Copywriting & Caption Writing",
    "Community Management & Engagement",
    "Paid Ads & Social Media Marketing",
    "Hashtag & Trend Research",
    "Analytics & Performance Tracking",
  ];

  return (
    <section className="bg-[#f9f9f9] py-12 text-[#0A1754]" style={customBackgroundColor ? { backgroundColor: customBackgroundColor } : undefined}>
      <div className="max-w-[1400px] mx-auto px-6">
      {/* Section Title */}
      <h3
        className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal mb-6 text-center"
        style={getHeadingStyle({})}
      >
        My Skill Set
      </h3>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="
              bg-white
              border
              border-[#7fd3f7]
              rounded-lg
              px-6
              py-5
              text-sm md:text-base
              text-gray-700
              font-bold
              leading-relaxed
              flex
              items-center
              min-h-[96px]
            "
            style={getBodyStyle({})}
          >
            {skill}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
