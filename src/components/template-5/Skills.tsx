import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import Image from "next/image"

interface TemplateFiveSkillsProps {
  mySkillSet: string[]
  portfolioData?: any
}

export default function Skills({ mySkillSet, portfolioData }: TemplateFiveSkillsProps) {
  const { customStyles, getHeadingStyle, getBodyStyle, colorUtils } = usePortfolioCustomizations(portfolioData);
  
  return (
    <div 
      className="py-6"
      style={{ ...customStyles, backgroundColor: (customStyles as Record<string, string>)['--bg-color'] }}
    >
      <h2 
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 px-6 lg:px-10"
        style={getHeadingStyle()}
      >
        My Skill Set
      </h2>
      <div 
        className="flex flex-col lg:flex-row items-start justify-center gap-10 px-6 lg:px-10 py-10 border-y"
        style={{ 
          backgroundColor: colorUtils.darken((customStyles as Record<string, string>)['--bg-color'] || '#1C1C1C', 0.1),
          borderColor: (customStyles as Record<string, string>)['--accent-color']
        }}
      >
        <div className="w-full lg:w-1/2 space-y-6">
          {mySkillSet && mySkillSet.length > 0 ? (
            mySkillSet.map((item, index) => (
              <p 
                key={index} 
                className="font-medium text-base md:text-xl lg:text-2xl leading-snug"
                style={getBodyStyle()}
              >
                {item}
              </p>
            ))
          ) : (
            <p 
              className="text-lg"
              style={getBodyStyle({ opacity: 0.7 })}
            >
              No skills listed.
            </p>
          )}
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center">
          <Image
            src="/assets/star.svg"
            alt="Strategy Visual"
            width={500}
            height={500}
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}