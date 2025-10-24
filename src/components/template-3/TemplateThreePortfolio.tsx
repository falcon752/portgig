"use client";
import Image from "next/image";
import Link from "next/link";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
} from "@/types/portfolio";

interface TemplateThreePortfolioProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreePortfolio = ({
  portfolioData,
}: TemplateThreePortfolioProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, getBodyStyle, getAccentStyle } =
    usePortfolioCustomizations(portfolio);
  const colors = portfolio.fonts?.colors || {
    background: "#000",
    accent: "#0A1754",
    text: "#FFF",
    primary: "#6B46C1",
  };
  const headingStyle = getHeadingStyle();
  const bodyStyle = getBodyStyle();
  const accentStyle = getAccentStyle();

  const portfolioItems = portfolio.files || [];
  

  return (
    <section
      className="py-20 space-y-5"
      style={{
        backgroundColor: colors.background,
        fontFamily: portfolio.fonts?.body_font,
      }}
    >
      <div className="px-5 lg:px-10 flex flex-col gap-5">
        <h2 className="text-lg font-bold" style={headingStyle}>
          My <span style={accentStyle}>Portfolio</span>
        </h2>
      </div>
      <div
        className="w-full h-5"
        style={{ backgroundColor: colors.accent }}
      ></div>

      {portfolioItems.length > 0 ? (
        <div className="px-5 lg:px-10 flex flex-col gap-5">
          {portfolioItems.map((item, index) => (
            <Link
              href={item.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="border-b px-5 lg:px-10 py-2 flex items-center gap-5 lg:gap-10 hover:opacity-80 transition-opacity duration-200"
              style={{
                color: colors.text,
                borderColor: colors.primary,
                fontFamily: portfolio.fonts?.body_font,
              }}
            >
              <div
                className="flex-1/3 relative h-30 max-w-60 w-full overflow-hidden"
                style={{ backgroundColor: colors.primary }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex items-center justify-center h-full text-xs"
                    style={{ color: colors.background }}
                  >
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-2/3 flex flex-col justify-center">
                <h2 className="font-bold lg:text-2xl" style={headingStyle}>
                  {item.title}
                </h2>
                <p
                  className="font-bold cursor-pointer text-xs"
                  style={accentStyle}
                >
                  Click Here
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center px-5 lg:px-10" style={bodyStyle}>
          No portfolio items to display.
        </p>
      )}

    </section>
  );
};

export default TemplateThreePortfolio;
