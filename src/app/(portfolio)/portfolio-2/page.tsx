import { MadeByportgig } from "@/src/components/export_components";
import PortfolioTemplateTwoAboutMe from "@/src/components/portfolio2/TemplateTwoAboutMe";
import PortfolioTemplateTwoEvent from "@/src/components/portfolio2/TemplateTwoEvent";
import PortfolioTemplateTwoHero from "@/src/components/portfolio2/TemplateTwoHero";
import PortfolioTemplateTwoPortfolio from "@/src/components/portfolio2/TemplateTwoPortfolio";
import PortfolioTemplateTwoService from "@/src/components/portfolio2/TemplateTwoService";
import React from "react";

export default function page() {
  return (
    <main className="bg-semiBlack bodyMargin font-montserrat">
      <PortfolioTemplateTwoHero />
      <PortfolioTemplateTwoAboutMe />
      <PortfolioTemplateTwoEvent />
      <PortfolioTemplateTwoService />
      <PortfolioTemplateTwoPortfolio />
      <MadeByportgig className="bg-semiBlack " />
    </main>
  );
}
