import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization"
import Image from "next/image"

interface TemplateTwoHeroProps {
  displayName: string
  jobTitles: string[]
  location: string
  headShot: string
  portfolioData: any
}

const TemplateTwoHero = ({ displayName, jobTitles, location, headShot, portfolioData }: TemplateTwoHeroProps) => {
  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);
  // Join job titles with a slash, or display a default if empty
  const formattedJobTitles = jobTitles.length > 0 ? jobTitles.join("/") : "Creative Professional"

  return (
    <section className="bg-lightBrown flex gap-5 pt-15 md:pt-40" style={{backgroundColor: (customStyles as Record<string, string>)['--bg-color']}}>
      <div className="w-full pl-5 md:pl-10 flex flex-col font-bold pb-10">
        <h2 className="text-yellowGold text-lg md:text-3xl lg:text-4xl" style={getHeadingStyle()}>Hi, I&apos;m </h2>
        <h2 className="text-2xl md:text-5xl lg:text-7xl font-black text-white" style={getHeadingStyle()}>{displayName}</h2>
        <h2 className="md:text-2xl text-white" style={getHeadingStyle()}>{formattedJobTitles}</h2>
        <p className="text-xs text-white" style={getBodyStyle()}>{location}</p>
        <div className="bg-white h-16 mt-5" style={{backgroundColor:(customStyles as Record<string, string>)['--bg-color']}}/>
      </div>
      <div className="relative w-full pt-15 md:pt-40">
        <Image
          src={"/assets/Ellipse1.svg"}
          alt="Ellipse"
          width={100}
          height={100}
          className="absolute bottom-0 right-0 z-10 md:h-52 md:w-52 lg:h-64 lg:w-64"
        />
        <Image
          src={"/assets/circletemplate.png"}
          alt="circle"
          width={600}
          height={600}
          className="absolute bottom-0 right-3 z-20 md:h-88 md:w-88 lg:h-112 lg:w-md"
        />
        {headShot && (
          <Image
            src={headShot || "/placeholder.svg"}
            alt={`${displayName}'s headshot`}
            // Provide default width and height for remote images.
            // Adjust these values based on the expected aspect ratio of your headshots.
            width={170}
            height={170}
            className="absolute bottom-0 right-7 z-30 object-cover md:h-72 md:w-72 lg:h-96 lg:w-96"
          />
        )}
      </div>
    </section>
  )
}

export default TemplateTwoHero
