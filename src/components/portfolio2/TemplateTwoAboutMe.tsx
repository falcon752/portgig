import React from "react";

const PortfolioTemplateTwoAboutMe = () => {
  return (
    <section className="py-8 lg:py-20 px-5 md:px-10 flex flex-col gap-10">
      <div className="flex gap-5 md:gap-15">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white w-full aspect-square"></div>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="font-bold text-xl lg:text-3xl text-white">
          ABOUT
          <span className="text-yellowGold"> ME</span>
        </h2>
        {/* <div className="bg-white w-full h-18"></div> */}
      </div>
    </section>
  );
};

export default PortfolioTemplateTwoAboutMe;