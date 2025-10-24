import React from "react";
import Image from "next/image";

const PortfolioTemplateTwoHero = () => {
  return (
    <section className="bg-lightBrown flex flex-col-reverse md:flex-row gap-5 pt-15 md:pt-40">
      {/* Text Section */}
      <div className="w-full pl-5 md:pl-10 flex flex-col font-bold pb-10 z-20">
        <h2 className="text-yellowGold text-lg md:text-3xl lg:text-4xl">
          Hi, I&apos;m
        </h2>
        <h2 className="text-2xl md:text-5xl lg:text-7xl font-black text-white">
          DENNIS AKPA
        </h2>
        <h2 className="md:text-2xl text-white">Videographer/Editor</h2>
        <p className="text-xs text-white">Lagos State</p>
        {/* <div className="bg-white h-16 mt-5"></div> */}
      </div>

      {/* Image Section */}
      <div className="w-full relative h-64 md:h-auto flex justify-center md:block mb-10 md:mb-0">
        {/* Background Overlays */}
        <Image
          src={"/assets/Ellipse1.svg"}
          alt="Ellipse"
          width={100}
          height={100}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 z-10"
        />

        <Image
          src={"/assets/circletemplate.png"}
          alt="circle"
          width={600}
          height={600}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:right-3 md:translate-x-0 z-20 h-64 w-64 md:h-88 md:w-88 lg:h-112 lg:w-md"
        />

        {/* Main User Image on top - Centered and bigger on mobile only */}
        <Image
          src={"/assets/template2.png"}
          alt="Videographer"
          width={170}
          height={170}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:right-7 md:translate-x-0 z-30 h-56 w-56 md:h-72 md:w-72 lg:h-96 lg:w-96"
        />
      </div>
    </section>
  );
};

export default PortfolioTemplateTwoHero;