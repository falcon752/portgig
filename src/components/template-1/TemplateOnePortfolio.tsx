"use client"
import Image from "next/image"
import Buttons from "../Buttons" 
import type { TemplateOnePortfolioProps } from "@/types/template-one"
import { EMPTY_PORTFOLIO, type DesignerTemplateSpecific } from "@/types/portfolio"
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization"

const TemplateOnePortfolio = ({ portfolio }: TemplateOnePortfolioProps) => {
  const portfolioData = portfolio || EMPTY_PORTFOLIO
  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData)

  const designerSpecific =
    portfolioData.template_type === "DESIGNER" && portfolioData.template_specific
      ? (portfolioData.template_specific as DesignerTemplateSpecific).designer
      : undefined

  const hasValidDesignerData = !!designerSpecific && typeof designerSpecific.behance === "string"

  const pinterestBehanceLink = hasValidDesignerData ? designerSpecific.behance : portfolioData.social?.behance

  const otherServices = portfolioData.other_services || []

  const whyWorkWithMeText =
    portfolioData.what_you_get_working_with_me ||
    "Available for all kind of gigs, projects, jobs, collaboration, kindly reach out to me. Looking forward to working with you."

  const moreOnBehancePinterestText = hasValidDesignerData ? "Click here" : "Add a Behance link"

  return (
    <div style={customStyles}>
      <section className="bodyMargin bg-purpleBg flex flex-col gap-10 p-5 lg:p-15">
        <h2
          style={getHeadingStyle({
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--bg-color, white)",
          })}
          className="lg:text-3xl font-bold text-white"
        >
          My
          <span style={{ color: "var(--accent-color, #d4af37)" }} className="text-gold">
            {" "}
            Portfolio
          </span>
        </h2>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-40">
          {(portfolioData.files || []).map((item, index) => (
            <div
              key={index}
              style={{ backgroundColor: "var(--bg-color, white)" }}
              className="bg-white flex flex-col gap-5 h-120"
            >
              <div className="relative h-full w-full">
                <Image
                  src={item.image || "/placeholder.svg?height=480&width=640&query=portfolio item"}
                  alt={item.title || "Portfolio item"}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}

          {(!portfolioData.files || portfolioData.files.length === 0) &&
            Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  style={{ backgroundColor: "var(--bg-color, white)" }}
                  className="bg-white flex flex-col gap-5 h-120"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src="/placeholder.svg?height=480&width=640"
                      alt="Placeholder Portfolio item"
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              ))}
        </div>

        <h2
          style={getHeadingStyle({
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "var(--bg-color, white)",
          })}
          className="lg:text-3xl font-bold text-white"
        >
          More on
          <span className="text-gold"> Behance/ </span>
          Pinterest
        </h2>

        <Buttons
          label={moreOnBehancePinterestText}
          className="text-primary bg-white lg:text-2xl w-fit rounded-xl font-bold px-20"
          href={pinterestBehanceLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!pinterestBehanceLink}
        />
      </section>

      <section
        style={{
          padding: "2.5rem",
          backgroundColor: "var(--bg-color, white)",
          textAlign: "center",
        }}
        className="p-10 bg-white text-center"
      >
        <div className="flex flex-row justify-between gap-5">
          <h2
            style={getHeadingStyle({
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--primary-color, #6B46C1)",
              textAlign: "start",
            })}
            className="lg:text-3xl font-bold text-start text-purpleBg"
          >
            Other
            <span className="text-gold"> Services/ </span>
            Skills
          </h2>
          <div className="flex flex-col">
            {otherServices.length > 0 ? (
              otherServices.map((service, index) => (
                <h2 key={index} className="lg:text-2xl font-bold text-purpleBg">
                  {service}
                </h2>
              ))
            ) : (
              <h2 key="no-services" className="lg:text-2xl font-bold text-gray-500">
                No other services listed.
              </h2>
            )}
          </div>
        </div>
      </section>

      <div
        style={{
          height: "5rem",
          padding: "2.5rem",
        }}
        className="h-20 flex items-center p-10"
      >
        <h2 className="lg:text-xl font-bold text-primary">
          What you get working
          <span className="text-gold"> with me </span>
        </h2>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-color, white)",
          padding: "2.5rem 5rem",
          textAlign: "center",
        }}
        className="bg-white flex items-center px-20 py-10 text-center"
      >
        <h2
          style={getBodyStyle({
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "var(--primary-color, #6B46C1)",
          })}
          className="lg:text-2xl font-bold text-primary"
        >
          {whyWorkWithMeText}
        </h2>
      </div>
    </div>
  )
}

export default TemplateOnePortfolio
