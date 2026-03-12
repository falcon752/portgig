"use client";

import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveToolsProps {
  toolsIUse: string[];
  whyWorkWithMe: string;
  portfolioData?: any;
}

export default function Tools({
  toolsIUse,
  whyWorkWithMe,
  portfolioData,
}: TemplateFiveToolsProps) {
  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);

  return (
    <section
      className="bg-[#f9f9f9] px-6 py-12"
      style={{ ...customStyles }}
    >
      {/* Tools I Use */}
      <h3 className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal mb-8 text-center" style={getHeadingStyle()}>
        Tools I Use
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {toolsIUse && toolsIUse.length > 0 ? (
          toolsIUse.map((tool, index) => (
            <div
              key={index}
              className="
                bg-white
                border
                border-[#7fd3f7]
                rounded-lg
                px-6
                py-5
                text-sm
                md:text-base
                text-[#0A1754]
                font-bold
                leading-relaxed
                flex
                items-center
                justify-center
                min-h-[96px]
              "
            >
              {tool}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No tools listed.
          </p>
        )}
      </div>

      {/* Why Work With Me */}
      <h3 className="text-4xl font-black font-[MuseoSansRounded] leading-none tracking-normal mb-6 mt-16 text-center" style={getHeadingStyle()}>
        Why You Should Work With Me
      </h3>

      <div className="bg-white border border-[#7fd3f7] font-semibold rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed">
        <p>
          {whyWorkWithMe ||
            "As a passionate and detail-oriented professional, I bring creativity, precision, and storytelling into every project. My commitment to professionalism, quick turnaround, and client satisfaction makes me the ideal choice for your needs. Let’s create something amazing together!"}
        </p>
      </div>
    </section>
  );
}
