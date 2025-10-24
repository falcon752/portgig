"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO, CustomCSSProperties } from "@/types/portfolio";

interface TemplatesixAboutMeProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixAboutMe({ portfolioData }: TemplatesixAboutMeProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);
  const aboutMe = portfolio.about_me || "Tell us about yourself! Add a description in your portfolio settings.";

  return (
    <div
      className="bg-black"
      style={{ backgroundColor: colorUtils.darken((customStyles as CustomCSSProperties)["--bg-color"] || "#000") }}
    >
      <div className="max-w-4xl mx-auto my-5 lg:my-20 px-4">
        <h2 className="text-2xl font-bold text-[#FFBA00] mb-2" style={getHeadingStyle()}>
          ABOUT ME
        </h2>
        <div className="bg-[#212121] text-white py-12">
          <div className="container mx-auto" style={getBodyStyle()}>
            <p className="text-center text-lg">{aboutMe}</p>
          </div>
        </div>
      </div>

    </div>
  );
}