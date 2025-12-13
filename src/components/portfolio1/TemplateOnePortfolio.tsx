import React from "react";
import Buttons from "../Buttons";

// Example portfolio items
const portfolioItems = [
  { title: "Branding & Identity", image: "/assets/portfolio1.png" },
  { title: "UI/UX Design", image: "/assets/portfolio2.png" },
  { title: "Web Design", image: "/assets/portfolio3.png" },
  { title: "Illustration", image: "/assets/portfolio4.png" },
  { title: "Motion Graphics", image: "/assets/portfolio5.png" },
  { title: "Photography", image: "/assets/portfolio6.png" },
];

// Example other services
const otherServices = [
  "Logo Design",
  "Brand Strategy",
  "Illustration",
  "Motion Graphics",
  "Photography",
  "Web Development",
];

export default function PortfolioTemplateOnePortfolio() {
  // Card and grid styles from About Me Skills section
  const cardBaseStyle =
    "bg-black rounded-xl flex flex-col gap-3 p-0 w-full items-center";
  const contentBoxStyle =
    "bg-white h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl w-full overflow-hidden border-4";
  const titleTextStyle =
    "text-center font-normal text-xs sm:text-sm md:text-base text-gold mt-2";
  const accentColor = "#D3A63B"; // gold
  const borderColor = "#FFFFFF"; // white border
  const gridContainerStyle =
    "bg-black py-6 px-4 sm:px-6 md:px-8 lg:px-15 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-x-16 md:gap-y-10 place-items-center";

  // Card style for "Mission" and "Tools" style sections
  const sectionCardStyle =
    "w-full px-8 sm:px-6 md:px-10 lg:px-12 py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-center gap-4";

  return (
    <section className="h-fit bg-black px-4 sm:px-6 md:px-8 lg:px-15 py-10 flex flex-col gap-10">
      {/* Portfolio Header */}
      <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left sm:text-left">
        My <span className="text-purple-500">Portfolio</span>
      </h2>

      {/* Portfolio Grid */}
      <div className={gridContainerStyle}>
        {portfolioItems.map((item, index) => (
          <div key={index} className={cardBaseStyle}>
            <div
              className={contentBoxStyle}
              style={{ borderColor: borderColor }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h2 className={titleTextStyle} style={{ color: accentColor }}>
              {item.title}
            </h2>
          </div>
        ))}
      </div>

      {/* More on Behance/Pinterest */}
      <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left">
        More on Behance / Pinterest
      </h2>

      {/* Call to Action Button */}
      <Buttons
        label="Click here"
        className="bg-white text-black text-base sm:text-lg lg:text-2xl w-fit rounded-full font-bold px-10 sm:px-14 md:px-16 lg:px-20 mt-4"
      />

      {/* Other Services Section (Tools/Software style) */}
      <div className="flex flex-col gap-4 mt-16">
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left">
          Other <span className="text-purple-500">Services/</span> Skills
        </h2>
        <div className="w-full px-8 sm:px-6 md:px-10 lg:px-12 py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-start gap-4">
          {(() => {
            const chunked: string[][] = [];
            for (let i = 0; i < otherServices.length; i += 3) {
              chunked.push(otherServices.slice(i, i + 3));
            }
            return chunked.map((group, index) => (
              <p
                key={index}
                className="text-left font-semibold text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] tracking-[0%] leading-7 sm:leading-8 text-white"
              >
                {group.join(", ")}
              </p>
            ));
          })()}
        </div>
      </div>

      {/* What You Get Working With Me Section (Mission style) */}
      <div className="flex flex-col gap-4 mt-16">
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left">
          What you get working <span className="text-purple-500">with me</span>
        </h2>
        <div className={sectionCardStyle}>
          <p className="text-white text-center text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] leading-[140%] sm:leading-[140%] tracking-[0%]">
            I provide professional design services with a focus on creativity,
            usability, and brand impact. Expect high-quality deliverables,
            timely communication, and a collaborative experience that brings
            your vision to life. From branding to UI/UX and web design, my goal
            is to help your business stand out and achieve measurable results.
          </p>
        </div>
      </div>
    </section>
  );
}
