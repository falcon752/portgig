"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveStrategyContentProps {
  approachToStrategy: string;
  mission: string;
  portfolioData?: any;
}

export default function TemplateFiveStrategyContent({
  approachToStrategy,
  mission,
  portfolioData,
}: TemplateFiveStrategyContentProps) {
  const { getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <section className="bg-[#f9f9f9] py-12 text-[#0A1754]">
      <div className="max-w-[1400px] mx-auto px-6 text-center space-y-12">
      
      {/* My Approach to Strategy Content */}
      <div className="space-y-6">
        <h3
          className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal"
          style={getHeadingStyle({})}
        >
          My Approach to Strategy Content
        </h3>

        <div
          className="bg-white border border-[#7fd3f7] font-semibold rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed"
          style={getBodyStyle({})}
        >
          {approachToStrategy ||
            "Creative and detail-oriented Graphic Designer with years of experience in brand identity, social media design, and marketing visuals. Adept at transforming concepts into compelling visuals that enhance brand presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a strong understanding of design principles and user experience. Passionate about delivering high-quality designs that resonate with audiences and drive engagement."}
        </div>
      </div>

      {/* My Mission & Values */}
      <div className="space-y-6">
        <h3
          className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal"
          style={getHeadingStyle({})}
        >
          My Mission & Values
        </h3>

        <h3
          className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal"
          style={getHeadingStyle({})}
        >
          How You Help Brands Grow Online
        </h3>

        <div
          className="bg-white border border-[#7fd3f7] font-semibold rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed"
          style={getBodyStyle({})}
        >
          {mission ||
            "I help brands grow online by creating thoughtful, results-driven strategies that connect with the right audience. My mission is to deliver consistent value through creativity, strategy, and clear communication while helping businesses build trust, visibility, and long-term growth."}
        </div>
      </div>

      </div>
    </section>
  );
}
