"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/src/utils/image-url";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
  isPhotographerTemplateSpecific,
  CustomCSSProperties,
} from "@/types/portfolio";

interface TemplatesixWeddingShootsProps {
  portfolioData: ApiPortfolioData | null;
}

export default function TemplatesixWeddingShoots({
  portfolioData,
}: TemplatesixWeddingShootsProps) {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { colorUtils, customStyles, getBodyStyle } =
    usePortfolioCustomizations(portfolio);
  const latestWork = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.latest_work || []
    : [];
  const moreWork = isPhotographerTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.photographer.more_work || []
    : [];

  console.log("TemplatesixWeddingShoots: Rendering with data:", {
    latestWork,
    moreWork,
  });

  type SectionItem = {
    name?: string;
    title?: string;
    link: string;
    image?: string;
  };

  const sectionsToRender: SectionItem[] =
    moreWork.length > 0
      ? moreWork.map((item) => ({ ...item, title: item.name }))
      : latestWork.map((item) => ({ ...item, name: item.title }));

  if (sectionsToRender.length === 0) {
    return (
      <div
        className="bg-gray-900 text-white py-12 text-center"
        style={{
          color: (customStyles as CustomCSSProperties)["--primary"] || "#FFF",
          backgroundColor: colorUtils.darken(
            (customStyles as CustomCSSProperties)["--bg-color"] || "#000"
          ),
        }}
      >
        <p className="text-lg text-gray-400" style={getBodyStyle()}>
          No featured shoots listed. Add some in your portfolio settings!
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-900 text-white py-12 space-y-12"
      style={{
        color: (customStyles as CustomCSSProperties)["--primary"] || "#FFF",
        backgroundColor: colorUtils.darken(
          (customStyles as CustomCSSProperties)["--bg-color"] || "#000"
        ),
      }}
    >
      {sectionsToRender.map((section, idx) => (
        <div key={idx} className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center">
              <div
                className="w-[300px] h-[200px] rounded overflow-hidden relative bg-gray-700 flex items-center justify-center"
                style={{
                  boxShadow: `0 4px 8px ${colorUtils.darken(
                    (customStyles as CustomCSSProperties)["--accent-color"] ||
                      "#FCC92F",
                    0.5
                  )}`,
                }}
              >
                {"image" in section && section.image ? (
                  <Image
                    src={getImageUrl(section.image) || section.image}
                    alt={section.title || section.name || `Shoot ${idx + 1}`}
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
                {(
                  section.title ||
                  section.name ||
                  `Shoot ${idx + 1}`
                ).toUpperCase()}
              </h2>
              {section.link ? (
                <Link
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors"
                    style={{
                      boxShadow: `0 4px 8px ${colorUtils.darken(
                        (customStyles as CustomCSSProperties)[
                          "--accent-color"
                        ] || "#FCC92F",
                        0.5
                      )}`,
                    }}
                  >
                    View more{" "}
                    {section.title || section.name || `Shoot ${idx + 1}`}
                  </button>
                </Link>
              ) : (
                <button
                  className="bg-white text-black px-6 py-3 rounded opacity-50 cursor-not-allowed"
                  style={{
                    boxShadow: `0 4px 8px ${colorUtils.darken(
                      (customStyles as CustomCSSProperties)["--accent-color"] ||
                        "#FCC92F",
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
  );
}