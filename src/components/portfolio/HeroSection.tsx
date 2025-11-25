"use client";

import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-[#F2F2F2] text-[#0F172A] font-urbanist">
      {/* Header Section */}
      <section className="bg-[#0A1F63] text-white px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-14 lg:py-16 flex flex-col md:flex-row justify-between md:justify-evenly lg:justify-between items-center gap-8 md:gap-6 lg:gap-10 relative shadow-2xl md:rounded-2xl lg:rounded-3xl md:max-w-6xl lg:max-w-7xl md:mx-auto md:w-full">
        
        {/* Text Content */}
        <div className="max-w-xl text-center md:text-left md:flex-1 md:pr-6 lg:pr-10">
          <p className="text-sm md:text-base lg:text-lg mb-3 md:mb-4 lg:mb-5">
            Your Work Deserves the Right Canvas
          </p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 lg:mb-5 leading-snug md:leading-tight lg:leading-tight">
            Portfolio Template Market
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose">
            Pick a portfolio template tailored to your creative niche. Swap
            anytime, zero stress.
          </p>
        </div>

        {/* Image */}
        <div className="w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[300px] md:flex-1 flex justify-center md:justify-end lg:justify-end">
          <Image
            src="/assets/template.png"
            alt="profile"
            width={300}
            height={300}
            className="object-contain w-full h-auto"
          />
        </div>
      </section>

      {/* Highlight Banner */}
      <div className="w-full max-w-[1280px] bg-[#00489A] text-white text-sm sm:text-base md:text-lg lg:text-xl px-5 py-5 sm:p-6 md:py-7 md:px-10 lg:px-14 my-10 shadow-xl text-center font-raleway opacity-100 mx-auto leading-relaxed">
        We currently have 6 unique portfolio templates tailored for different
        creative industries, from graphic designers to editors and more. This is
        just the beginning.
      </div>

      {/* Info Text */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0 text-sm sm:text-base md:text-lg lg:text-xl text-[#0A1754] space-y-5 font-raleway font-semibold leading-relaxed">
        <p>
          As we grow, we’ll keep expanding this library with fresh, inspiring
          layouts made by top-notch UI/UX designers, and you’ll get to pick the
          one that fits you best.
        </p>
        <p>
          Whether you’re showing off your logos, reels, edits, or product shots,
          preview, edit, and launch your work the way you want it seen.
        </p>
        <p>
          This space will soon feature community-made templates too. We’ll open
          submissions so that designers can drop their best, and you get even
          more ways to stand out.
        </p>
      </div>

      {/* Bottom Buttons */}
      <div className="w-full max-w-[1280px] mx-auto flex flex-col sm:flex-row flex-wrap justify-center md:justify-evenly lg:justify-between items-center mt-10 bg-[#0A1F63] p-4 sm:p-6 md:p-8 lg:p-10 text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl font-raleway gap-4 md:gap-6 lg:gap-8 shadow-2xl text-center rounded-none lg:rounded-4xl">
        <button className="font-black">Select the template for your niche</button>
        <button className="font-black">Preview it</button>
        <button className="font-black">Edit it</button>
        <button className="font-black">Save</button>
      </div>
    </div>
  );
};

export default HeroSection;
