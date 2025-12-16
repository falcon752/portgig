import React from "react";

const PortfolioTemplateTwoEvent = () => {
  return (
    <section className="bg-black mt-12 md:mt-16 lg:mt-20 py-30 px-5 md:px-10">
      <div className="flex flex-col gap-6 w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border border-yellowGold rounded-md p-5 bg-gradient-to-r from-[#0e0e0e] to-[#1a1a1a]"
          >
            <div className="inline-block relative">
              <h2 className="font-bold text-lg md:text-2xl text-white uppercase">
                Event Videography
              </h2>
              <span className="absolute -bottom-1 left-[-2px] right-[-2px] h-0.5 bg-gray-400"></span>
            </div>

            <p className="mt-3 font-bold text-yellowGold text-sm md:text-base">
              Weddings, Corporate, Concerts
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};




export default PortfolioTemplateTwoEvent;
