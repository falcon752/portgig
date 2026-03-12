"use client";
import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFourAboutMeProps {
  aboutMe: string;
  services: string[] | undefined;
  portfolioData: any;
}

export function TemplateFourAboutMe({
  aboutMe,
  services,
  portfolioData,
}: TemplateFourAboutMeProps) {
  const { getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <section className="bg-[#faf7f3] py-10 font-inter">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20">
      
      {/* ABOUT ME */}
      <div className="flex flex-col gap-4 mb-10">
        <h2
          className="font-bold text-darkBlue"
          style={getHeadingStyle({ fontSize: "1rem" })}
        >
          About me
        </h2>

        <div className="bg-white border border-gray-200 rounded-md p-5">
          <p
            className="text-xs md:text-sm text-gray-700 font-istokWeb leading-relaxed"
            style={getBodyStyle({ whiteSpace: "pre-wrap" })}
          >
            {aboutMe ||
              `I’m a passionate Content Writer & Storyteller with a knack for crafting compelling, engaging, and results-driven content.`}
          </p>
        </div>
      </div>

      {/* SERVICES */}
      <div className="flex flex-col gap-4">
        <h2
          className="font-bold text-darkBlue"
          style={getHeadingStyle({ fontSize: "1rem" })}
        >
          My Services
        </h2>

        <div className="flex flex-col gap-4">
          {services && services.filter(s => s.trim()).length > 0 ? (
            services
              .filter(s => s.trim())
              .map((service, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-md px-4 py-4 text-xs md:text-sm font-bold text-gray-700 font-istokWeb"
                >
                  {service}
                </div>
              ))
          ) : (
            <div className="text-xs text-gray-500">
              No services listed.
            </div>
          )}
        </div>
      </div>
      </div>

    </section>
  );
}

export default TemplateFourAboutMe;
