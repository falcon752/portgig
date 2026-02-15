"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import { getImageUrl } from "@/src/utils/image-url";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isDeveloperTemplateSpecific } from "@/types/portfolio";

interface TemplateThreeHeroProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreeHero = ({ portfolioData }: TemplateThreeHeroProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);

  const displayName = portfolio.display_name || "Developer Name";
  const location = portfolio.location || "Location Not Specified";
  const formattedJobTitles =
    portfolio.job_titles?.length > 0 ? portfolio.job_titles.join(" / ") : "Developer / Designer";
  const headShot = getImageUrl(portfolio.head_shot) || "/placeholder.svg?height=300&width=300&query=developer headshot";
  const cta = isDeveloperTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.developer.cta ||
      "Let's build quality products in programming and design with my services"
    : "Let's build quality products in programming and design with my services";

  return (
    <section className="w-full bg-black text-white px-6 sm:px-10 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center lg:justify-start">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight" style={getHeadingStyle()}>
            {displayName}
          </h1>

          <p className="font-bold mt-3 text-sm sm:text-base text-white" style={getBodyStyle()}>
            {formattedJobTitles}, {location}
          </p>

          <button className="mt-6 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-3 rounded-md transition">
            {cta}
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="bg-[#2f4656] rounded-xl p-6">
            <Image
              src={headShot}
              alt={displayName}
              width={300}
              height={380}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplateThreeHero;
