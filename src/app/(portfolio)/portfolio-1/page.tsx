import MadeByportgig from "@/src/components/MadeByportgig";
import PortfolioTemplateOneAboutme from "@/src/components/portfolio1/TemplateOneAboutme";
import PortfolioTemplateOneHero from "@/src/components/portfolio1/TemplateOneHero";
import PortfolioTemplateOnePortfolio from "@/src/components/portfolio1/TemplateOnePortfolio";
import React from "react";

const page = () => {
  return (
    <main className="font-montserrat bg-black">
      {/* Full-width hero */}
      <div className="w-full">
        <PortfolioTemplateOneHero />
      </div>

      {/* Rest of page inside bodyMargin */}
      <div>
        <PortfolioTemplateOneAboutme />
        {/* <div className="bg-white h-15"></div> */}
        <PortfolioTemplateOnePortfolio />
      </div>

      <MadeByportgig className="bg-black" />
    </main>
  );
};

export default page;
