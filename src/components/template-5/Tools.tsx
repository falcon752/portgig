import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveToolsProps {
  toolsIUse: string[]
  whyWorkWithMe: string
  portfolioData?: any
}

export default function Tools({ toolsIUse, whyWorkWithMe, portfolioData }: TemplateFiveToolsProps) {
  const { customStyles, getHeadingStyle, getBodyStyle, colorUtils } = usePortfolioCustomizations(portfolioData);
  
  return (
    <div 
      className="px-4 py-10"
      style={{ ...customStyles, backgroundColor: (customStyles as Record<string, string>)['--bg-color'] }}
    >
      {/* Tools I Use */}
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-xl sm:text-2xl lg:text-3xl font-bold mb-8"
          style={getHeadingStyle()}
        >
          Tools I use
        </h2>
        {toolsIUse && toolsIUse.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {toolsIUse.map((tool, index) => (
              <div
                key={index}
                className="text-xl lg:text-3xl font-bold py-6 px-3 rounded text-center shadow-md transition-transform hover:scale-105"
                style={{
                  backgroundColor: (customStyles as Record<string, string>)['--accent-color'],
                  color: (customStyles as Record<string, string>)['--bg-color'],
                  fontFamily: (customStyles as Record<string, string>)['--body-font']
                }}
              >
                {tool}
              </div>
            ))}
          </div>
        ) : (
          <p 
            className="text-center text-lg"
            style={getBodyStyle({ opacity: 0.7 })}
          >
            No tools listed.
          </p>
        )}
      </div>

      <h3 
        className="max-w-5xl mx-auto text-lg sm:text-xl md:text-4xl font-bold mb-4 mt-16"
        style={getHeadingStyle()}
      >
        Why you should work with me
      </h3>
      {/* Why Work With Me */}
      <div 
        className="px-10 py-10 rounded-lg text-center max-w-5xl mx-auto"
        style={{ 
          backgroundColor: colorUtils.darken((customStyles as Record<string, string>)['--bg-color'] || '#2B2B2B', 0.2)
        }}
      >
        <p 
          className="text-sm lg:text-xl font-normal leading-relaxed"
          style={getBodyStyle()}
        >
          {whyWorkWithMe ||
            "As a passionate and detail-oriented professional, I bring creativity, precision, and storytelling into every project. My commitment to professionalism, quick turnaround, and client satisfaction makes me the ideal choice for your needs. Let's create something amazing together!"}
        </p>
      </div>
    </div>
  )
}