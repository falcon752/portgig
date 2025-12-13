import React from "react";
import Buttons from "../Buttons";

const portfolioItems = [
  { title: "Branding & Identity", image: "/assets/template1.png" },
  { title: "UI/UX Design", image: "/assets/template1.png" },
  { title: "Web Design", image: "/assets/template1.png" },
  { title: "Illustration", image: "/assets/template1.png" },
  { title: "Motion Graphics", image: "/assets/template1.png" },
  { title: "Photography", image: "/assets/template1.png" },
];

const otherServices = [
  "Logo Design",
  "Brand Strategy",
  "Illustration",
  "Motion Graphics",
  "Photography",
  "Web Development",
];

export default function PortfolioTemplateOnePortfolio() {
  const cardBaseStyle =
    "bg-black rounded-xl flex flex-col gap-4 w-full";

  const contentBoxStyle =
    "bg-white h-64 sm:h-72 md:h-80 lg:h-[22rem] rounded-2xl w-full overflow-hidden border-4";

  const titleTextStyle =
    "text-center font-normal text-xs sm:text-sm md:text-base mt-2";

  const gridContainerStyle =
    "grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-14";

  const sectionCardStyle =
    "w-full px-8 sm:px-6 md:px-10 lg:px-12 py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-center gap-4";

  return (
    <section className="h-fit bg-black">
      {/* MATCHES ABOUT ME CONTAINER */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-10 flex flex-col gap-10">
        {/* Header */}
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500">
          My <span className="text-purple-500">Portfolio</span>
        </h2>

        {/* Grid */}
        <div className={gridContainerStyle}>
          {portfolioItems.map((item, index) => (
            <div key={index} className={cardBaseStyle}>
              <div
                className={contentBoxStyle}
                style={{ borderColor: "#FFFFFF" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2
                className={titleTextStyle}
                style={{ color: "#D3A63B" }}
              >
                {item.title}
              </h2>
            </div>
          ))}
        </div>

        {/* More */}
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500">
          More on Behance / Pinterest
        </h2>

        <Buttons
          label="Click here"
          className="bg-white text-black text-base sm:text-lg lg:text-2xl w-fit rounded-full font-bold px-10 sm:px-14 md:px-16 lg:px-20"
        />

        {/* Other Services */}
        <div className="flex flex-col gap-4 mt-16">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500">
            Other <span className="text-purple-500">Services /</span> Skills
          </h2>

          <div className="w-full px-8 sm:px-6 md:px-10 lg:px-12 py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-start gap-4">
            {Array.from({ length: Math.ceil(otherServices.length / 3) }).map(
              (_, i) => (
                <p
                  key={i}
                  className="font-semibold text-[12px] sm:text-[16px] leading-7 sm:leading-8"
                >
                  {otherServices.slice(i * 3, i * 3 + 3).join(", ")}
                </p>
              )
            )}
          </div>
        </div>

        {/* What You Get */}
        <div className="flex flex-col gap-4 mt-16">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500">
            What you get working <span className="text-purple-500">with me</span>
          </h2>

          <div className={sectionCardStyle}>
            <p className="text-center text-[12px] sm:text-[16px] leading-[140%]">
              I provide professional design services with a focus on creativity,
              usability, and brand impact. Expect high-quality deliverables,
              timely communication, and a collaborative experience that brings
              your vision to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
