"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import { ApiPortfolioData, EMPTY_PORTFOLIO, isDeveloperTemplateSpecific } from "@/types/portfolio";

interface TemplateThreeAvailabilityProps {
    portfolioData: ApiPortfolioData | null;
}

const TemplateThreeAvailability = ({ portfolioData }: TemplateThreeAvailabilityProps) => {
    const portfolio = portfolioData || EMPTY_PORTFOLIO;
    const { getHeadingStyle, getBodyStyle, getAccentStyle } = usePortfolioCustomizations(portfolio);
    const colors = portfolio.fonts?.colors || { background: "#000", accent: "#0A1754", text: "#FFF" };
    const headingStyle = getHeadingStyle();
    const bodyStyle = getBodyStyle();
    const accentStyle = getAccentStyle();

    const availability = isDeveloperTemplateSpecific(portfolio.template_specific)
        ? portfolio.template_specific.developer.availability || 'I am always available.'
        : 'I am always available.'
    const whyWorkWithMe = portfolio.what_you_get_working_with_me ||
        "I bring a unique blend of technical expertise and creative problem-solving to every project. My commitment to delivering high-quality, scalable, and user-centric solutions ensures your vision comes to life efficiently and effectively. I prioritize clear communication, timely delivery, and a collaborative approach to achieve outstanding results.";

    return (
        <section
            className="space-y-5"
            style={{
                backgroundColor: colors.background,
                fontFamily: portfolio.fonts?.body_font,
            }}
        >
            <div className="px-5 lg:px-10 flex flex-col">
                <h2 className="text-lg lg:text-2xl font-bold" style={headingStyle}>Availability</h2>
            </div>
            <div className="w-full h-5" style={{ backgroundColor: colors.accent }}></div>
            <div className="px-10 py-10 mb-30">
                <p className="font-bold md:text-xl lg:text-2xl" style={bodyStyle}>
                    {availability}
                </p>
            </div>

            <div className="px-5 lg:px-10 flex flex-col">
                <h2 className="text-lg lg:text-2xl font-bold" style={headingStyle}>
                    What you get working <span style={accentStyle}>with me</span>
                </h2>
            </div>
            <div className="w-full h-5" style={{ backgroundColor: colors.accent }}></div>
            <div className="px-10 py-10 mb-30">
                <p className="font-bold md:text-xl lg:text-2xl" style={bodyStyle}>
                    {whyWorkWithMe}
                </p>
            </div>
            <div className="w-full h-5" style={{ backgroundColor: colors.accent }}></div>
        </section>
    );
};

export default TemplateThreeAvailability;