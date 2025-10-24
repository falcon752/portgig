import PortfolioFashionBrand from "@/src/components/portfolio5/FashionBrand";
import PortfolioFoodBrand from "@/src/components/portfolio5/FoodBrand";
import PortfolioGraphicsDesign from "@/src/components/portfolio5/GraphicsDesign";
import PortfolioHealthcareCaseStudy from "@/src/components/portfolio5/HealthcareCaseStudy";
import Portfolio from "@/src/components/portfolio5/Portfolio";
import Services from "@/src/components/portfolio5/Services";
import Skills from "@/src/components/portfolio5/Skills";
import StrategyContent from "@/src/components/portfolio5/StrategyContent";
import PortfolioTemplateFiveAboutme from "@/src/components/portfolio5/TemplateFiveAboutme";
import PortfolioTemplateHero from "@/src/components/portfolio5/TemplateHero";
import Tools from "@/src/components/portfolio5/Tools";
import VideoEditing from "@/src/components/portfolio5/VideoEditing";
import Image from "next/image";

export default function Template() {
  return (
    <div className="font-sans bg-black">
      <PortfolioTemplateHero />
      <PortfolioTemplateFiveAboutme />
      <StrategyContent />
      <Skills />
      <Services />
      <PortfolioHealthcareCaseStudy />
      <PortfolioFashionBrand />
      <PortfolioFoodBrand />
      <Portfolio />
      <PortfolioGraphicsDesign />
      <VideoEditing />
      <Tools />
      <footer className={`center px-10 py-20 bg-black`}>
        <Image
          src={"/assets/footer.svg"}
          height={200}
          width={1000}
          alt="made by portgig"
        />
      </footer>
    </div>
  );
}


