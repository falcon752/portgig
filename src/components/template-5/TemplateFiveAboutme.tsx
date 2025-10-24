import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveAboutMeProps {
  aboutMe: string;
  years: string;
  portfolioData?: any;
}

export default function TemplateFiveAboutMe({ aboutMe, years, portfolioData }: TemplateFiveAboutMeProps) {
  const { customStyles, getHeadingStyle, getBodyStyle, colorUtils } = usePortfolioCustomizations(portfolioData);

  return (
    <div
      className="py-6"
      style={{ ...customStyles, backgroundColor: (customStyles as Record<string, string>)['--bg-color'] }}
    >
      <h2
        className="text-2xl font-bold inline-block mb-4 px-6 md:px-10"
        style={getHeadingStyle()}
      >
        About me
      </h2>
      <div
        className="flex flex-col md:flex-row justify-between items-center p-6 md:p-10 border-y gap-6 md:gap-0"
        style={{
          backgroundColor: colorUtils.darken((customStyles as Record<string, string>)['--bg-color'] || '#1C1C1C', 0.1),
          borderColor: (customStyles as Record<string, string>)['--accent-color'],
        }}
      >
        <div className="flex flex-col items-center leading-none">
          <span
            className="text-3xl md:text-5xl lg:text-8xl font-bold"
            // style={getHeadingStyle({ color: (customStyles as Record<string, string>)['--accent-color'] })}
          >
            {years}
          </span>
        
        </div>
        <div
          className="w-full max-w-[90%] md:max-w-[621px] h-auto md:h-[255px] lg:h-[355px] text-center text-sm lg:text-2xl p-6 md:p-8 rounded-md"
          style={{
            backgroundColor: colorUtils.hexToRgba((customStyles as Record<string, string>)['--text-color'] || '#D9D9D9', 0.13),
            ...getBodyStyle(),
          }}
        >
          {aboutMe ||
            "Creative and detail-oriented Graphic Designer with [X] years of experience in brand identity, social media design, and marketing visuals. Adept at transforming concepts into compelling visuals that enhance brand presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a strong understanding of design principles and user experience. Passionate about delivering high-quality designs that resonate with audiences and drive engagement."}
        </div>
      </div>
    </div>
  );
}