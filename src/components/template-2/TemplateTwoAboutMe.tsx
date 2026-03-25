"use client";

import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { getImageUrl } from "@/src/utils/image-url";

interface TemplateTwoAboutMeProps {
  aboutMe?: string;
  portfolioData?: any;
}

const TemplateTwoAboutMe = ({
  aboutMe,
  portfolioData,
}: TemplateTwoAboutMeProps) => {
  const { getHeadingStyle, getBodyStyle, customBackgroundColor, getAccentStyle } =
    usePortfolioCustomizations(portfolioData);

  // Take first 3 images without title/link
  const additionalImages =
    portfolioData?.files
      ?.filter(
        (file: { image: string; title?: string; link?: string }) =>
          file.image && !file.title && !file.link
      )
      ?.slice(0, 3) || [];

  return (
    <section
      className="bg-black"
      style={{ fontFamily: getBodyStyle().fontFamily, ...(customBackgroundColor ? { backgroundColor: customBackgroundColor } : {}) }}
    >
      <div className="max-w-[1400px] mx-auto py-8 lg:py-20 px-5 md:px-10 flex flex-col gap-10">
      {/* Image boxes – stacked vertically (matches static) */}
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-40 sm:h-52 md:h-72 lg:h-92 rounded-lg overflow-hidden bg-white"
          >
            {additionalImages[index]?.image && (
              <Image
                src={getImageUrl(additionalImages[index].image) || additionalImages[index].image}
                alt={`Additional image ${index + 1}`}
                width={384}
                height={384}
                className="w-full h-full object-contain sm:object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* About Me text */}
      <div className="flex flex-col gap-5">
          <h2
            className="font-next font-bold text-xl md:text-3xl"
            style={getHeadingStyle()}
          >
            ABOUT <span style={getAccentStyle()}>ME</span>
          </h2>

        <p
          className="text-white text-base leading-relaxed"
          style={getBodyStyle()}
        >
          {aboutMe ||
            "Creative and detail-oriented Graphic Designer with [X] years of experience in brand identity, social media design, and marketing visuals. Adept at transforming concepts into compelling visuals that enhance brand presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a strong understanding of design principles and user experience. Passionate about delivering high-quality designs that resonate with audiences and drive engagement."}
        </p>
      </div>
      </div>
    </section>
  );
};

export default TemplateTwoAboutMe;
