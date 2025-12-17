import { MadeByportgig } from "@/src/components/export_components";
import PortfolioTemplateThreeAboutMe from "@/src/components/portfolio3/TemplateThreeAboutMe";
import PortfolioTemplateThreeAvailabilty from "@/src/components/portfolio3/TemplateThreeAvailabilty";
import PortfolioTemplateThreeHero from "@/src/components/portfolio3/TemplateThreeHero";
import PortfolioTemplateThreePortfolio from "@/src/components/portfolio3/TemplateThreePortfolio";
import React from "react";

const page = () => {
  return (
    <main className="bg-semiBlack font-montserrat">
      <PortfolioTemplateThreeHero />
      <PortfolioTemplateThreeAboutMe />
      <PortfolioTemplateThreePortfolio />
      <PortfolioTemplateThreeAvailabilty />
      <MadeByportgig className="bg-black" />
    </main>
  );
};

export default page;
