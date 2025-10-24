import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

export default function TemplateFivePortfolio() {
  const { customStyles, getHeadingStyle } = usePortfolioCustomizations();

  return (
    <div className="bg-black py-12 md:py-20" style={{ backgroundColor: (customStyles as Record<string, string>)['--bg-color'] }}>
      <div className="relative max-w-6xl mx-auto px-4 md:px-10">
        {/* Decorative Elements */}
        <div className="absolute -left-10 md:-left-20 top-1/4 transform -translate-y-1/2 hidden md:block">
          <Image
            src="/assets/jlj1.svg"
            alt="Left decorative element"
            width={300}
            height={300}
          />
        </div>
        <div className="absolute -right-10 md:-right-20 top-3/4 transform -translate-y-1/2 hidden md:block">
          <Image
            src="/assets/jlj2.svg"
            alt="Right decorative element"
            width={300}
            height={300}
          />
        </div>

        {/* Content */}
        <div className="text-center">
          <h1
            className="text-2xl md:text-4xl font-bold text-white mb-2"
            style={getHeadingStyle()}
          >
            My Content Creation
          </h1>
          <h2
            className="text-3xl md:text-6xl font-bold text-yellow-400"
            // style={{ ...getHeadingStyle(), color: (customStyles as Record<string, string>)['--accent-color'] }}
          >
            Portfolio
          </h2>
        </div>
      </div>
    </div>
  );
}