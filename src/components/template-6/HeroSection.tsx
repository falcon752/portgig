"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import { ApiPortfolioData, EMPTY_PORTFOLIO, CustomCSSProperties } from "@/types/portfolio";

interface TemplatesixHeroSectionProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixHeroSection({ portfolioData }: TemplatesixHeroSectionProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle } = usePortfolioCustomizations(portfolio);
  const colors = portfolio.fonts?.colors || { primary: "#000", accent: "#FCC92F", text: "#FFF", background: "#000" };

  const displayName = portfolio.display_name || "Photographer Name";
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const formattedJobTitles = portfolio.job_titles?.length > 0 ? portfolio.job_titles.join(" / ") : "Creative Professional";
  const location = portfolio.location || "Location Not Specified";
  const headShot = portfolio.head_shot || "/placeholder.svg?height=500&width=500";

  return (
    <div
      className="w-full bg-black font-montserrat"
      style={{
        backgroundColor: colors.primary,
        fontFamily: portfolio.fonts?.body_font,
      }}
    >
      <div className="relative w-full py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/bg.png"
            alt="Background portrait"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-black opacity-80" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-white">
              <h1 className="text-6xl font-bold lg:text-9xl tracking-tight" style={getHeadingStyle()}>
                {firstName.toUpperCase()}
              </h1>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#FCC92F] mb-6 lg:mt-0" style={getHeadingStyle()}>
                {lastName.toUpperCase()}
              </h2>
              <div className="mb-6">
                <p className="uppercase text-lg lg:text-4xl tracking-wide mb-1">{formattedJobTitles}</p>
                <p className="text-sm lg:text-xl">{location}</p>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-end mt-8 lg:mt-0">
              <div
                className="bg-white p-4 max-w-md"
                style={{ backgroundColor: colorUtils.darken((customStyles as CustomCSSProperties)["--bg-color"] || "#000", 0.1) }}
              >
                <Image
                  src={headShot}
                  alt={`${displayName}'s headshot`}
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}