import { colorUtils, usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";

interface TemplateFiveHealthcareCaseStudyProps {
  brandName: string;
  howYouHelp: string;
  before: string;
  after: string;
  portfolioData?: any;
}

export default function TemplateFiveHealthcareCaseStudy({
  brandName,
  howYouHelp,
  before,
  after,
  portfolioData,
}: TemplateFiveHealthcareCaseStudyProps) {
  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);

  if (!brandName && !howYouHelp && !before && !after) {
    return (
      <div className="bg-black text-white py-12 text-center">
        <p className="text-lg text-gray-400">No case study data to display.</p>
      </div>
    );
  }

  return (
    <div className="border-y border-[#F9C221]" style={{ ...customStyles, borderColor: (customStyles as Record<string, string>)['--accent-color'] }}>
      <div className="bg-[#0F172A] px-4 py-12 md:px-10" style={{ backgroundColor: (customStyles as Record<string, string>)['--bg-color'] }}>
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={getHeadingStyle()}>
            Case Studies (How My Work Helped Brands)
          </h1>
          {/* Brand Title */}
          <h2 className="text-2xl md:text-3xl text-white font-bold mb-6" style={getHeadingStyle()}>
            {brandName || "Healthcare Brand"}
          </h2>
          {/* Description Card */}
          <div
            className="border-2 border-emerald-500 bg-[#1E293B] text-[#E2E8F0] px-4 py-20 rounded-lg mb-10 shadow-lg"
            style={{
              backgroundColor: colorUtils.darken((customStyles as Record<string, string>)['--bg-color'], 0.1),
              borderColor: (customStyles as Record<string, string>)['--primary-color'],
            }}
          >
            <p className="text-center text-sm sm:text-base leading-relaxed" style={getBodyStyle()}>
              {howYouHelp ||
                "Creative and detail-oriented Graphic Designer with [X] years of experience in brand identity, social media design, and marketing visuals. Adept at transforming concepts into compelling visuals that enhance brand presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a strong understanding of design principles and user experience. Passionate about delivering high-quality designs that resonate with audiences and drive engagement."}
            </p>
          </div>
          {/* Before & After */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center w-full md:w-1/2">
              <h3 className="font-bold text-lg mb-3">Before</h3>
              <div
                className="border-2 border-emerald-500 bg-[#1E293B] aspect-square w-full max-w-xs mx-auto rounded-lg shadow-md relative overflow-hidden"
                style={{
                  backgroundColor: colorUtils.darken((customStyles as Record<string, string>)['--bg-color'], 0.1),
                  borderColor: (customStyles as Record<string, string>)['--primary-color'],
                }}
              >
                {before ? (
                  <Image src={before || "/placeholder.svg"} alt={`${brandName} Before`} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                )}
              </div>
            </div>
            <div className="text-center w-full md:w-1/2">
              <h3 className="font-bold text-lg mb-3">After</h3>
              <div
                className="border-2 border-emerald-500 bg-[#1E293B] aspect-square w-full max-w-xs mx-auto rounded-lg shadow-md relative overflow-hidden"
                style={{
                  backgroundColor: colorUtils.darken((customStyles as Record<string, string>)['--bg-color'], 0.1),
                  borderColor: (customStyles as Record<string, string>)['--primary-color'],
                }}
              >
                {after ? (
                  <Image src={after || "/placeholder.svg"} alt={`${brandName} After`} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}