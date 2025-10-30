import Image from "next/image"

const CreativeHeroSection = () => {
  return (
    <section className="flex justify-center text-white my-5 font-urbanist">
      <main
        className="
          w-full max-w-[1200px]
          bg-primary rounded md:rounded-3xl
          flex flex-row items-stretch
          overflow-hidden
          text-white
          mx-auto
          h-fit md:h-[250px] lg:h-[350px]
        "
      >
        <div className="flex-1 flex flex-col justify-center gap-2 md:gap-8 py-5 px-3 md:px-6 lg:px-10">
          <p className="text-sm font-urbanist lg:text-xl text-white bold lg:pt-20">
            Welcome to Portgig
          </p>
          <h1 className="text-[16px] md:text-2xl lg:text-5xl font-bold">
            Your Creative Hub for Work & Talent
          </h1>
          <p className="text-[10px] md:text-sm lg:text-xl font-extralight text-white">
            Connect, collaborate, and create. Whether you&apos;re looking for jobs or hiring top creatives, start
            exploring today.
          </p>
        </div>

        <div className="flex-1 flex items-end justify-center md:justify-end relative overflow-hidden min-w-0">
          <div className="hidden md:block relative">
            <Image
              src="/assets/creativehero-1.png"
              alt="creativehero"
              width={600}
              height={600}
              className="object-contain w-full h-auto lg:w-[1400px]"
            />
          </div>
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
      </main>
    </section>
  )
}

export default CreativeHeroSection
