import React from "react";
import Image from "next/image";

const PortfolioTemplateThreeHero = () => {
    return (
        <section className="flex flex-col lg:flex-row lg:min-h-[600px]">
            <div className="w-full lg:w-1/3 bg-yellow flex justify-center lg:justify-start items-end p-4 lg:p-0 order-1">
                <Image
                    src={"/assets/jitti.svg"}
                    alt="developer's image"
                    width={300}
                    height={300}
                    className="object-contain w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80"
                />
            </div>
            <div className="w-full lg:w-2/3 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 md:py-12 lg:pt-16 xl:pt-20 2xl:pt-24 flex justify-start lg:justify-end items-center lg:items-end text-white order-2">
                <div className="flex flex-col justify-end items-start lg:items-end w-full max-w-3xl">
                    <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg pb-2">
                        Lagos State
                    </p>
                    <div className="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[490px] h-px bg-[#FFBA00] mb-2 sm:mb-3"></div>

                    <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-left lg:text-right leading-tight">
                        GEORGY JITTI
                    </h2>

                    <h2 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-left lg:text-right mt-1 sm:mt-2">
                        Web Developer/ Designer
                    </h2>

                    <p className="font-normal text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-left lg:text-right mt-4 sm:mt-5 md:mt-6 lg:mt-8 xl:mt-10 font-lalezar max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                        Let&apos;s build quality products in programming and design with my
                        services
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PortfolioTemplateThreeHero;