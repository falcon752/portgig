import { skills } from "@/src/constants";
import React from "react";

function PortfolioTemplateOneAboutme() {
    // Updated card style with new bg, thicker border, and centered content
    const cardStyle =
        "w-full p-5 sm:p-6 md:p-8 lg:p-10 text-white rounded-lg border-2 border-[#4E3E60] bg-[#17151E] shadow-lg shadow-purple-500/10 flex flex-col items-center justify-center";

    const responsiveTextStyle = "text-center leading-[100%] tracking-[0%]";

    return (
        <section className="h-fit bg-black"> 
            
            {/* TEXT SECTION */}
            <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-10 pb-5 flex flex-col gap-8">
                
                {/* First Text Block */}
                <div className={cardStyle}>
                    <p
                        className={`${responsiveTextStyle} text-[8px] sm:text-[16px] md:text-[24px] lg:text-[30px]`}
                        style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontStyle: "normal" }}
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

                {/* MISSION HEADING */}
                <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-500 text-center">
                    Mission and Design Philosophy
                </h2>
                
                {/* MISSION TEXT BLOCK */}
                <div className={cardStyle}>
                    <p
                        className={`${responsiveTextStyle} text-[8px] sm:text-[16px] md:text-[24px] lg:text-[30px]`}
                        style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontStyle: "normal" }}
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

                {/* SKILLS TITLE */}
                <h2 className="text-gold font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center">
                    Skills
                </h2>
            </div>

            {/* SKILLS GRID */}
            <div className="bg-white py-8 px-4 sm:px-6 md:px-8 lg:px-15 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-x-20 md:gap-y-12 place-items-center">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="bg-purpleBg rounded-2xl flex flex-col gap-5 p-5 sm:p-6 md:p-8 w-full items-center"
                    >
                        <div className="bg-white h-40 sm:h-48 md:h-60 lg:h-72 rounded-xl"></div>
                        <h2 className="text-center font-bold text-lg sm:text-xl md:text-2xl text-white">
                            {skill}
                        </h2>
                    </div>
                ))}
            </div>

            {/* TOOLS */}
            <div className="bg-purpleBg p-6 sm:p-8 md:p-10 lg:p-20 flex flex-col gap-4 sm:gap-5 items-center">
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl text-white text-center">
                    <span className="text-gold">Tool/</span> Software
                </h2>
                <p className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center">
                    Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects),
                    Figma, Adobe XD, Sketch, Canva (for quick design work)
                </p>
                <p className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center">
                    Sketch Canva (for quick design work)
                </p>
            </div>
        </section>
    );
}

export default PortfolioTemplateOneAboutme;
