"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import { getImageUrl } from "@/src/utils/image-url";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isPhotographerTemplateSpecific, CustomCSSProperties } from "@/types/portfolio";

interface TemplatesixLatestWorkProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixLatestWork({ portfolioData }: TemplatesixLatestWorkProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);

  // Get latest work from photographer-specific template data
  const latestWork = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.latest_work || []
    : [];

  return (
    <section
      className="bg-black text-white py-10"
      style={{ color: (customStyles as CustomCSSProperties)["--text-color"] || "#FFF" }}
    >
      <div className="mx-auto max-w-[1450px] px-3 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-white mb-2 text-base sm:text-lg md:text-xl font-inter" style={getBodyStyle()}>
            My Portfolio
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FCC92F]" style={getHeadingStyle()}>
            LATEST WORK
          </h2>
        </div>

        {/* Grid */}
        {latestWork.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-6">
            {latestWork.map((item, i) => (
              <div
                key={i}
                className="border-2 border-white overflow-hidden rounded-md w-full"
                style={{
                  boxShadow: `0 4px 8px ${colorUtils.darken(
                    (customStyles as CustomCSSProperties)["--accent-color"] || "#FCC92F",
                    0.5
                  )}`,
                }}
              >
                {item.image ? (
                  <Image
                    src={getImageUrl(item.image) || item.image}
                    alt={item.title || `Portfolio image ${i + 1}`}
                    width={900}
                    height={600}
                    className="w-full h-[300px] sm:h-[300px] md:h-[260px] lg:h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-400 mt-6" style={getBodyStyle()}>
            No latest work listed. Add some in your portfolio settings!
          </p>
        )}
      </div>
    </section>
  );
}
