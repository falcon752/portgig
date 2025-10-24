"use client";
import Image from "next/image";
import { Buttons } from "./export_components";

const CommunityTwo = () => {
  return (
    <section className="my-0 lg:my-10 flex flex-col gap-2 lg:gap-5 bodyMargin">
      {/* Banner */}
      <div className="h-auto w-full max-w-xl bg-secondary flex items-center mt-5 px-4 py-6 rounded-md sm:p-8">
        <p className="text-white font-bold text-lg subHeading">
          Feeling overwhelmed?
        </p>
      </div>

      <div className="flex flex-row gap-4 lg:gap-10 bg-white lg:bg-primary my-0 lg:my-5 p-4 sm:p-8 rounded-2xl text-white font-raleway">
        <div className="flex flex-col gap-2 lg:gap-10 w-full lg:w-2/3">
          <p className="text-[13px] sm:text-base lg:hidden font-black max-lg:text-[#0A1754]">
            I bet it&apos;s not just you, Join your community
          </p>
          <p className="font-semibold text-[10px] sm:text-base lg:text-xl max-lg:text-[#00489A]">
            Get inspired by like-minded individuals, exchange ideas, and build
            meaningful connections that propel your career forward.
          </p>

          <div className="flex flex-col gap-3 sm:gap-5">
            <h2 className="text-base sm:text-lg md:text-3xl font-black max-lg:hidden">
              What&apos;s inside?
            </h2>
            <p className="font-semibold text-[10px] sm:text-base lg:text-xl max-lg:hidden">
              Private forums tailored to your creative field. Networking
              opportunities with top professionals. Access to exclusive events,
              workshops, and job postings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-5">
            <h2 className="text-xs md:text-3xl font-bold max-lg:text-[#0A1754]">
              Join the Community
            </h2>
            <Buttons
              label="Click here"
              className="px-4 sm:px-6 lg:px-10 py-2 bg-[#0A1754] rounded-none! lg:bg-white lg:text-[#0A1754] max-lg:text-white text-xs sm:text-sm lg:text-xl w-fit font-bold font-urbanist"
              onClick={() => {
                window.open("https://discord.gg/wCs38uXS", "_blank");
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex justify-center items-center">
          {/* Mobile Image */}
          <Image
            src="/assets/community.png"
            alt="Discover more creatives"
            width={1200}
            height={1200}
            className="object-contain w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:hidden"
          />

          {/* Desktop Image */}
          <Image
            src="/assets/two-women.png"
            alt="Discover more creatives"
            width={400}
            height={400}
            className="object-contain h-full max-h-96 hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
};

export default CommunityTwo;
