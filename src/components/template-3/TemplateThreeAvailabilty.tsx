"use client";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
  isDeveloperTemplateSpecific,
} from "@/types/portfolio";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateThreeAvailabilityProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreeAvailability = ({
  portfolioData,
}: TemplateThreeAvailabilityProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, getAccentStyle } = usePortfolioCustomizations(portfolio);

  const availability = isDeveloperTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.developer.availability ||
      "I am always available."
    : "I am always available.";

  const whyWorkWithMe =
    portfolio.what_you_get_working_with_me ||
    "I bring a unique blend of technical expertise and creative problem-solving to every project.";

  return (
    <section className="px-5 lg:px-12 py-20 bg-black space-y-16 text-white">
      {/* AVAILABILITY */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-2xl font-bold" style={getHeadingStyle()}>
          Availability
        </h2>

        <div className="border border-cyan-400 rounded-xl px-6 py-8 lg:px-10 lg:py-10 bg-gradient-to-br from-[#0d0d0d] to-[#151515]">
          <p className="text-sm md:text-lg lg:text-xl text-white text-center leading-relaxed">
            {availability}
          </p>
        </div>
      </div>

      {/* WHAT YOU GET */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-2xl font-bold" style={getHeadingStyle()}>
          What you get working <span style={getAccentStyle()}>with me</span>
        </h2>

        <div className="border border-cyan-400 rounded-xl px-6 py-8 lg:px-10 lg:py-10 bg-gradient-to-br from-[#0d0d0d] to-[#151515]">
          <p className="text-sm md:text-lg lg:text-xl text-white text-center leading-relaxed">
            {whyWorkWithMe}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TemplateThreeAvailability;
