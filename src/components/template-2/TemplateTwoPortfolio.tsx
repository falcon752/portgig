"use client";
import Image from "next/image";
import Link from "next/link";
import { Buttons } from "../export_components";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { getImageUrl } from "@/src/utils/image-url";

interface PortfolioItem {
  image: string;
  title: string;
  link: string;
}

interface TemplateTwoPortfolioProps {
  portfolioItems: PortfolioItem[];
  whyWorkWithMe: string;
  jobsOpenTo: string;
  portfolioData: any;
}

const TemplateTwoPortfolio = ({
  portfolioItems,
  whyWorkWithMe,
  jobsOpenTo,
  portfolioData,
}: TemplateTwoPortfolioProps) => {
  const { getHeadingStyle, getBodyStyle, getAccentStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <>
      {/* MAIN SECTION */}
      <section className="flex flex-col gap-8 md:gap-10 py-8 md:py-14 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Heading */}
        <h2
            className="font-next text-xl md:text-3xl mb-8 font-black"
            style={getHeadingStyle()}
          >
        </h2>

        {/* Portfolio Grid */}
        {portfolioItems?.length > 0 ? (
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5 md:gap-8 lg:gap-40">
            {portfolioItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 md:gap-3 lg:gap-5">
                <Link href={item.link} target="_blank">
                  <div className="bg-gray100 flex flex-col gap-5 h-56 sm:h-64 md:h-72 lg:h-96 center rounded-sm overflow-hidden">
                    {item.image ? (
                      <Image
                        src={getImageUrl(item.image) || item.image}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-contain sm:object-cover"
                      />
                    ) : (
                      <p className="text-black uppercase font-black text-xs sm:text-sm md:text-base lg:text-lg text-center px-4 sm:px-6 md:px-10">
                        Paste youtube/Instagram link
                      </p>
                    )}
                  </div>
                </Link>

                <div className="bg-white center py-2 md:py-2.5 font-bold uppercase text-black text-xs sm:text-sm md:text-base rounded-sm">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center" style={getBodyStyle()}>
            No portfolio items available
          </p>
        )}


        {/* JOBS OPEN TO */}
        <div className="mt-14">
          <h2
            className="font-next text-xl md:text-3xl mb-6 font-black"
            style={getHeadingStyle()}
          >
            Open to <span style={getAccentStyle()}>all kinds of gigs</span>
          </h2>

          <ul
            className="space-y-4 md:space-y-5 list-disc list-inside text-sm md:text-base lg:text-xl font-bold leading-relaxed md:leading-loose"
            style={getBodyStyle()}
          >
            {jobsOpenTo
              .split("\n")
              .filter(Boolean)
              .map((job, index) => (
                <li key={index}>{job}</li>
              ))}
          </ul>
        </div>

        {/* WHY WORK WITH ME */}
        <div className="flex flex-col gap-5 mt-8 md:mt-12 lg:mt-20">
          <h2
            className="font-bold text-xl md:text-3xl"
            style={getHeadingStyle()}
          >
            WHY YOU <span style={getAccentStyle()}>SHOULD WORK WITH ME</span>
          </h2>

          <div className="text-white w-full">
            <h2
              className="font-bold text-sm md:text-base lg:text-lg leading-relaxed"
              style={getBodyStyle()}
            >
              {whyWorkWithMe}
            </h2>
          </div>
        </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="center py-6 md:py-8 lg:py-10">
        <p className="text-center font-bold text-sm md:text-base lg:text-xl px-4 sm:px-6 md:px-8 lg:px-30 text-white" style={getBodyStyle()}>
          Looking forward to working with you
        </p>
      </section>
    </>
  );
};

export default TemplateTwoPortfolio;
