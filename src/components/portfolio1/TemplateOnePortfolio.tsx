import React from "react";
import Buttons from "../Buttons";
import { services } from "@/src/constants";

export default function PortfolioTemplateOnePortfolio() {
    return (
        <>
            <section className="bodyMargin bg-purpleBg flex flex-col gap-8 sm:gap-10 p-4 sm:p-6 md:p-8 lg:p-15">
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl text-white">
                    My <span className="text-gold">Portfolio</span>
                </h2>

                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-16 lg:gap-40">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white flex flex-col gap-4 sm:gap-5 h-60 sm:h-72 md:h-80 lg:h-120 rounded-lg"
                        ></div>
                    ))}
                </div>

                <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white">
                    More on <span className="text-gold">Behance/</span> Pinterest
                </h2>

                <Buttons
                    label="Click here"
                    className="text-primary text-base sm:text-lg lg:text-2xl w-fit rounded-xl font-bold px-10 sm:px-14 md:px-16 lg:px-20"
                />
            </section>

            <section className="p-6 sm:p-8 md:p-10 bg-white text-center">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-10 md:gap-16">
                    <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-start text-purpleBg">
                        Other <span className="text-gold">Services/</span> Skills
                    </h2>

                    <div className="flex flex-col gap-3 sm:gap-4">
                        {services.map((service, index) => (
                            <h2
                                key={index}
                                className="font-bold text-sm sm:text-base md:text-lg lg:text-2xl text-purpleBg"
                            >
                                {service}
                            </h2>
                        ))}
                    </div>
                </div>
            </section>

            <div className="h-auto bg-purpleBg flex items-center p-6 sm:p-8 md:p-10">
                <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white">
                    What you get working <span className="text-gold">with me</span>
                </h2>
            </div>

            <div className="bg-white flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-6 sm:py-8 md:py-10 text-center">
                <h2 className="font-bold text-primary text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl">
                    Available for all kinds of gigs, projects, jobs, and collaborations.
                    Kindly reach out to me — looking forward to working with you.
                </h2>
            </div>
        </>
    );
}
