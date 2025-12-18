import React from "react";
import Image from "next/image";
import PortfolioTemplateFourHero from "@/src/components/portfolio4/TemplateFourHero";
import PortfolioTemplateFourAboutMe from "@/src/components/portfolio4/TemplateFourAboutMe";
import PortfolioTemplateFourPortfolio from "@/src/components/portfolio4/TemplateFourPortfolio";
const page = () => {
  return (
    <main className="font-montserrat">
      <PortfolioTemplateFourHero />
      <PortfolioTemplateFourAboutMe />
      <PortfolioTemplateFourPortfolio />
      <footer className={`center px-10 py-20 bg-white`}>
        <Image
          src={"/assets/madeByPortgig2.svg"}
          height={200}
          width={1000}
          alt="made by portgig"
        />
      </footer>
    </main>
  );
};

export default page;
