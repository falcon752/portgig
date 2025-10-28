"use client";
import Image from "next/image";
import { Buttons } from "../export_components";

const HeroSection = () => {
  return (
    <section className="flex justify-center text-white pt--10 pb--10">
      <main
        className="
          w-full max-w-[1200px]
          bg-primary rounded md:rounded-3xl
          flex flex-row items-stretch
          overflow-hidden
          text-white
          mx-auto
        "
      >
        {/* LEFT SIDE – TEXT */}
        <div
          className="
            flex-1 flex flex-col justify-center
            py-6 sm:py-10 md:py-16 lg:py-20
            px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20
            gap-4 sm:gap-6
          "
        >
          <div className="flex flex-col gap-0 sm:gap-1 md:gap-2 lg:gap-3">
            <h1 className="text-base sm:text-xl md:text-3xl lg:text-5xl font-urbanist">
              Connect.
            </h1>
            <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-6xl font-urbanist">
              Create.{" "}
              <span className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-urbanist">
                Thrive.
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 font-raleway max-w-xs sm:max-w-sm md:max-w-md">
            <p className="hidden sm:block text-xs md:text-sm lg:text-base font-medium leading-relaxed">
              Get a stunning portfolio that speaks for you. Showcase your skills,
              impress recruiters, and land your next big opportunity.
            </p>

            <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-extrabold">
              Showcase your skills, land dream projects,
              <br className="hidden sm:block" />
              hire top talent, all in one place
            </p>
          </div>

          <Buttons
            onClick={() => window.open("/onboarding")}
            label="Get started"
            className="
              mt-3
              self-start
              bg-white text-black font-semibold
              text-[10px] sm:text-xs md:text-sm lg:text-base
              px-3 sm:px-5 md:px-6 lg:px-10
              py-1 sm:py-1.5 md:py-2 lg:py-3
              rounded
              w-fit cursor-pointer
            "
          />
        </div>

        {/* RIGHT SIDE – IMAGES */}
        <div
          className="
            flex-1 flex
            min-h-[250px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[550px]
          "
        >
          <div className="relative flex-1">
            <Image
              src="/assets/woman1.png"
              alt="Portgig Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative flex-1">
            <Image
              src="/assets/man.png"
              alt="Portgig Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
