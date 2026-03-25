"use client";

import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO } from "@/types/portfolio";

interface TemplatesixAboutMeProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixAboutMe({ portfolioData }: TemplatesixAboutMeProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getBodyStyle, getHeadingStyle, getAccentStyle, customBackgroundColor } = usePortfolioCustomizations(portfolio);
  const aboutMe = portfolio.about_me || "Tell us about yourself! Add a description in your portfolio settings.";

  return (
    <section className="relative w-full py-20 font-montserrat bg-black" style={customBackgroundColor ? { backgroundColor: customBackgroundColor } : undefined}>

      {/* Background image + overlay */}
      <div className="absolute inset-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1450px] relative">
          <Image
            src={"/assets/portfolio/heroimage.png"}
            alt="About background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto max-w-[1450px] px-2 sm:px-4 lg:px-12">

        {/* Title */}
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-8" style={getAccentStyle()}>
          ABOUT ME
        </h2>

        {/* Text */}
        <div className="mx-auto w-full lg:max-w-5xl">
          <p
            className="text-center text-white leading-relaxed"
            style={{ fontSize: "clamp(13px, 3.2vw, 18px)", ...getBodyStyle() }}
          >
            {aboutMe}
          </p>
        </div>

      </div>
    </section>
  );
}
