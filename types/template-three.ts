import type { ApiPortfolioData } from "@/types/portfolio";

export interface TemplateThreeHeroProps {
  portfolioData: ApiPortfolioData | null;
}

export interface TemplateThreeAboutMeProps {
  portfolioData: ApiPortfolioData | null;
  developerSkills?: string[]; 
}

export interface TemplateThreePortfolioProps {
  portfolioData: ApiPortfolioData | null;
  developerServices?: Array<{ name: string; description: string }>; 
}

export interface TemplateThreeAvailabiltyProps {
  portfolioData: ApiPortfolioData | null;
}