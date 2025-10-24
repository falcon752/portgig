import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image";

interface TemplateTwoAboutMeProps {
  aboutMe: string;
  portfolioData: any;
}

const TemplateTwoAboutMe = ({ aboutMe, portfolioData }: TemplateTwoAboutMeProps) => {
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);

  const additionalImages = portfolioData?.files
    ?.filter((file: { image: string; title: string; link: string }) => file.image && !file.title && !file.link)
    ?.slice(0, 3) || [];

  return (
    <section
      className="py-20 px-5 md:px-10 flex flex-col gap-10"
      style={{
        backgroundColor: colorUtils.darken((customStyles as Record<string, string>)["--bg-color"]),
        fontFamily: portfolioData?.fonts?.body_font,
      }}
    >
      <div className="flex gap-5 md:gap-15">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full aspect-square"
            style={{
              boxShadow: `0 4px 8px ${colorUtils.darken(
                (customStyles as Record<string, string>)["--accent-color"] || "#FFBA00",
                0.5
              )}`,
            }}
          >
            {additionalImages[index]?.image ? (
              <Image
                src={additionalImages[index].image}
                alt={`Additional image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                width={300}
                height={300}
              />
            ) : (
              <div className="bg-white w-full h-full rounded-lg" />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="font-bold text-xl lg:text-3xl text-white" style={getHeadingStyle()}>
          ABOUT<span className="text-yellowGold"> ME</span>
        </h2>
        <p className="text-white text-base leading-relaxed" style={getBodyStyle()}>
          {aboutMe}
        </p>
      </div>
    </section>
  );
};

export default TemplateTwoAboutMe;