
  import MadeByportgig from "@/src/components/MadeByportgig";
import PortfolioTemplateOneAboutme from "@/src/components/portfolio1/TemplateOneAboutme";
import PortfolioTemplateOneHero from "@/src/components/portfolio1/TemplateOneHero";
import PortfolioTemplateOnePortfolio from "@/src/components/portfolio1/TemplateOnePortfolio";
import React from "react";
  
  const page = () => {
    return (
      <main className="font-montserrat bodyMargin bg-purpleBg">
        <PortfolioTemplateOneHero />
        <PortfolioTemplateOneAboutme />
        <div className="bg-white h-15"></div>
        <PortfolioTemplateOnePortfolio />
        <MadeByportgig className="bg-purpleBg" />
      </main>
    );
  }; 
  
  export default page;