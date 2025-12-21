"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO, CustomCSSProperties, isPhotographerTemplateSpecific } from "@/types/portfolio";
import Image from "next/image";
import Link from "next/link";

interface TemplatesixSkillsProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixSkills({ portfolioData }: TemplatesixSkillsProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);

  const skills = portfolio.other_services || [];
  const photographerServices = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.my_services || []
    : [];

  return (
    <section
      className="w-full py-20 bg-black font-montserrat text-white"
      style={{ color: (customStyles as CustomCSSProperties)["--text-color"] || "#FFF" }}
    >
      {/* Section Title */}
      <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[#FCC92F] mb-12" style={getHeadingStyle()}>
        MY SKILLS
      </h2>

      {/* Skills Grid */}
      {skills.length > 0 ? (
        <div className="w-full max-w-[1450px] mx-auto px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="border border-[#FCC92F]/40 bg-[#111] text-white flex items-center justify-center text-center px-6 py-10 hover:border-[#FCC92F] transition max-w-[400px]"
            >
              <p className="text-sm md:text-base lg:text-lg" style={getBodyStyle()}>
                {skill}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-400 mt-6" style={getBodyStyle()}>
          No skills listed. Add some in your portfolio settings!
        </p>
      )}

      {/* Photographer Services (optional, below skills) */}
      {/* {photographerServices.length > 0 && (
        <div className="w-full max-w-[1450px] mx-auto px-6 md:px-16 mt-16">
          <h3 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[#FCC92F] mb-8" style={getHeadingStyle()}>
            MY SERVICES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {photographerServices.map((service, index) => (
              <div
                key={index}
                className="border border-[#FCC92F]/40 bg-[#111] text-white flex flex-col items-center justify-center text-center px-6 py-10 hover:border-[#FCC92F] transition max-w-[400px]"
              >
                <p className="text-sm md:text-base lg:text-lg font-bold mb-2" style={getBodyStyle()}>
                  {service.name || `Service ${index + 1}`}
                </p>
                {service.link ? (
                  <Link href={service.link} target="_blank" rel="noopener noreferrer">
                    <button className="bg-[#FCC92F] text-black px-4 py-2 rounded font-bold hover:opacity-90 transition">
                      View More
                    </button>
                  </Link>
                ) : (
                  <button className="bg-[#FCC92F] text-black px-4 py-2 rounded font-bold opacity-50 cursor-not-allowed">
                    Link not available
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}
    </section>
  );
}
