"use client";
import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO, getDeveloperServices, isDeveloperTemplateSpecific } from "@/types/portfolio";

interface TemplateThreeAboutMeProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreeAboutMe = ({ portfolioData }: TemplateThreeAboutMeProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle, getBodyStyle, getAccentStyle } = usePortfolioCustomizations(portfolio);
  const colors = portfolio.fonts?.colors || { background: "#000", accent: "#0A1754", text: "#FFF", primary: "#6B46C1" };
  const headingStyle = getHeadingStyle();
  const bodyStyle = getBodyStyle();
  const accentStyle = getAccentStyle();

  const aboutMe = portfolio.about_me || "No description provided.";
  const developerServices = getDeveloperServices(portfolio.template_specific);
  const developerSkills = isDeveloperTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.developer.skills || []
    : [];

  return (
    <section
      className="py-20 px-5 lg:px-10 flex flex-col gap-5"
      style={{
        backgroundColor: colors.background,
        fontFamily: portfolio.fonts?.body_font,
      }}
    >
      <h2 className="text-lg lg:text-2xl font-bold" style={headingStyle}>
        About <span style={accentStyle}>Me</span>
      </h2>
      <div
        className="py-2 px-5 text-xs md:text-sm lg:text-2xl font-normal"
        style={{
          backgroundColor: colors.primary,
          color: colors.accent,
          fontFamily: portfolio.fonts?.body_font,
        }}
      >
        <p>{aboutMe}</p>
      </div>

      <h2 className="text-lg lg:text-2xl font-bold" style={headingStyle}>
        Service I <span style={accentStyle}>Offer</span>
      </h2>
      {developerServices.length > 0 ? (
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {developerServices.map((service, index) => (
            <div
              key={index}
              className="w-full flex flex-col items-center px-10 py-10 gap-3"
              style={{
                backgroundColor: colors.primary,
                color: colors.accent,
              }}
            >
              <Image src="/assets/square-logo.svg" alt="square logo" width={30} height={30} />
              <h2 className="font-bold" style={{ ...headingStyle, color: colors.accent }}>{service.name}</h2>
              <p className="text-center font-bold text-xs" style={{ ...bodyStyle, color: colors.accent }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center" style={bodyStyle}>No services to display.</p>
      )}

      <h2 className="text-lg lg:text-2xl font-bold" style={headingStyle}>
        Skills/ <span style={accentStyle}>Languages</span>
      </h2>
      {developerSkills.length > 0 ? (
        <div className="flex">
          <div className="px-5 py-5 space-y-3">
            {developerSkills.map((_, index) => (
              <div key={index} className="gap-3">
                <Image src="/assets/arrow.svg" alt="arrow icon" width={30} height={30} />
              </div>
            ))}
          </div>
          <div
            className="w-full px-5 py-5 space-y-3 font-bold text-xl lg:w-150"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
              fontFamily: portfolio.fonts?.body_font,
            }}
          >
            {developerSkills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <span className="w-full">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center" style={bodyStyle}>No skills to display.</p>
      )}
    </section>
  );
};

export default TemplateThreeAboutMe;