import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization"
import Image from "next/image"

interface TemplateFiveHeroProps {
  displayName: string
  jobTitles: string[]
  location: string
  headShot: string
  portfolioData?: any
}

export default function TemplateHero({ 
  displayName, 
  jobTitles, 
  location, 
  headShot, 
  portfolioData 
}: TemplateFiveHeroProps) {
  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);
  
  const formattedJobTitles =
    jobTitles.length > 0 ? jobTitles.join(" | ") : "Strategic Social Media Manager | Driving Engagement & Growth"

  return (
    <div 
      className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 px-6 py-10"
      style={{ ...customStyles, backgroundColor: `var(--primary-color)` }}
    >
      <div className="text-center lg:text-left">
        <h1 
          className="text-3xl md:text-4xl font-bold"
          style={getHeadingStyle({ color: 'white' })}
        >
          {displayName}
        </h1>
        <p 
          className="mt-2 text-base md:text-lg font-bold"
          style={getBodyStyle({ color: 'white' })}
        >
          {formattedJobTitles}
        </p>
        <p 
          className="text-sm mt-1 font-bold"
          style={getBodyStyle({ color: 'white' })}
        >
          {location}
        </p>
      </div>
      <div className="relative w-[320px] h-[340px] md:w-[400px] md:h-[430px] lg:w-[513px] lg:h-[518px] rounded-md overflow-hidden">
        {headShot ? (
          <Image
            src={headShot || "/placeholder.svg"}
            alt={`${displayName}'s headshot`}
            fill
            className="object-cover rounded-md"
          />
        ) : (
          <Image
            src="/placeholder.svg?height=518&width=513"
            alt="Placeholder headshot"
            fill
            className="object-cover rounded-md"
          />
        )}
      </div>
    </div>
  )
}