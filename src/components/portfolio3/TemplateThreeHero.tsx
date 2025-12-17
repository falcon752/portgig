import React from "react";
import Image from "next/image";

const PortfolioTemplateThreeHero = () => {
  return (
    <section className="w-full bg-black text-white px-6 sm:px-10 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            GEORGY JITTI
          </h1>

          <p className="font-bold mt-3 text-sm sm:text-base text-white">
            Web Developer/ Designer, Lagos State
          </p>

          <button className="mt-6 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-3 rounded-md transition">
            Let&apos;s build quality products in programming and design with my services
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="bg-[#2f4656] rounded-xl p-6">
            <Image
              src="/assets/jitti.svg"
              alt="Georgy Jitti"
              width={300}
              height={380}
              className="object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default PortfolioTemplateThreeHero;
