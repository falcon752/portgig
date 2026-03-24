"use client";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/src/utils/image-url";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
} from "@/types/portfolio";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateThreePortfolioProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreePortfolio = ({
  portfolioData,
}: TemplateThreePortfolioProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, customBackgroundColor, customPrimaryColor } = usePortfolioCustomizations(portfolio);

  const portfolioItems = portfolio.files || [];

  return (
    <section className="bg-black text-white py-20" style={customBackgroundColor ? { backgroundColor: customBackgroundColor } : undefined}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-12">
      {/* SECTION TITLE */}
      <h2
        className="text-xl lg:text-2xl font-bold mb-10 text-white"
        style={getHeadingStyle()}
      >
        My <span className="text-cyan-400" style={customPrimaryColor ? { color: customPrimaryColor } : undefined}>Portfolio</span>
      </h2>

      {/* PORTFOLIO LIST */}
      <div className="flex flex-col gap-14">
        {portfolioItems.length > 0 ? (
          portfolioItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 w-full">
              {/* PREVIEW BOX */}
              <div className="w-full h-56 lg:h-72 bg-white rounded-xl overflow-hidden">
                {item.image ? (
                  <Image
                    src={getImageUrl(item.image) || item.image}
                    alt={item.title}
                    width={1200}
                    height={600}
                    className="w-full h-full object-contain sm:object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* TITLE */}
              <h3 className="font-bold text-lg lg:text-xl" style={getHeadingStyle()}>
                {item.title}
              </h3>

              {/* BUTTON */}
              <Link
                href={item.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-md transition text-center"
              >
                Visit Site
              </Link>
            </div>
          ))
        ) : (
          <p className="text-white">No portfolio items to display.</p>
        )}
      </div>
      </div>
    </section>
  );
};

export default TemplateThreePortfolio;
