"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const RecruiterHeroSection = () => {
  const router = useRouter();

  return (
    <section className="bodyMargin h-fit bg-primary my-5 rounded-2xl gap-5">
      {/* H1 shown only on mobile — full width above */}
      <div className="block md:hidden px-4 pt-4">
        <h1 className="text-xl font-bold text-white font-urbanist text-center">
          Find Top Talent for Your Next Big Project
        </h1>
      </div>

      <div className="h-full flex flex-row">
        {/* TEXT SECTION */}
        <div className="flex flex-col justify-center gap-3 p-3 md:p-10 flex-1">
          <p className="text-sm font-urbanist lg:text-xl text-white semibold">
            Welcome to Portgig
          </p>

          {/* H1 only shown on desktop */}
          <h1 className="hidden md:block text-lg md:text-xl lg:text-5xl leading-5 lg:leading-16 pt-3 font-bold font-urbanist text-white">
            Find Top Talent for Your Next Big Project
          </h1>

          <p className="text-xs md:text-base lg:text-xl text-white font-light">
            Discover skilled professionals in design, writing, marketing, and
            more. Hire the best, faster.
          </p>

          <button
            className="rounded-4xl py-3 px-8 font-semibold lg:px-14 lg:mt-10 lg:ml-3 cursor-pointer bg-white text-primary text-sm md:text-base lg:text-xl lg:font-bold w-fit"
            onClick={() => router.push("/recruiter-dashboard/post-jobs")}
          >
            Post Jobs
          </button>
        </div>

        {/* IMAGE SECTION */}
        <div className="w-full flex justify-end items-end flex-1">
          <Image
            src="/assets/creativehero-1.png"
            alt="creativehero"
            width={400}
            height={400}
            className="object-contain rounded-br-2xl max-lg:w-48 max-lg:h-48 max-w-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default RecruiterHeroSection;
