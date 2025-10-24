"use client";
import Image from "next/image";
import type { TemplateOneAboutmeProps } from "@/types/template-one";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import {
    ApiPortfolioData,
    DesignerTemplateSpecific,
    EMPTY_PORTFOLIO,
} from "@/types/portfolio";
import { Key } from "react";

export const TemplateOneAboutme = ({ portfolio }: TemplateOneAboutmeProps) => {
    const portfolioData: ApiPortfolioData = portfolio || EMPTY_PORTFOLIO;

    const { customStyles, getHeadingStyle, getBodyStyle } =
        usePortfolioCustomizations(portfolioData);
    const aboutMeText =
        portfolioData?.about_me ||
        "I am a creative Graphic Designer & UI/UX Designer with a passion for crafting visually stunning and user-friendly designs. With a deep understanding of brand identity, digital design, and user experience, I help businesses stand out with compelling visuals and intuitive interfaces. From logo design and branding to web and mobile app design, my goal is to create designs that not only look great but also enhance user engagement and conversion.";
    const missionPhilosophyText =
        portfolioData?.mission ||
        "My mission is to deliver innovative and impactful design solutions that resonate with audiences and achieve client objectives. My design philosophy centers on user-centricity, aesthetic appeal, and functional simplicity. I believe that great design is a blend of art and science, where creativity meets strategic thinking to solve real-world problems.";

    const designerSpecific =
        portfolioData.template_type === "DESIGNER" &&
            portfolioData.template_specific
            ? (portfolioData.template_specific as DesignerTemplateSpecific).designer
            : undefined;
    const hasValidDesignerData =
        !!designerSpecific &&
        Array.isArray(designerSpecific.skills) &&
        Array.isArray(designerSpecific.tools);


    const toolsSoftwareText =
        hasValidDesignerData && designerSpecific.tools.length > 0
            ? designerSpecific.tools.join(", ")
            : hasValidDesignerData && designerSpecific.tools.length === 0
                ? "No tools specified."
                : "Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects), Figma, Adobe XD, Sketch, Canva (for quick design work)";

    return (
        <section className="h-fit">
            <div className="px-10 pt-15 pb-5 flex flex-col gap-10">
                <h2
                    className="font-bold text-xl lg:text-3xl text-white"
                    style={getHeadingStyle()}
                >
                    About <span className="text-gold">Me</span>
                </h2>
                <div
                    className="w-full bg-white p-10 text-primary"
                    style={getBodyStyle()}
                >
                    <p className="text-xs lg:text-lg font-bold">{aboutMeText}</p>
                </div>
                <h2
                    className="font-bold text-xl lg:text-3xl text-white"
                    style={getHeadingStyle()}
                >
                    <span className="text-gold">Mission and</span> Design Philosophy
                </h2>
                <div
                    className="w-full bg-white p-10 text-primary"
                    style={getBodyStyle()}
                >
                    <p className="text-xs lg:text-lg font-bold">
                        {missionPhilosophyText}
                    </p>
                </div>
                <h2
                    className="text-gold font-bold text-xl lg:text-3xl"
                    style={getHeadingStyle()}
                >
                    Skills
                </h2>
            </div>
            <div className="bg-white py-10 px-5 lg:px-15 flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-x-50 md:gap-y-1 place-items-center">
                {hasValidDesignerData && designerSpecific.skills.length > 0 ? (
                    designerSpecific.skills.map(
                        (
                            skill: { image: any; name: any },
                            index: Key | null | undefined
                        ) => (
                            <div
                                key={index}
                                className="bg-purpleBg rounded-2xl flex flex-col gap-5 p-5 pb-10 w-full"
                                style={{
                                    backgroundColor: (customStyles as Record<string, string>)[
                                        "--bg-color"
                                    ],
                                }}
                            >
                                <div
                                    className="bg-white h-52 md:h-72 rounded-xl flex items-center justify-center overflow-hidden"
                                    style={{
                                        backgroundColor: (customStyles as Record<string, string>)[
                                            "--bg-color"
                                        ],
                                    }}
                                >
                                    <Image
                                        src={
                                            skill.image ||
                                            "/placeholder.svg?height=288&width=288&query=skill icon"
                                        }
                                        alt={skill.name || "Skill icon"}
                                        className="h-full w-full object-cover"
                                        width={288}
                                        height={288}
                                    />
                                </div>
                                <h2
                                    className="text-center font-bold text-2xl text-white"
                                    style={{
                                        color: (customStyles as Record<string, string>)[
                                            "--text-color"
                                        ],
                                    }}
                                >
                                    {skill.name || "Skill Name"}
                                </h2>
                            </div>
                        )
                    )
                ) : (
                    <p className="text-center text-gray-700 col-span-full md:col-span-2">
                        No skills available.
                    </p>
                )}
            </div>
            <div
                className="bg-purpleBg p-10 lg:p-20 flex flex-col gap-5"
                style={{
                    backgroundColor: (customStyles as Record<string, string>)[
                        "--bg-color"
                    ],
                }}
            >
                <h2
                    className="font-bold text-2xl lg:text-3xl text-white"
                    style={{
                        color: (customStyles as Record<string, string>)["--text-color"],
                    }}
                >
                    <span className="text-gold">Tools/</span> Software
                </h2>
                <p className="font-bold text-xl lg:text-2xl text-black">
                    {toolsSoftwareText}
                </p>
            </div>
        </section>
    );
};

export default TemplateOneAboutme;
