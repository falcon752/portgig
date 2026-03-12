"use client";
import Image from "next/image";
import type { TemplateOneAboutmeProps } from "@/types/template-one";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { getImageUrl } from "@/src/utils/image-url";
import {
  ApiPortfolioData,
  DesignerTemplateSpecific,
  EMPTY_PORTFOLIO,
} from "@/types/portfolio";
import { Key } from "react";

export const TemplateOneAboutme = ({ portfolio }: TemplateOneAboutmeProps) => {
  const portfolioData: ApiPortfolioData = portfolio || EMPTY_PORTFOLIO;

  const { customStyles, getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  const aboutMeText =
    portfolioData?.about_me ||
    "I am a creative Graphic Designer & UI/UX Designer with a passion for crafting visually stunning and user-friendly designs. With a deep understanding of brand identity, digital design, and user experience, I help businesses stand out with compelling visuals and intuitive interfaces. From logo design and branding to web and mobile app design, my goal is to create designs that not only look great but also enhance user engagement and conversion.";

  const missionPhilosophyText =
    portfolioData?.mission ||
    "My mission is to deliver innovative and impactful design solutions that resonate with audiences and achieve client objectives. My design philosophy centers on user-centricity, aesthetic appeal, and functional simplicity. I believe that great design is a blend of art and science, where creativity meets strategic thinking to solve real-world problems.";

  const designerSpecific =
    portfolioData.template_type === "DESIGNER" &&
    portfolioData.template_specific
      ? (portfolioData.template_specific as DesignerTemplateSpecific).designer
      : undefined;

  const hasValidDesignerData =
    !!designerSpecific &&
    Array.isArray(designerSpecific.skills) &&
    Array.isArray(designerSpecific.tools);

  const toolsSoftwareText =
    hasValidDesignerData && designerSpecific.tools.length > 0
      ? designerSpecific.tools.join(", ")
      : hasValidDesignerData && designerSpecific.tools.length === 0
      ? "No tools specified."
      : "Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects), Figma, Adobe XD, Sketch, Canva (for quick design work)";

  const cardStyle =
    "w-full px-8 sm:px-6 md:px-10 lg:px-12 py-15 sm:py-6 md:py-10 lg:py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-center justify-center";

  const responsiveTextStyle = "tracking-[0%] sm:leading-[100%]";

  const skillsGridContainerStyle =
    "grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10";

  const skillCardBaseStyle = "bg-black rounded-xl flex flex-col gap-3 p-0 w-full";

  const skillContentBoxStyle =
    "bg-white h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl w-full overflow-hidden";

  const skillNameTextStyle =
    "text-center font-normal text-xs sm:text-sm md:text-base text-gold mt-2";

  const accentColor = "#D3A63B";
  const borderColor = "#FFFFFF";

  return (
    <section className="h-fit bg-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-10 pb-5 flex flex-col gap-6">
        {/* About Me */}}
        <div className={cardStyle}>
          <p
            className={`${responsiveTextStyle} text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] leading-[140%] sm:leading-[140%] text-center max-w-3xl`}
            style={getBodyStyle()}
          >
            {aboutMeText}
          </p>
        </div>

        {/* Mission */}
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-left" style={getHeadingStyle()}>
          Mission and Design Philosophy
        </h2>
        <div className={cardStyle}>
          <p
            className={`${responsiveTextStyle} text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] leading-[140%] sm:leading-[140%] text-center max-w-3xl`}
            style={getBodyStyle()}
          >
            {missionPhilosophyText}
          </p>
        </div>

        {/* Skills */}
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-left" style={getHeadingStyle()}>
          Skills
        </h2>
        <div className={skillsGridContainerStyle}>
          {hasValidDesignerData && designerSpecific.skills.length > 0 ? (
            designerSpecific.skills.map(
              (skill: { image: any; name: any }, index: Key | null | undefined) => (
                <div key={index} className={skillCardBaseStyle}>
                  <div
                    className={skillContentBoxStyle}
                    style={{ borderColor: borderColor }}
                  >
                    <Image
                      src={
                        getImageUrl(skill.image) || skill.image || "/placeholder.svg?height=288&width=288&query=skill icon"
                      }
                      alt={skill.name || "Skill icon"}
                      className="w-full h-full object-cover"
                      width={288}
                      height={288}
                    />
                  </div>
                  <h2 className={skillNameTextStyle} style={{ color: accentColor }}>
                    {skill.name || "Skill Name"}
                  </h2>
                </div>
              )
            )
          ) : (
            <p className="text-center text-gray-700 col-span-full md:col-span-2">
              No skills available.
            </p>
          )}
        </div>
      </div>

      {/* Tools / Software */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-10 pb-5 flex flex-col gap-6">
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-left" style={getHeadingStyle()}>
          <span>Tool /</span> Software
        </h2>
        <div className={`${cardStyle} items-start`}>
          {toolsSoftwareText.split(", ").map((tool, index) => (
            <p
              key={index}
              className={`${responsiveTextStyle} text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] text-left font-semibold`}
              style={getBodyStyle()}
            >
              {tool}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateOneAboutme;
