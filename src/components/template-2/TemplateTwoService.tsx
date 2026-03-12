"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateTwoServiceProps {
  services: string[];
  videographyTypes: string[];
  videographySkills: string[];
  videoEditingSkills: string[];
  portfolioData: any;
}

const TemplateTwoService = ({
  services,
  videographyTypes,
  videographySkills,
  videoEditingSkills,
  portfolioData,
}: TemplateTwoServiceProps) => {
  const { getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <section className="bg-black py-12 px-4 md:px-10 text-white">
      {/* Heading */}
      <h2
        className="font-bold text-xl md:text-3xl mb-8"
        style={getHeadingStyle()}
      >
        MY <span>SERVICES</span>
      </h2>

      {/* Services */}
      {services?.length > 0 && (
        <ul
          className="space-y-4 md:space-y-5 list-disc list-inside text-sm md:text-base font-bold leading-relaxed md:leading-loose"
          style={{
            ...getBodyStyle(),
            color: "#ffffff",
          }}
        >
          {services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      )}

      {/* Tools / Skills */}
      {(videographyTypes.length > 0 ||
        videographySkills.length > 0 ||
        videoEditingSkills.length > 0) && (
        <>
          <h2
            className="font-bold text-xl md:text-3xl mt-14 mb-8"
            style={getHeadingStyle()}
          >
            TOOLS
          </h2>

          <ul
            className="space-y-4 md:space-y-5 list-disc list-inside text-sm md:text-base font-bold leading-relaxed md:leading-loose"
            style={{
              ...getBodyStyle(),
              color: "#ffffff",
            }}
          >
            {videographyTypes.map((item, index) => (
              <li key={`type-${index}`}>{item}</li>
            ))}

            {videographySkills.map((item, index) => (
              <li key={`video-${index}`}>{item}</li>
            ))}

            {videoEditingSkills.map((item, index) => (
              <li key={`edit-${index}`}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default TemplateTwoService;
