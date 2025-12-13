import { skills } from "@/src/constants";
import React from "react";

function PortfolioTemplateOneAboutme() {
  // --- Card styles for About Me / Mission / Tools ---
  const cardStyle =
    "w-full px-8 sm:px-6 md:px-10 lg:px-12 py-15 sm:py-6 md:py-10 lg:py-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-center justify-center";

  const responsiveTextStyle = "tracking-[0%] sm:leading-[100%]";

  // --- Skills Grid Styles (FIXED) ---
  const skillsGridContainerStyle =
    "grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10";

  const skillCardBaseStyle =
    "bg-black rounded-xl flex flex-col gap-3 p-0 w-full";

  const skillContentBoxStyle =
    "bg-white h-40 sm:h-48 md:h-56 lg:h-64 rounded-xl w-full overflow-hidden";

  const skillNameTextStyle =
    "text-center font-normal text-xs sm:text-sm md:text-base text-gold mt-2";

  const accentColor = "#D3A63B";
  const borderColor = "#FFFFFF";

  return (
    <section className="h-fit bg-black">
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-10 pb-5 flex flex-col gap-6">
        {/* About Me */}
        <div className={cardStyle}>
          <p
            className={`${responsiveTextStyle} text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] leading-[140%] sm:leading-[140%] text-center max-w-3xl`}
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
              fontStyle: "normal",
            }}
          >
            I am a creative Graphic Designer & UI/UX Designer with a passion for
            crafting visually stunning and user-friendly designs. With a deep
            understanding of brand identity, digital design, and user
            experience, I help businesses stand out with compelling visuals and
            intuitive interfaces. From logo design and branding to web and
            mobile app design, my goal is to create designs that not only look
            great but also enhance user engagement and conversion.
          </p>
        </div>

        {/* Mission */}
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left">
          Mission and Design Philosophy
        </h2>
        <div className={cardStyle}>
          <p
            className={`${responsiveTextStyle} text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] leading-[140%] sm:leading-[140%] text-center max-w-3xl`}
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
              fontStyle: "normal",
            }}
          >
            I am a creative Graphic Designer & UI/UX Designer with a passion for
            crafting visually stunning and user-friendly designs. With a deep
            understanding of brand identity, digital design, and user
            experience, I help businesses stand out with compelling visuals and
            intuitive interfaces. From logo design and branding to web and
            mobile app design, my goal is to create designs that not only look
            great but also enhance user engagement and conversion.
          </p>
        </div>

        {/* Skills Title */}
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left">
          Skills
        </h2>

        {/* Skills Grid (NOW ALIGNED) */}
        <div className={skillsGridContainerStyle}>
          {skills.map((skill, index) => (
            <div key={index} className={skillCardBaseStyle}>
              {index === 2 ? (
                <div
                  className={`${skillContentBoxStyle} border-4`}
                  style={{ borderColor }}
                >
                  <img
                    src="/assets/template1.png"
                    alt="Skill visualization"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={skillContentBoxStyle}></div>
              )}
              <h2 className={skillNameTextStyle} style={{ color: accentColor }}>
                Branding & Identity Design
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Tools / Software */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-10 pb-5 flex flex-col gap-6">
        <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-purple-500 text-left">
          <span className="text-purple-500">Tool /</span> Software
        </h2>
        <div className={`${cardStyle} items-start`}>
          {(() => {
            const tools = [
              "Adobe Photoshop",
              "Illustrator",
              "InDesign",
              "After Effects",
              "Figma",
              "Adobe XD",
              "Sketch",
              "Canva",
            ];

            const chunked: string[][] = [];
            for (let i = 0; i < tools.length; i += 3) {
              chunked.push(tools.slice(i, i + 3));
            }

            return chunked.map((group, index) => (
              <p
                key={index}
                className={`${responsiveTextStyle} text-[12px] sm:text-[16px] md:text-[16px] lg:text-[16px] text-left font-semibold`}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontStyle: "normal",
                  lineHeight: "2rem",
                }}
              >
                {group.join(", ")}
              </p>
            ));
          })()}
        </div>
      </div>
    </section>
  );
}

export default PortfolioTemplateOneAboutme;
