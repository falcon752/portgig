"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isPhotographerTemplateSpecific, CustomCSSProperties } from "@/types/portfolio";

interface TemplatesixLatestWorkProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixLatestWork({ portfolioData }: TemplatesixLatestWorkProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);
  
  // Corrected access: go through .photographer property
  const latestWork = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.latest_work || []  
    : [];

  console.log("TemplatesixLatestWork: Rendering with data:", { latestWork });

  return (
    <div
      className="bg-black py-12"
      style={{ color: (customStyles as CustomCSSProperties)["--primary"] || "#FFF", backgroundColor: colorUtils.darken((customStyles as CustomCSSProperties)["--bg-color"] || "#000") }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-white mb-1 text-xl font-inter" style={getBodyStyle()}>
            My Portfolio
          </p>
          <h2 className="text-3xl font-bold text-[#FFBA00]" style={getHeadingStyle()}>
            LATEST WORK
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center max-w-[960px] mx-auto">
          {latestWork.length > 0 ? (
            latestWork.map((item, i) => (
              <div
                key={i}
                className="border-2 border-white overflow-hidden rounded-md max-w-[450px] mx-auto"
                style={{ boxShadow: `0 4px 8px ${colorUtils.darken((customStyles as CustomCSSProperties)["--accent-color"] || "#FFBA00", 0.5)}` }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title || `Latest work image ${i + 1}`}
                    width={450}
                    height={300}
                    className="w-full h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-center text-lg text-gray-400" style={getBodyStyle()}>
              No latest work listed. Add some in your portfolio settings!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}