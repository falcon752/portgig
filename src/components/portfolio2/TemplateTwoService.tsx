import React from "react";
import { services1 } from "../../constants/index";

const PortfolioTemplateTwoService = () => {
    return (
        <section>
            <div className="h-16 md:h-20 flex items-center px-4 md:px-8 lg:pl-10">
                <h2 className="font-bold text-lg md:text-xl lg:text-3xl text-white">
                    MY
                    <span className="text-yellowGold"> SERVICES</span>
                </h2>
            </div>
            <div className="bg-yellowGold px-4 py-8 md:px-8 md:py-10 lg:pl-10 flex flex-col gap-4 md:gap-5 text-white">
                <h2 className="font-bold text-base md:text-2xl">Videography Skills:</h2>
                <ol className="space-y-3 md:space-y-4 lg:space-y-5 list-disc list-inside pl-2">
                    {services1.map((service, index) => (
                        <li key={index} className="font-bold text-sm md:text-base lg:text-xl uppercase">
                            {service}
                        </li>
                    ))}
                </ol>
            </div>
            <div className="bg-brownLight px-4 py-8 md:px-8 md:py-10 lg:pl-10 flex flex-col gap-4 md:gap-5 text-white">
                <h2 className="font-bold text-base md:text-2xl">Videography Skills:</h2>
                <ol className="space-y-3 md:space-y-4 lg:space-y-5 list-disc list-inside pl-2">
                    {services1.map((service, index) => (
                        <li key={index} className="font-bold text-sm md:text-base lg:text-xl uppercase text-white">
                            {service}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default PortfolioTemplateTwoService;