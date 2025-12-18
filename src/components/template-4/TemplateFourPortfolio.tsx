"use client";
import Image from "next/image";
import Link from "next/link";
import { Buttons } from "../export_components";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface PortfolioItem {
  title: string;
  image?: string;
  link: string;
}

interface TemplateFourPortfolioProps {
  portfolioItems: PortfolioItem[];
  caseStudyContent: string;
  linkedinLink?: string;
  mediumLink?: string;
  portfolioData: any;
  whyWorkWithMe?: string;
}

export function TemplateFourPortfolio({
  portfolioItems,
  caseStudyContent,
  linkedinLink,
  mediumLink,
  portfolioData,
  whyWorkWithMe,
}: TemplateFourPortfolioProps) {
  const { getBodyStyle } = usePortfolioCustomizations(portfolioData);

  const items =
    portfolioItems?.filter((i) => i.title || i.link || i.image) || [];

  return (
    <section className="bg-[#faf7f3] px-5 md:px-10 lg:px-20 py-10 space-y-12 font-istokWeb">
      {/* PORTFOLIO */}
      {items.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-darkBlue font-bold text-lg">My Portfolio</h2>

          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {item.image && (
                <div className="relative w-full h-56">
                  <Image
                    src={item.image}
                    alt={item.title || "portfolio"}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              )}

              <div className="px-6 py-8 space-y-6 text-center">
                <h3 className="font-bold text-darkBlue text-base">
                  {item.title || "Untitled work"}
                </h3>

                {item.link && (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Buttons
                      label="Read more"
                      className="
            w-full
            border
            border-orange-400
            text-orange-400
            bg-white
            rounded-md
            py-3
            font-medium
          "
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CASE STUDY */}
      {caseStudyContent && caseStudyContent.trim() && (
        <div className="space-y-6">
          <h2 className="text-darkBlue font-bold text-lg">Case Study</h2>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm lg:text-base text-gray-600 leading-relaxed">
            <p style={getBodyStyle({})}>{caseStudyContent}</p>
          </div>
        </div>
      )}

      {/* SOCIAL LINKS */}
      {(linkedinLink || mediumLink) && (
        <div className="space-y-6">
          <h2 className="text-darkBlue font-bold text-lg">
            Social & Writing Platform Links
          </h2>

          <div className="flex flex-col gap-10">
            {linkedinLink && (
              <div className="space-y-3 text-center">
                <p className="font-bold text-darkBlue">LinkedIn</p>
                <Link href={linkedinLink} target="_blank">
                  <Buttons
                    label="Click here"
                    className="
                      w-full
                      border
                      border-orange-400
                      text-orange-400
                      bg-white
                      rounded-md
                      py-3
                    "
                  />
                </Link>
              </div>
            )}

            {mediumLink && (
              <div className="space-y-3 text-center">
                <p className="font-bold text-darkBlue">Medium</p>
                <Link href={mediumLink} target="_blank">
                  <Buttons
                    label="Click here"
                    className="
                      w-full
                      border
                      border-orange-400
                      text-orange-400
                      bg-white
                      rounded-md
                      py-3
                    "
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WHY WORK WITH ME */}
      {whyWorkWithMe && (
        <div className="space-y-6">
          <h2 className="text-darkBlue font-bold text-lg">
            Why you should work with me?
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm lg:text-base text-gray-600 leading-relaxed">
            <p style={getBodyStyle({})}>{whyWorkWithMe}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default TemplateFourPortfolio;
