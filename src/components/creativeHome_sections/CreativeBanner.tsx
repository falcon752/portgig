// CreativeBanner.tsx
import Image from "next/image";

const CreativeBanner = () => {
  return (
    <>
      {/* Desktop / Tablet View */}
      <section className="bodyMargin bg-primary h-fit mt-20 mb-5 max-md:hidden">
        <div className="bodyMargin flex gap-5">
          {/* Text Column */}
          <div className="flex-3/5 w-full flex flex-col justify-center items-start gap-5 py-5 px-3 md:px-6 lg:px-10 font-raleway">
            {/* Main heading - matches HeroSection */}
            <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl text-white font-bold leading-snug">
              Take the Next Step – Find Opportunities, Build Your Network, Get Hired!
            </h1>

            {/* Subtext - matches HeroSection */}
            <p className="text-[10px] sm:text-xs md:text-base lg:text-base leading-relaxed text-white">
              Explore top jobs, showcase your portfolio, and connect with different people in your field.
            </p>
          </div>

          {/* Image Column */}
          <div className="flex-2/5 w-full flex items-center justify-center relative">
            <Image src="/assets/bell.png" alt="creativehero" width={300} height={200} />
          </div>
        </div>
      </section>

      {/* Mobile View */}
      <section className="bg-primary py-8 px-4 md:hidden lg:mt-20 mb-5">
        <div className="flex flex-row items-center gap-4 font-raleway">
          {/* Text Content */}
          <div className="flex-1 text-left space-y-3">
            {/* Main heading - matches HeroSection */}
            <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl text-white font-bold leading-snug">
              Take the Next Step – Find Opportunities, Build Your Network, Get Hired!
            </h1>

            {/* Subtext - matches HeroSection */}
            <p className="text-[10px] sm:text-xs md:text-base lg:text-base leading-relaxed text-white">
              Explore top jobs, showcase your portfolio, and connect with different people in your field.
            </p>
          </div>

          {/* Image */}
          <div className="shrink-0 w-32 h-32 relative">
            <Image
              src="/assets/bell.png"
              alt="creativehero"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CreativeBanner;
