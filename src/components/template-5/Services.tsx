"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveServicesProps {
  otherServices?: string[];
  portfolioData?: any;
}

export default function Services({ otherServices, portfolioData }: TemplateFiveServicesProps) {
  const { getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);

  // Default services if none provided
  const services = otherServices && otherServices.length > 0 ? otherServices : [
    "Ads / Campaign Management",
    "Full Social Media Management (Instagram, Facebook, Twitter)",
    "Graphics Designing & Video Editing",
    "Content Strategy & Scheduling",
    "Hashtag & Trend Research",
  ];

  return (
    <section className="bg-[#f9f9f9] py-12 text-[#0A1754]">
      <div className="max-w-[1400px] mx-auto px-6">
      {/* Section Title */}
      <h3
        className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal mb-6 text-center"
        style={getHeadingStyle({})}
      >
        Services I Offer
      </h3>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
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
            {service}
          </div>
        ))}
      </div>

      {/* Case Studies Heading */}
      <h3
        className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mt-20 mb-3 text-center"
        style={getHeadingStyle({})}
      >
        Case Studies (How My Work Helped Brands)
      </h3>
      </div>
    </section>
  );
}
