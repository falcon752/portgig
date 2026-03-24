"use client";

import Image from "next/image";
import Buttons from "../Buttons";
import type { TemplateOnePortfolioProps } from "@/types/template-one";
import {
  EMPTY_PORTFOLIO,
  type DesignerTemplateSpecific,
} from "@/types/portfolio";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { getImageUrl } from "@/src/utils/image-url";

const TemplateOnePortfolio = ({ portfolio }: TemplateOnePortfolioProps) => {
  const portfolioData = portfolio || EMPTY_PORTFOLIO;
  const { customStyles, getHeadingStyle, getBodyStyle, customBackgroundColor } = usePortfolioCustomizations(portfolioData);

  const designerSpecific =
    portfolioData.template_type === "DESIGNER" &&
    portfolioData.template_specific
      ? (portfolioData.template_specific as DesignerTemplateSpecific).designer
      : undefined;

  const portfolioItems =
    portfolioData.files && portfolioData.files.length > 0
      ? portfolioData.files.map(file => ({
          ...file,
          image: getImageUrl(file.image) || "/placeholder.svg?height=480&width=640"
        }))
      : Array.from({ length: 6 }).map(() => ({
          title: "Portfolio Item",
          image: "/placeholder.svg?height=480&width=640",
        }));

  const behanceLink =
    designerSpecific?.behance || portfolioData.social?.behance;

  const otherServices = portfolioData.other_services || [];

  const whatYouGetText =
    portfolioData.what_you_get_working_with_me ||
    "I provide professional design services with a focus on creativity, usability, and brand impact. Expect high-quality deliverables, timely communication, and a collaborative experience that brings your vision to life.";

  /* ---- SHARED STYLES (MATCH STATIC) ---- */
  const gridContainerStyle =
    "grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-14";

  const cardBaseStyle =
    "bg-black rounded-xl flex flex-col gap-4 w-full";

  const contentBoxStyle =
    "bg-white h-64 sm:h-72 md:h-80 lg:h-[22rem] rounded-2xl w-full overflow-hidden border-4";

  const titleTextStyle =
    "text-center font-normal text-xs sm:text-sm md:text-base mt-2";

  const sectionCardStyle =
    "w-full px-8 sm:px-6 md:px-10 lg:px-12 py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-center gap-4";

  return (
    <div style={customStyles}>
      <section className="h-fit bg-black" style={customBackgroundColor ? { backgroundColor: customBackgroundColor } : undefined}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 flex flex-col gap-10">
          {/* Header */}
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl" style={getHeadingStyle()}>
            My <span>Portfolio</span>
          </h2>

          {/* Portfolio Grid */}
          <div className={gridContainerStyle}>
            {portfolioItems.map((item, index) => (
              <div key={index} className={cardBaseStyle}>
                <div
                  className={contentBoxStyle}
                  style={{ borderColor: "#FFFFFF" }}
                >
                  <Image
                    src={item.image}
                    alt={item.title || "Portfolio item"}
                    width={640}
                    height={420}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2
                  className={titleTextStyle}
                  style={{ color: "#D3A63B" }}
                >
                  {item.title || "Portfolio Item"}
                </h2>
              </div>
            ))}
          </div>

          {/* More on Behance */}
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl" style={getHeadingStyle()}>
            More on Behance / Pinterest
          </h2>

          <Buttons
            label={behanceLink ? "Click here" : "Add a Behance link"}
            href={behanceLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!behanceLink}
            className="bg-white text-black text-base sm:text-lg lg:text-2xl w-fit rounded-full font-bold px-10 sm:px-14 md:px-16 lg:px-20"
          />

          {/* Other Services */}
          <div className="flex flex-col gap-4 mt-16">
            <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl" style={getHeadingStyle()}>
              Other <span>Services /</span> Skills
            </h2>

            <div className="w-full px-8 sm:px-6 md:px-10 lg:px-12 py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-start gap-4">
              {otherServices.length > 0 ? (
                Array.from({
                  length: Math.ceil(otherServices.length / 3),
                }).map((_, i) => (
                  <p
                    key={i}
                    className="font-semibold text-[12px] sm:text-[16px] leading-7 sm:leading-8"
                    style={getBodyStyle()}
                  >
                    {otherServices.slice(i * 3, i * 3 + 3).join(", ")}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-400" style={getBodyStyle()}>
                  No other services listed.
                </p>
              )}
            </div>
          </div>

          {/* What You Get */}
          <div className="flex flex-col gap-4 mt-16">
            <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl" style={getHeadingStyle()}>
              What you get working{" "}
              <span>with me</span>
            </h2>

            <div className={sectionCardStyle}>
              <p className="text-center text-[12px] sm:text-[16px] leading-[140%]" style={getBodyStyle()}>
                {whatYouGetText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TemplateOnePortfolio;
