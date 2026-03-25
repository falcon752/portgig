"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";

interface TemplateFiveHealthcareCaseStudyProps {
  brandName?: string;
  howYouHelp?: string;
  before?: string;
  after?: string;
  portfolioData?: any;
}

export default function TemplateFiveHealthcareCaseStudy({
  brandName,
  howYouHelp,
  before,
  after,
  portfolioData,
}: TemplateFiveHealthcareCaseStudyProps) {
  const { getHeadingStyle, getBodyStyle, customBackgroundColor } =
    usePortfolioCustomizations(portfolioData);

  // Default content if no data provided
  const displayBrand = brandName || "Healthcare Brand";
  const displayHowYouHelp =
    howYouHelp ||
    `Creative and detail-oriented Graphic Designer with years of experience in brand identity, social media design, and marketing visuals. Adept at transforming concepts into compelling visuals that enhance brand presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a strong understanding of design principles and user experience. Passionate about delivering high-quality designs that resonate with audiences and drive engagement.`;

  return (
    <section className="bg-[#f9f9f9] py-16 text-[#1E2A5A]" style={customBackgroundColor ? { backgroundColor: customBackgroundColor } : undefined}>
      <div className="max-w-[1400px] mx-auto px-6 space-y-10">
      {/* Brand Title */}
      <div
        className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-3"
        style={getHeadingStyle({})}
      >
        {displayBrand}
      </div>

      {/* Description */}
      <div
        className="w-full font-bold bg-white border border-[#7fd3f7] rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed text-center"
        style={getBodyStyle({})}
      >
        {displayHowYouHelp}
      </div>

      {/* Before & After */}
      <div className="grid grid-cols-2 gap-6">
        {/* Before */}
        <div className="space-y-3 text-center">
          <h3
            className="text-sm font-bold text-[#1E2A5A]"
            style={getHeadingStyle({ fontSize: "0.875rem" })}
          >
            Before
          </h3>
          <div className="aspect-square w-full bg-white border border-[#7fd3f7] rounded-lg relative overflow-hidden">
            {before && (
              <Image
                src={before}
                alt={`${displayBrand} Before`}
                fill
                className="object-contain sm:object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* After */}
        <div className="space-y-3 text-center">
          <h3
            className="text-sm font-bold text-[#1E2A5A]"
            style={getHeadingStyle({ fontSize: "0.875rem" })}
          >
            After
          </h3>
          <div className="aspect-square w-full bg-white border border-[#7fd3f7] rounded-lg relative overflow-hidden">
            {after && (
              <Image
                src={after}
                alt={`${displayBrand} After`}
                fill
                className="object-contain sm:object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
