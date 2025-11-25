import Image from "next/image";

const CreativeHeroSection = () => {
  return (
    <section className="bodyMargin h-fit md:h-[250px] lg:h-[350px] bg-primary my-5 lg:rounded-2xl font-urbanist overflow-hidden">
      <div className="h-full flex flex-row items-stretch">
        <div className="w-1/2 flex flex-col justify-center gap-2 md:gap-6 py-5 px-3 md:px-6 lg:px-10">
          {/* Small heading */}
          <p className="text-[10px] sm:text-xs md:text-base lg:text-base font-semibold leading-relaxed text-white">
            Welcome to Portgig
          </p>

          {/* Main heading */}
          <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl text-white font-bold leading-snug">
            Your Creative Hub for Work & Talent
          </h1>

          {/* Subtext */}
          <p className="text-[10px] sm:text-xs md:text-base lg:text-base leading-relaxed text-white">
            Connect, collaborate, and create. Whether you&apos;re looking for jobs or hiring top creatives, start exploring today.
          </p>
        </div>

        <div className="w-1/2 flex items-end justify-center md:justify-end relative overflow-hidden min-w-0">
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
      </div>
    </section>
  );
};

export default CreativeHeroSection;
