"use client";
import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import {
  ApiPortfolioData,
  EMPTY_PORTFOLIO,
  getDeveloperServices,
  isDeveloperTemplateSpecific,
} from "@/types/portfolio";

interface TemplateThreeAboutMeProps {
  portfolioData: ApiPortfolioData | null;
}

const TemplateThreeAboutMe = ({ portfolioData }: TemplateThreeAboutMeProps) => {
  const portfolio = portfolioData || EMPTY_PORTFOLIO;
  const { getHeadingStyle } = usePortfolioCustomizations(portfolio);

  const aboutMe =
    portfolio.about_me ||
    "I’m a passionate Web Developer & UI/UX Designer dedicated to building visually stunning and high-performing websites and applications.";

  const services = getDeveloperServices(portfolio.template_specific);

  const skills = isDeveloperTemplateSpecific(portfolio.template_specific)
    ? portfolio.template_specific.developer.skills || []
    : [];

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-12 flex flex-col gap-10">
      {/* ABOUT ME */}
      <div>
        <h2
          className="text-xl lg:text-2xl font-bold mb-4 text-white"
          style={getHeadingStyle()}
        >
          About Me
        </h2>

        <div className="border border-cyan-400 rounded-xl px-6 py-6 lg:px-10 lg:py-8 text-sm lg:text-lg text-center text-white leading-relaxed bg-[#0d0d0d]">
          {aboutMe}
        </div>
      </div>

      {/* SERVICES */}
      <div>
        <h2
          className="text-xl lg:text-2xl font-bold mb-6 text-white"
          style={getHeadingStyle()}
        >
          Services I <span className="text-cyan-400">Offer</span>
        </h2>

        {services.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-cyan-400 rounded-xl bg-[#0d0d0d] px-8 py-10 flex flex-col items-center gap-4 text-center text-white"
              >
                <Image
                  src="/assets/square-logo.svg"
                  alt="service icon"
                  width={40}
                  height={40}
                />

                <h3 className="font-bold text-lg" style={getHeadingStyle()}>
                  {service.name}
                </h3>

                <p className="text-xs lg:text-sm text-gray-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">No services to display.</p>
        )}
      </div>

      {/* SKILLS */}
      <div>
        <h2
          className="text-xl lg:text-2xl font-bold mb-6 text-white"
          style={getHeadingStyle()}
        >
          Skills / <span className="text-cyan-400">Language</span>
        </h2>

        {skills.length > 0 ? (
          <div className="flex flex-col gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="border border-cyan-400 rounded-md px-6 py-3 text-white bg-[#0d0d0d]"
              >
                {skill}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">No skills to display.</p>
        )}
      </div>
      </div>
    </section>
  );
};

export default TemplateThreeAboutMe;
