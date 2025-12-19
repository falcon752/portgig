"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isPhotographerTemplateSpecific, CustomCSSProperties } from "@/types/portfolio";
import Image from "next/image";
import Link from "next/link";

interface TemplatesixSkillsProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixSkills({ portfolioData }: TemplatesixSkillsProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolio);
  const photographerServices = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.my_services || []
    : [];
  const skills = portfolio.other_services || [];

  console.log("TemplatesixSkills: Rendering with data:", { photographerServices, skills });

  return (
    <div
      className="max-w-4xl mx-auto my-5 lg:my-20 px-4"
      style={{
        color: (customStyles as CustomCSSProperties)["--primary"] || "#FFF",
        backgroundColor: colorUtils.darken((customStyles as CustomCSSProperties)["--bg-color"] || "#000"),
      }}
    >
      <h2 className="text-2xl font-bold text-[#FCC92F] mb-8 lg:mt-3" style={getHeadingStyle()}>
        MY SKILLS
      </h2>
      <div className="bg-[#212121] text-white py-12 px-10" style={getBodyStyle()}>
        {photographerServices.length > 0 || skills.length > 0 ? (
          <>
            {skills.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-[#FCC92F] mb-4" style={getHeadingStyle()}>
                  Skills
                </h3>
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-20 max-w-4xl mx-auto mb-8">
                  {skills.map((skill, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-lg">{skill}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {photographerServices.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-[#FCC92F] mb-4" style={getHeadingStyle()}>
                  My Services
                </h3>
                <div className="space-y-12">
                  {photographerServices.map((service, index) => (
                    <div key={index} className="container mx-auto px-4">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center">
                          <div
                            className="w-[300px] h-[200px] rounded overflow-hidden relative bg-gray-700 flex items-center justify-center"
                            style={{
                              boxShadow: `0 4px 8px ${colorUtils.darken(
                                (customStyles as CustomCSSProperties)["--accent-color"] || "#FCC92F",
                                0.5
                              )}`,
                            }}
                          >
                            {service.image ? (
                              <Image
                                src={service.image}
                                alt={service.name || `Service ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <p className="text-gray-400 text-sm">No Image</p>
                            )}
                          </div>
                        </div>
                        <div className="md:w-1/2 md:pl-8 flex flex-col items-start">
                          <h2 className="text-3xl font-bold mb-6">
                            {(service.name || `Service ${index + 1}`).toUpperCase()}
                          </h2>
                          {service.link ? (
                            <Link href={service.link} target="_blank" rel="noopener noreferrer">
                              <button
                                className="bg-white text-black px-6 font-bold py-3 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                                style={{
                                  boxShadow: `0 4px 8px ${colorUtils.darken(
                                    (customStyles as CustomCSSProperties)["--accent-color"] || "#FCC92F",
                                    0.5
                                  )}`,
                                }}
                              >
                           View more Google Drive/Instagram
                              </button>
                            </Link>
                          ) : (
                            <button
                              className="bg-white text-black px-6 py-3 rounded opacity-50 cursor-not-allowed"
                              style={{
                                boxShadow: `0 4px 8px ${colorUtils.darken(
                                  (customStyles as CustomCSSProperties)["--accent-color"] || "#FCC92F",
                                  0.5
                                )}`,
                              }}
                            >
                              View more (Link not available)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-center text-lg text-gray-400" style={getBodyStyle()}>
            No skills or services listed. Add some in your portfolio settings!
          </p>
        )}
      </div>
    </div>
  );
}