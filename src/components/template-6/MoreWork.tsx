"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Link from "next/link";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
  isPhotographerTemplateSpecific,
  CustomCSSProperties,
} from "@/types/portfolio";

interface TemplatesixMoreWorkProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixMoreWork({
  portfolioData,
}: TemplatesixMoreWorkProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { customStyles, getHeadingStyle, customBackgroundColor } =
    usePortfolioCustomizations(portfolio);

  const moreWork = isPhotographerTemplateSpecific(
    portfolio.template_specific
  )
    ? portfolio.template_specific.photographer.more_work || []
    : [];

  return (
    <section
      className="bg-black text-white py-20 px-6"
      style={{
        color:
          (customStyles as CustomCSSProperties)["--primary"] || "#FFF",
        ...(customBackgroundColor ? { backgroundColor: customBackgroundColor } : {}),
      }}
    >
      {/* Title */}
      <h2
        className="text-center text-3xl md:text-4xl font-bold text-[#FCC92F] mb-20"
        style={getHeadingStyle()}
      >
        MORE OF MY WORK/EVENTS
      </h2>

      {/* Grid */}
      {moreWork.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
          {moreWork.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-6"
            >
              {/* Dark pill */}
              <div className="w-full max-w-md py-4 text-center rounded-md border border-[#FCC92F] bg-[#1E1E1E] text-lg font-semibold">
                {item.name || "Untitled Event"}
              </div>

              {/* Button */}
              {item.link ? (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-[#F6CF5A] text-black font-semibold px-10 py-4 rounded-md hover:bg-yellow-500 transition">
                    View more on Google Drive
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="bg-[#F6CF5A] text-black font-semibold px-10 py-4 rounded-md opacity-50 cursor-not-allowed"
                >
                  Link not available
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">
          No additional work or events listed.
        </p>
      )}
    </section>
  );
}
