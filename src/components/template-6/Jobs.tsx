"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
  isPhotographerTemplateSpecific,
} from "@/types/portfolio";

interface TemplatesixJobsProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixJobs({
  portfolioData,
}: TemplatesixJobsProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, customBackgroundColor } = usePortfolioCustomizations(portfolio);

  const jobsOpenTo = isPhotographerTemplateSpecific(
    portfolio.template_specific
  )
    ? portfolio.template_specific.photographer.jobs_open_to || []
    : [];

  const items =
    jobsOpenTo.length > 0
      ? jobsOpenTo
      : ["Projects", "Gigs", "Full time role", "Freelancing"];

  const count = items.length;

  const whyWorkWithMe =
    portfolio.what_you_get_working_with_me ||
    "As a passionate and detail-oriented photographer, I bring creativity, precision, and storytelling into every shot. Whether it’s capturing the essence of a brand, the emotions of an event, or the artistry of a product, I ensure every image tells a compelling story.";

  return (
    <section className="bg-black text-white py-24" style={customBackgroundColor ? { backgroundColor: customBackgroundColor } : undefined}>
      <div className="max-w-[1400px] mx-auto px-6">
      {/* OPEN TO ALL KINDS OF GIGS */}
      <h2
        className="text-center text-3xl md:text-4xl font-bold mb-16"
        style={getHeadingStyle()}
      >
        OPEN TO ALL KINDS OF GIGS
      </h2>

      {/* Pills container */}
      <div
        className={
          count < 4
            ? "flex justify-center gap-6 mb-32 flex-wrap"
            : "max-w-[1450px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-32"
        }
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="text-center px-4 py-4 rounded-md border border-[#FCC92F] bg-[#1E1E1E] text-sm sm:text-base font-medium w-full md:w-[300px]"
          >
            {item}
          </div>
        ))}
      </div>

      {/* WHY YOU SHOULD WORK WITH ME */}
      <h2
        className="text-center text-3xl md:text-4xl font-bold mb-10"
        style={getHeadingStyle()}
      >
        WHY YOU SHOULD WORK WITH ME
      </h2>

      <p className="max-w-4xl mx-auto text-center text-sm md:text-base leading-relaxed text-gray-200">
        {whyWorkWithMe}
      </p>

      <p className="text-center text-lg md:text-xl font-semibold mt-10 text-gray-300">
        Looking forward to working with you
      </p>
      </div>
    </section>
  );
}
