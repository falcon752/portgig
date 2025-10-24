"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Link from "next/link";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isPhotographerTemplateSpecific, CustomCSSProperties } from "@/types/portfolio";

interface TemplatesixMoreWorkProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixMoreWork({ portfolioData }: TemplatesixMoreWorkProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);
  const moreWork = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.more_work || []
    : [];

  console.log("TemplatesixMoreWork: Rendering with data:", { moreWork });

  return (
    <div
      className="bg-black text-white text-center py-12"
      style={{ color: (customStyles as CustomCSSProperties)["--primary"] || "#FFF", backgroundColor: colorUtils.darken((customStyles as CustomCSSProperties)["--bg-color"] || "#000") }}
    >
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#FFBA00]" style={getHeadingStyle()}>
            MORE OF MY WORK/EVENTS
          </h2>
        </div>
        <div className="bg-[#1E1E1E] py-12 px-4" style={getBodyStyle()}>
          {moreWork.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {moreWork.map((item, i) => (
                <div
                  key={i}
                  className="mb-8 md:mb-0"
                  style={{ boxShadow: `0 4px 8px ${colorUtils.darken((customStyles as CustomCSSProperties)["--accent-color"] || "#FFBA00", 0.5)}` }}
                >
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6">{item.name}</h3>
                  {item.link ? (
                    <Link href={item.link} target="_blank" rel="noopener noreferrer">
                      <button
                        className="bg-white text-[#0A1754] py-2 px-6 rounded font-extrabold hover:bg-gray-200 transition-colors"
                        style={{ boxShadow: `0 4px 8px ${colorUtils.darken((customStyles as CustomCSSProperties)["--accent-color"] || "#FFBA00", 0.5)}` }}
                      >
                        View on Google Drive
                      </button>
                    </Link>
                  ) : (
                    <button className="bg-white text-[#0A1754] py-2 px-6 rounded font-extrabold opacity-50 cursor-not-allowed">
                      Link Not Available
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-400" style={getBodyStyle()}>
              No additional work or events listed. Add some in your portfolio settings!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}