"use client";
import Image from "next/image";
import type { TemplateOneHeroProps } from "@/types/template-one";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO } from "@/types/portfolio";

export const TemplateOneHero = ({ portfolio }: TemplateOneHeroProps) => {
  const portfolioData: ApiPortfolioData = portfolio || EMPTY_PORTFOLIO;

  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);
  const jobTitles = portfolioData?.job_titles?.join(" / ") || "Graphics / UI UX Designer";
  const tagline = portfolioData?.about_me || "Creative Graphic & UI/UX Designer Crafting Engaging Digital Experiences";
  const headShotUrl = portfolioData?.head_shot || "/placeholder.svg?height=500&width=500";

  return (
    <div style={customStyles}>
      {/* Mobile Section */}
      <section
        className="lg:hidden bg-purpleLight flex gap-2 py-5"
        style={{ backgroundColor: (customStyles as Record<string, string>)["--bg-color"] }}
      >
        <div className="flex flex-col gap-2 justify-center px-5 w-full">
          <h2
            className="font-bold text-gold"
          >
        <span className="text-gold"></span>    I&apos;am a <br />{" "}
            <span
              style={getHeadingStyle({
                color: "var(--bg-color, white)",
                fontWeight: "bold",
              })}
              className="font-bold"
            >
              {jobTitles.split(" / ")[0]}
              <br />
              {jobTitles.split(" / ")[1] || ""}
              <br />
              {jobTitles.split(" / ")[2] || ""}
            </span>
          </h2>
          <p
            style={getBodyStyle({
              color: "var(--bg-color, white)",
              fontWeight: "bold",
            })}
            className="font-bold"
          >
            {tagline}
          </p>
        </div>
        <div className="w-full flex items-end px-5">
          <div className="h-45 bg-white w-52 flex items-center justify-center overflow-hidden">
            <Image
              src={headShotUrl}
              alt={portfolioData?.display_name || "Designer Headshot"}
              className="h-full w-full object-cover"
              width={200}
              height={180}
            />
          </div>
        </div>
      </section>

      {/* Desktop Section */}
      <section className="max-lg:hidden lg:h-120 bg-purpleLight flex gap-2">
        <div className="flex flex-col gap-2 justify-center px-10 w-full">
          <h2
            style={getHeadingStyle({
              color: "var(--accent-color, #d4af37)",
              fontSize: "1.5rem",
              fontWeight: "bold",
            })}
            className="text-2xl font-bold"
          >
            I&apos;am a <br />{" "}
            <span
              style={getHeadingStyle({
                color: "var(--bg-color, white)",
                fontSize: "3.75rem",
                fontWeight: "bold",
              })}
              className="text-6xl font-bold"
            >
              {jobTitles.split(" / ")[0]}
              <br />
              {jobTitles.split(" / ")[1] || ""}
              <br />
              {jobTitles.split(" / ")[2] || ""}
            </span>
          </h2>
        </div>
        <div className="w-full flex items-end">
          <div className="h-96 bg-white w-full flex items-center justify-center overflow-hidden">
            <Image
              src={headShotUrl}
              alt={portfolioData?.display_name || "Designer Headshot"}
              className="h-full w-full object-cover"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="w-full flex items-end">
          <p
            style={getBodyStyle({
              color: "var(--bg-color, white)",
              fontSize: "1.25rem",
              fontWeight: "bold",
              padding: "2.5rem",
            })}
            className="text-xl font-bold p-10"
          >
            {tagline}
          </p>
        </div>
      </section>
    </div>
  );
};

export default TemplateOneHero;