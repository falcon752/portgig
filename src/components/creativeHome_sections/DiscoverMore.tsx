"use client";
import Image from "next/image";
import Link from "next/link";
import { Buttons } from "../export_components";

const DiscoverMore = () => {
  return (
    <section className="bodyMargin bg-primary my-5 p-8 rounded-2xl text-white">
      {/* Desktop / Tablet View */}
      <div className="hidden md:flex gap-10 w-full items-center">
        {/* Text Column */}
        <div className="w-full flex flex-col gap-5 font-raleway px-3 md:px-6 lg:px-10 justify-center">
          <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold leading-snug">
            Discover and Connect with Creatives in your Industry.
          </h1>
          <p className="text-[10px] sm:text-xs md:text-base lg:text-base leading-relaxed font-semibold">
            Make new Friends, Connect with your Tribe and bring magic to life
          </p>

          <div className="mt-3">
            <Link href="/creatives-hub">
              <Buttons
                label="Visit Creative Hub"
                className="bg-white rounded-lg text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-fit font-bold font-urbanist"
              />
            </Link>
          </div>
        </div>

        {/* Image Column */}
        <div className="w-full flex items-center justify-center">
          <Image
            src="/assets/group-creative.png"
            alt="discover more creative"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-row items-center gap-4 w-full">
        {/* Text Column */}
        <div className="flex-1 flex flex-col gap-3 font-raleway justify-center">
          <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold leading-snug">
            Discover and Connect with Creatives in your Industry.
          </h1>
          <p className="text-[10px] sm:text-xs md:text-base lg:text-base leading-relaxed font-semibold">
            Make new Friends, Connect with your Tribe and bring magic to life
          </p>

          <div className="mt-3">
            <Link href="/creatives-hub">
              <Buttons
                label="Visit Creative Hub"
                className="bg-white rounded-lg text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-fit font-bold font-urbanist"
              />
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="shrink-0 w-32 h-32 relative flex items-center">
          <Image
            src="/assets/group-creative.png"
            alt="discover more creative"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoverMore;
