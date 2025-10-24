import React from "react";
import { Buttons } from "../export_components";

const PortfolioTemplateTwoPortfolio = () => {
    return (
        <>
            <section className="flex flex-col gap-8 md:gap-10 py-8 md:py-14 lg:py-20 px-4 md:px-8 lg:px-30">
                <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-center text-white">
                    My
                    <span className="text-gold"> Portfolio</span>
                </h2>
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5 md:gap-8 lg:gap-40">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-2 md:gap-3 lg:gap-5">
                            <div className="bg-gray100 flex flex-col gap-5 h-56 sm:h-64 md:h-72 lg:h-96 center rounded-sm">
                                <p className="text-black uppercase font-black text-xs sm:text-sm md:text-base lg:text-lg text-center px-4 sm:px-6 md:px-10">
                                    Paste youtube/Instagram link
                                </p>
                            </div>
                            <div className="bg-yellowGold center py-2 md:py-2.5 font-bold uppercase text-black text-xs sm:text-sm md:text-base rounded-sm">
                                Product shoot
                            </div>
                        </div>
                    ))}
                </div>
                <Buttons
                    label="View more"
                    className="rounded-none text-black font-bold w-fit px-10 sm:px-12 md:px-16 lg:px-20 py-2 md:py-2.5 mt-8 md:mt-12 lg:mt-20 self-center sm:self-start text-sm md:text-base"
                />
                <div className="flex flex-col mt-8 md:mt-12 lg:mt-20 gap-1 md:gap-2">
                    <h2 className="font-bold text-lg md:text-xl lg:text-2xl text-center text-white">
                        Jobs
                    </h2>
                    <h2 className="text-gold font-bold text-lg md:text-xl lg:text-2xl text-center uppercase px-4">
                        Open to all kinds of gigs
                    </h2>
                </div>
                <ul className="space-y-2 md:space-y-3 lg:space-y-5 text-sm md:text-base lg:text-xl font-bold text-white pl-0 md:pl-0 max-w-3xl mx-auto w-full">
                    <li className="pl-4 md:pl-0">Projects</li>
                    <li className="pl-4 md:pl-0">One off Gigs</li>
                    <li className="pl-4 md:pl-0">Freelancing</li>
                    <li className="pl-4 md:pl-0">Collaborations</li>
                </ul>
                <h2 className="text-gold font-bold text-base md:text-xl lg:text-2xl uppercase mt-8 md:mt-12 lg:mt-20 px-4 text-center md:text-left">
                    Why you should work with me
                </h2>
            </section>
            <section className="bg-brownLight center py-8 md:py-10 lg:py-12">
                <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 lg:px-30 text-white leading-relaxed max-w-5xl">
                    As a passionate and detail-oriented photographer, I bring creativity,
                    precision, and storytelling into every shot. Whether it&apos;s capturing
                    the essence of a brand, the emotions of an event, or the artistry of a
                    product, I ensure every image tells a compelling story. With expertise
                    in high-quality editing, lighting, and composition, I deliver visuals
                    that stand out. My commitment to professionalism, quick turnaround,
                    and client satisfaction makes me the ideal choice for your photography
                    needs. Let&apos;s create something amazing together!
                </p>
            </section>
            <section className="center py-6 md:py-8 lg:py-10">
                <p className="text-center font-bold text-sm md:text-base lg:text-xl px-4 sm:px-6 md:px-8 lg:px-30 text-white">
                    Looking forward to working with you
                </p>
            </section>
        </>
    );
};

export default PortfolioTemplateTwoPortfolio;