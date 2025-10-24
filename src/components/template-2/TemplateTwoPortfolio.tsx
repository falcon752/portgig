import Image from "next/image";
import Link from "next/link";
import { Buttons } from "../export_components";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface PortfolioItem {
  image: string;
  title: string;
  link: string;
}

interface TemplateTwoPortfolioProps {
  portfolioItems: PortfolioItem[];
  linkedinLink?: string;
  mediumLink?: string;
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
  const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <>
      <section className="flex flex-col gap-10 py-20 px-10 lg:px-30">
        <h2
          className="font-bold text-2xl lg:text-3xl text-center text-white"
          style={getHeadingStyle()}
        >
          My<span className="text-gold"> Portfolio</span>
        </h2>

        {portfolioItems && portfolioItems.length > 0 ? (
          <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-40">
            {portfolioItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-5">
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div
                    className="relative w-full h-96 bg-gray100 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: colorUtils.darken(
                        (customStyles as Record<string, string>)["--bg-color"]
                      ),
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <p
                        className="text-black uppercase font-black text-lg text-center px-10"
                        style={getBodyStyle()}
                      >
                        No image available
                      </p>
                    )}
                  </div>
                </Link>
                <div
                  className="bg-yellowGold center py-2 font-bold uppercase text-black"
                  style={{
                    color: (customStyles as Record<string, string>)[
                      "--bg-primary"
                    ],
                    backgroundColor: colorUtils.darken(
                      (customStyles as Record<string, string>)["--bg-color"]
                    ),
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center text-white text-lg"
            style={getBodyStyle()}
          >
            No portfolio items to display.
          </div>
        )}

        <Buttons
          label="View more"
          className="bg-white rounded-none text-black font-bold w-fit px-20 mt-20"
          style={{}}
        />

        <div className="flex flex-col mt-20">
          <h2
            className="font-bold text-2xl text-center text-white"
            style={getHeadingStyle()}
          >
            Jobs
          </h2>
          <h2
            className="text-gold font-bold text-2xl text-center uppercase"
            style={getHeadingStyle()}
          >
            Open to all kinds of gigs
          </h2>
        </div>

        {/* Render jobsOpenTo as a string instead of array mapping */}
        {jobsOpenTo && (
          <p
            className="text-xl font-bold text-white mt-5"
            style={getBodyStyle()}
          >
            {jobsOpenTo}
          </p>
        )}

        <h2
          className="text-gold font-bold text-2xl uppercase mt-20"
          style={getHeadingStyle()}
        >
          Why you should work with me
        </h2>
      </section>

      <section
        className="bg-brownLight center"
        style={{
          backgroundColor: (customStyles as Record<string, string>)[
            "--bg-color"
          ],
        }}
      >
        <p
          className="text-center text-sm py-10 px-10 lg:px-30 text-white"
          style={{
            color: (customStyles as Record<string, string>)["--bg-text"],
          }}
        >
          {whyWorkWithMe ||
            "As a passionate and detail-oriented professional, I bring creativity, precision, and storytelling into every project. My commitment to professionalism, quick turnaround, and client satisfaction makes me the ideal choice for your needs. Let's create something amazing together!"}
        </p>
      </section>

      <section className="center">
        <p
          className="text-center font-bold text-sm lg:text-xl py-10 px-10 lg:px-30 text-white"
          style={getBodyStyle()}
        >
          Looking forward to working with you
        </p>
      </section>
    </>
  );
};

export default TemplateTwoPortfolio;
