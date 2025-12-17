import React from "react";

const PortfolioTemplateThreePortfolio = () => {
  return (
    <section className="px-5 lg:px-12 py-20 bg-black">
      
      {/* SECTION TITLE – LEFT ALIGNED */}
      <h2 className="text-xl lg:text-2xl font-bold text-white mb-10">
        My <span className="text-cyan-400">Portfolio</span>
      </h2>

      {/* PORTFOLIO LIST – FULL WIDTH */}
      <div className="flex flex-col gap-14">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4 w-full">
            
            {/* PREVIEW BOX – STRETCHED */}
            <div className="w-full h-56 lg:h-72 bg-white rounded-xl" />

            {/* TITLE */}
            <h3 className="text-white font-bold text-lg lg:text-xl">
              Ecommerce Website
            </h3>

            {/* BUTTON */}
            <button className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-md transition">
              Visit Site
            </button>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PortfolioTemplateThreePortfolio;
