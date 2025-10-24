"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isDeveloperTemplateSpecific } from "@/types/portfolio";

interface TemplateThreeHeroProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreeHero = ({ portfolioData }: TemplateThreeHeroProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);
  const colors = portfolio.fonts?.colors || { background: "#000", accent: "#0A1754", text: "#FFF" };
  const formattedJobTitles = portfolio.job_titles?.length > 0 ? portfolio.job_titles.join(" / ") : "Developer / Designer";
  const displayName = portfolio.display_name || "Developer Name";
  const location = portfolio.location || "Location Not Specified";
  const headShot = portfolio.head_shot || "/placeholder.svg?height=300&width=300&query=developer headshot";
  const cta = isDeveloperTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.developer.cta || "Let's build quality products in programming and design with my services"
    : "Let's build quality products in programming and design with my services";

  return (
    <section className="flex" style={{ backgroundColor: colors.background }}>
      <div
        className="flex-1/3 flex justify-end items-end"
        style={{ backgroundColor: colors.accent }}
      >
        <Image
          src={headShot}
          alt={`${displayName}'s headshot`}
          width={300}
          height={300}
          className="object-cover h-70"
        />
      </div>
      <div
        className="flex-2/3 px-10 py-5 sm:pt-20 lg:pt-30 flex justify-end items-end"
        style={{ color: colors.text }}
      >
        <div className="flex flex-col justify-end items-end">
          <p className="font-bold text-xs md:text-sm lg:text-lg pb-2" style={getBodyStyle()}>{location}</p>
          <div className="w-[490px] h-px" style={{ backgroundColor: colors.accent }}></div>
          <h2 className="font-bold text-2xl md:text-3xl lg:text-6xl 2xl:text-8xl" style={getHeadingStyle()}>{displayName}</h2>
          <h2 className="font-bold text-xs lg:text-2xl 2xl:self-start" style={getHeadingStyle()}>{formattedJobTitles}</h2>
          <p className="font-normal text-sm lg:text-xl 2xl:text-2xl 2xl:self-start mt-10" style={getBodyStyle()}>
            {cta}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TemplateThreeHero;