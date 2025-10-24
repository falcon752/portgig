import React from "react";

const PortfolioTemplateTwoEvent = () => {
  return (
    <section className="bg-brownLight py-10">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-x-10 gap-5 justify-between w-full md:w-10/12 lg:ml-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2 text-white">
            <h2 className="pl-5 font-bold text-[14px] lg:text-2xl text-white">Event Videography</h2>
            <hr className="w-62 h-0.5" />
            <h2 className="pl-5 font-bold text-yellowGold text-xs lg:text-sm">
              Weddings, Corporate, Concerts
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioTemplateTwoEvent;