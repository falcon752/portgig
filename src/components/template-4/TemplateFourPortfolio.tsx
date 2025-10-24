"use client";
import Image from "next/image";
import Link from "next/link";
import { Buttons } from "../export_components";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface PortfolioItem {
  image: string;
  title: string;
  link: string;
}

interface TemplateFourPortfolioProps {
  portfolioItems: PortfolioItem[];
  caseStudyContent: string;
  linkedinLink?: string;
  mediumLink?: string;
  portfolioData: any;
  whyWorkWithMe?: string;
  services?: string[];
}

export function TemplateFourPortfolio({
  portfolioItems,
  caseStudyContent,
  linkedinLink,
  mediumLink,
  portfolioData,
  whyWorkWithMe,
}: TemplateFourPortfolioProps) {
  const {
    customStyles,
    getHeadingStyle,
    getBodyStyle,
    getButtonStyle,
    getAccentStyle,
  } = usePortfolioCustomizations(portfolioData);

  const filteredPortfolioItems =
    portfolioItems?.filter((f) => f.image || f.title || f.link) || [];
  const hasCaseStudy = caseStudyContent && caseStudyContent.trim().length > 0;

  return (
    <section style={customStyles} className="mt-5">
      {filteredPortfolioItems.length > 0 && (
        <div className="flex flex-col gap-5 my-10">
          <h2
            style={getHeadingStyle({ textAlign: "center", fontWeight: "bold" })}
          >
            My Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:mt-10">
            {filteredPortfolioItems.map((item, index) => (
              <div
                key={index}
                className="space-y-2 sm:space-y-3 center-flexCol font-istokWeb"
              >
                {item.image && (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title || "portfolio"}
                    height={120}
                    width={120}
                    className="sm:w-[200px] sm:h-[200px] object-cover rounded-lg"
                  />
                )}
                {item.title && (
                  <h2
                    style={getHeadingStyle({
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    })}
                    className="sm:text-base"
                  >
                    {item.title}
                  </h2>
                )}
                {item.link && (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Buttons
                      label="Click here"
                      className="rounded-lg text-[10px] sm:text-xs px-2 sm:px-15 py-1 sm:py-2"
                      style={getButtonStyle({ fontWeight: "bold" })}
                    />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasCaseStudy && (
        <div className="py-10 space-y-5">
          <h2
            style={getHeadingStyle({
              fontSize: "0.875rem",
              fontWeight: "bold",
            })}
            className="lg:text-2xl"
          >
            Case Study
          </h2>
          <div
            style={{
              backgroundColor: "var(--bg-color)",
              border: `1px solid var(--primary-color)20`,
              padding: "1.25rem",
            }}
          >
            <p
              style={getBodyStyle({
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
              })}
              className="lg:text-lg font-istokWeb"
            >
              {caseStudyContent}
            </p>
          </div>
        </div>
      )}

      {(linkedinLink || mediumLink) && (
        <div className="pb-10 space-y-5">
          <p
            style={getHeadingStyle({
              fontSize: "0.875rem",
              fontWeight: "bold",
            })}
            className="lg:text-2xl"
          >
            Social & Writing Platform Links
          </p>
          <div
            style={{ backgroundColor: "var(--primary-color)" }}
            className="px-5 pt-10 pb-5 flex justify-between font-istokWeb"
          >
            {linkedinLink && (
              <div className="center-flexCol gap-3">
                <p
                  style={getAccentStyle({
                    fontWeight: "bold",
                    fontSize: "1rem",
                  })}
                  className="lg:text-xl"
                >
                  LinkedIn
                </p>
                <Link
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Buttons
                    label="Click here"
                    className="rounded-lg text-xs px-10"
                    style={getButtonStyle({
                      backgroundColor: "var(--bg-color)",
                      color: "var(--primary-color)",
                      fontWeight: "bold",
                    })}
                  />
                </Link>
              </div>
            )}
            {mediumLink && (
              <div className="center-flexCol gap-3">
                <p
                  style={getAccentStyle({
                    fontWeight: "bold",
                    fontSize: "1rem",
                  })}
                  className="lg:text-xl"
                >
                  Medium
                </p>
                <Link
                  href={mediumLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Buttons
                    label="Click here"
                    className="rounded-lg text-xs px-10"
                    style={getButtonStyle({
                      backgroundColor: "var(--bg-color)",
                      color: "var(--primary-color)",
                      fontWeight: "bold",
                    })}
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="py-5 space-y-5">
        {whyWorkWithMe && (
          <div className="flex flex-col gap-5">
            <p
              style={getHeadingStyle({
                fontSize: "0.875rem",
                fontWeight: "bold",
                marginLeft: "1.25rem",
              })}
              className="lg:text-2xl"
            >
              What you get working with me
            </p>
            <div
              style={{
                backgroundColor: "var(--primary-color)",
                padding: "1.25rem 2.5rem",
              }}
              className="space-y-1 text-sm lg:text-lg font-istokWeb"
            >
              <p style={getBodyStyle({ color: "var(--bg-color)" })}>
                {whyWorkWithMe}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TemplateFourPortfolio;