"use client";
import React from "react";
import Image from "next/image";
import Buttons from "../Buttons";
import Link from "next/link";

const CommunitySection = () => {
  return (
    <section className="w-full my-10">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">

        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* LEFT COLUMN */}
          <div className="flex flex-col w-full md:order-1">
            {/* 1. Feeling overwhelmed */}
            <div className="h-15 w-full bg-secondary flex items-center mt-5 p-6 md:p-7 lg:p-8">
              <p className="text-xl md:text-2xl lg:text-4xl font-black text-white">
                Feeling overwhelmeddddddd?
              </p>
            </div>

            {/* 2. Intro text */}
            <div className="hidden md:flex flex-col gap-3 font-raleway mt-4 order-1">
              <h2 className="text-primary text-xl md:text-xl lg:text-2xl font-black">
                I bet it&apos;s not just you, Join your community
              </h2>
              <p className="text-textColor md:text-base lg:text-xl font-bold leading-8">
                Get inspired by like-minded individuals, exchange ideas,
                <br />
                and build meaningful connections that propel your career forward.
              </p>
            </div>

            {/* 3. What’s inside */}
            <div className="hidden md:flex flex-col gap-3 font-raleway mt-4 order-2">
              <h2 className="text-primary text-xl md:text-xl lg:text-2xl font-black">
                What&apos;s inside?
              </h2>
              <p className="text-textColor text-sm md:text-base lg:text-xl font-bold leading-8">
                Private forums tailored to your creative field. <br />
                Networking opportunities with top professionals. <br />
                Access to exclusive events, workshops, and job postings.
              </p>
            </div>

            {/* 4. Join the Community */}
            <div className="flex flex-col gap-2 mt-6 order-3 md:mt-10">
              <h2 className="text-primary text-base md:text-lg lg:text-2xl font-bold font-raleway">
                Join the Community
              </h2>
              <Buttons
                className="bg-primary rounded-none text-white w-fit shadow-md px-5 md:px-8 lg:px-10 font-bold"
                label="Click here"
                onClick={() =>
                  window.open("https://discord.gg/wCs38uXS", "_blank")
                }
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden md:flex justify-center items-center w-full md:order-2">
            <Image
              src="/assets/group-images.png"
              alt="women group"
              width={470}
              height={460}
              quality={95}
              priority
              className="object-fill md:w-[350px] md:h-[350px] lg:w-[470px] lg:h-[460px]"
            />
          </div>
        </div>

        {/* BOTTOM ILLUSTRATION */}
<div className="w-full flex justify-center items-center mt-10">
  <Link
    href="https://phythealth.com"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <Image
      src="/assets/recruiter.png"
      alt="Community Illustration"
      width={1920}
      height={900}
      className="w-full max-w-[1200px] h-auto object-cover cursor-pointer"
      priority
    />
  </Link>
</div>


      </div>
    </section>
  );
};

export default CommunitySection;
