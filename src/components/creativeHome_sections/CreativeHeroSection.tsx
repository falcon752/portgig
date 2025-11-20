import Image from "next/image"

const CreativeHeroSection = () => {
  return (
    <section className="bodyMargin h-fit md:h-[250px] lg:h-[350px] bg-primary my-5 lg:rounded-2xl font-urbanist overflow-hidden">
      {/* Removed bodyMargin from inner div to avoid double margins */}
      <div className="h-full flex flex-row items-stretch">
              <div className="w-1/2 flex flex-col justify-center gap-2 md:gap-8 py-5 px-3 md:px-6 lg:px-10">
              <p className="text-sm sm:text-xl font-bold text-white">

            Welcome to Portgig
          </p>
          <h1 className="text-[16px] md:text-2xl lg:text-5xl font-bold">Your Creative Hub for Work & Talent</h1>
          <p className="text-sm sm:text-lg text-white">

            Connect, collaborate, and create. Whether you&apos;re looking for jobs or hiring top creatives, start
            exploring today.
          </p>
        </div>
        {/* Fixed image container with proper responsive sizing */}
        <div className="w-1/2 flex items-end justify-center md:justify-end relative overflow-hidden min-w-0">
          {/* First image - only shown on desktop */}
          <div className="hidden md:block relative">
            <Image
              src="/assets/creativehero-1.png"
              alt="creativehero"
              width={600}
              height={600}
              className="object-contain w-full h-auto lg:w-[1400px]"
            />
          </div>
          {/* Second image - shown on mobile and desktop */}
          <div className="relative">
            <Image
              src="/assets/creativehero-01.png"
              alt="creativehero"
              width={600}
              height={600}
              className="object-contain w-full h-auto lg:w-[1400px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreativeHeroSection
