"use client"; 
import Image from "next/image";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFourHeroProps {
  displayName: string;
  jobTitles: string[];
  location: string;
  headShot: string;
  portfolioData: any; 
}

export function TemplateFourHero({
  displayName,
  jobTitles,
  location,
  headShot,
  portfolioData,
}: TemplateFourHeroProps) {
  console.log("TemplateFourHero: Received headShot prop:", headShot);
  
  const { customStyles, getHeadingStyle, getBodyStyle, getAccentStyle } = usePortfolioCustomizations(portfolioData);
  
  const [firstName, ...lastNameParts] = displayName
    ? displayName.split(" ")
    : ["Your", "Name"];
  const lastName = lastNameParts.join(" ");

  return (
    <section 
      style={{ 
        ...customStyles,
        backgroundColor: 'var(--primary-color)'
      }} 
      className="px-5 md:px-10 lg:px-20 pt-10 lg:pt-20 flex flex-col lg:flex-row gap-5"
    >
      {/* Image Section - Shows first on mobile, second on desktop */}
      <div 
        className="h-64 sm:h-80 lg:h-96 flex items-center justify-center order-1 lg:order-2 lg:shrink-0 relative"
      >
        <Image
          src={
            headShot || "/placeholder.svg?height=500&width=500&query=A writer"
          } 
          alt={displayName || "A writer"}
          height={120}
          width={120}
          className="sm:w-[200px] sm:h-[200px] object-cover"
        />
      </div>
      <div className="flex flex-col w-full py-5 order-2 lg:order-1">
        <p 
          style={getAccentStyle({ fontSize: '0.875rem' })}
          className="md:text-lg ml-4 sm:ml-6 lg:ml-10 font-lancelot"
        >
          Hello
        </p>
        <div className="lg:hidden">
          <div className="flex flex-row items-end gap-4">
            <div>
              <h2 
                style={getHeadingStyle({ 
                  fontSize: '1.875rem',
                  color: 'var(--bg-color)' // White text on dark background
                })}
                className="sm:text-4xl md:text-5xl ml-2 sm:ml-3 font-lateef"
              >
                I&apos;m {firstName}
              </h2>
              <h2 
                style={getHeadingStyle({ 
                  fontSize: '1.875rem',
                  color: 'var(--bg-color)' // White text on dark background
                })}
                className="sm:text-4xl md:text-5xl font-lateef"
              >
                {lastName}
              </h2>
            </div>
            <h2 
              style={getAccentStyle({ 
                fontSize: '0.75rem',
                fontWeight: 'bold'
              })}
              className="md:text-sm mt-2 sm:mt-0 sm:mb-2 font-inter"
            >
              {jobTitles?.join(", ") || "Your Job Titles"}
            </h2>
          </div>
          <h2 
            style={getBodyStyle({ 
              fontSize: '0.625rem',
              fontWeight: 'bold',
              color: 'var(--bg-color)' // White text
            })}
            className="md:text-xs mt-1 font-inter"
          >
            {location || "Your Location"}
          </h2>
        </div>
        <div className="hidden lg:block">
          <h2 
            style={getHeadingStyle({ 
              fontSize: '6rem',
              color: 'var(--bg-color)', // White text on dark background
              marginLeft: '1.25rem'
            })}
            className="xl:ml-20 font-lateef"
          >
            I&apos;m {firstName}
          </h2>
          <h2 
            style={getHeadingStyle({ 
              fontSize: '6rem',
              color: 'var(--bg-color)' // White text on dark background
            })}
            className="font-lateef"
          >
            {lastName}
          </h2>
          <h2 
            style={getAccentStyle({ 
              fontSize: '1.125rem',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            })}
            className="font-inter"
          >
            {jobTitles?.join(", ") || "Your Job Titles"}
          </h2>
          <h2 
            style={getBodyStyle({ 
              fontSize: '0.875rem',
              fontWeight: 'bold',
              marginTop: '0.25rem',
              color: 'var(--bg-color)' // White text
            })}
            className="font-inter"
          >
            {location || "Your Location"}
          </h2>
        </div>
      </div>
    </section>
  );
}

export default TemplateFourHero;