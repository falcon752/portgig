
"use client";
import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFourAboutMeProps {
  aboutMe: string;
    services: string[] | undefined;
  portfolioData: any; 
}

export function TemplateFourAboutMe({
  aboutMe,
  services,
  portfolioData,
}: TemplateFourAboutMeProps) {
  // Get customizations for this template
  const { customStyles, getHeadingStyle, getBodyStyle } =
    usePortfolioCustomizations(portfolioData);

  return (
    <section style={customStyles}>
      <div className="flex flex-col gap-5 mt-10 mb-5 px-5 lg:px-10">
        <h2
          style={getHeadingStyle({
            fontSize: "1.125rem",
          })}
          className="text-lg lg:text-4xl font-regular"
        >
          About me
        </h2>
        <div
          style={{
            backgroundColor: "var(--bg-color)",
            border: `1px solid var(--primary-color)20`,
            padding: "1.25rem",
          }}
        >
          <h2
            style={getBodyStyle({
              fontSize: "0.75rem",
              whiteSpace: "pre-wrap",
            })}
            className="lg:text-sm font-istokWeb"
          >
            {aboutMe ||
              `I'm a passionate Content Writer & Storyteller with a knack for
            crafting compelling, engaging, and results-driven content. I help
            brands and businesses communicate their message effectively, boost
            engagement, and drive conversions. Whether it's blog writing,
            website copy, social media content, or email marketing, I ensure
            that every word adds value and impact. I thrive on creating content
            that resonates with audiences and aligns with business goals. Let's
            work together to bring your brand's story to life!`}
          </h2>
        </div>
        <h2
          style={getHeadingStyle({
            fontSize: "1.125rem",
          })}
          className="lg:text-4xl font-regular"
        >
          My Services
        </h2>
      </div>
      <div style={{ backgroundColor: "var(--primary-color)" }} className="flex">
        <ul
          style={getBodyStyle({
            color: "var(--bg-color)", 
            fontSize: "0.75rem",
            fontWeight: "bold",
            padding: "0.5rem",
            paddingTop: "1.25rem",
            paddingBottom: "1.25rem",
          })}
          className="w-full md:text-sm lg:text-sm flex flex-col justify-center gap-3 lg:ml-20 font-istokWeb"
        >
          {services &&
          services.filter((s) => s.trim().length > 0).length > 0 ? (
            services
              .filter((s) => s.trim().length > 0)
              .map((service, index) => <li key={index}>{service}</li>)
          ) : (
            <li>No services listed.</li>
          )}
        </ul>
        <div className="w-full flex justify-end items-start">
          <Image
            src={"/assets/handwrite.svg"}
            alt="hand with pen"
            height={150}
            width={150}
            className="md:h-52 md:w-52 lg:h-72 lg:w-72"
          />
        </div>
      </div>
    </section>
  );
}

export default TemplateFourAboutMe;
