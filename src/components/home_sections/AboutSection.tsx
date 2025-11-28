"use client";
import React from "react";
import Image from "next/image";
import { Buttons } from "../export_components";

const AboutSection = () => {
  return (
    <section
      className="
        2xl:mx-auto 2xl:w-[1300px]
        mx-4 sm:mx-6 md:mx-10 lg:mx-16
        my-5 text-textColor
      "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-0 md:gap-5 lg:mt-15 font-raleway">
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          <h1 className="text-textColor text-2xl md:text-4xl lg:text-5xl font-bold font-urbanist">
            What is this all about?
          </h1>
          <hr className="border-3 border-primary w-45 mt-1 md:mt-10 lg:mt-15" />
          <h2 className="lg:w-120 text-xl md:text-2xl lg:text-2xl 2xl:text-3xl font-bold mt-5 text-textColor font-raleway max-lg:hidden">
            Redefining How Creatives Present Themselves
          </h2>
          <p className="text-[10px] sm:text-[20px] leading-6 sm:leading-[41px] text-left my-2 text-primary font-semibold sm:font-bold font-raleway max-w-full sm:max-w-md lg:max-w-lg">
            We understand the struggles creatives face in presenting their skills.  
            Generic CVs don’t cut it anymore. That’s why we’re here to help you  
            create a professional portfolio tailored to your craft. Whether you’re  
            a designer, writer, developer, or artist.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex items-start justify-start flex-row gap-3">
          {/* Mobile paragraph */}
          <p className="sm:hidden text-[10px] text-left leading-6 mt-9 flex-1 text-primary font-semibold font-raleway">
            Get a stunning portfolio that speaks for you. Showcase your skills,
            impress recruiters, and land your next big opportunity.
          </p>

          {/* Mobile image */}
          <Image
            src="/assets/groupss.png"
            alt="Creative presentation"
            width={180}
            height={170}
            className="object-contain block sm:hidden"
          />

          {/* Desktop image */}
          <Image
            src="/assets/groupImage.png"
            alt="Creative presentation"
            width={520}
            height={340}
            className="hidden sm:block sm:ml-8 md:ml-16 lg:ml-32"
          />
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 mt-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          <h2 className="text-lg md:text-2xl lg:text-4xl font-black text-primary font-urbanist">
            All your works in one place, easy to share. easy to impress.
          </h2>
          <hr className="border-5 border-primary w-45 max-lg:mt-1 max-lg:mb-5 md:my-2 lg:my-3" />
          <Image
            src="/assets/about-man.png"
            alt="About man"
            width={659}
            height={300}
            className="w-full h-auto"
          />
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="flex flex-col items-start sm:justify-center gap-5 font-raleway
                     sm:ml-4 md:ml-8 lg:ml-16"
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mt-2 text-primary">
              Find Jobs That Fit You
            </h2>
            <p className="text-[10px] sm:text-[20px] leading-6 sm:leading-[41px] text-left my-2 text-primary font-semibold sm:font-bold font-raleway max-w-full sm:max-w-md lg:max-w-lg">
              Discover gigs and job postings that match your expertise.  
              With just one click, apply using your comprehensive portfolio,  
              no CVs required.
            </p>
          </div>

          <div className="hidden bg-primary w-fit lg:w-115 rounded-2xl md:flex flex-col gap-5 text-white p-6 md:p-8 lg:p-10">
            <p className="font-black text-xl md:text-2xl lg:text-3xl">
              Sell on Portgig Shop
            </p>
            <p className="text-[10px] sm:text-[20px] leading-6 sm:leading-[41px] text-left my-2 text-white font-semibold sm:font-bold font-raleway max-w-full sm:max-w-md lg:max-w-lg">
              As a creative, do you have any digital product you would like to  
              sell or would you like to shop for items?
            </p>
            <Buttons
              label="Visit Shop"
              className="w-fit text-black bg-white font-urbanist self-end font-bold px-6 md:px-8 lg:px-10"
              onClick={() => {
                window.open("https://shop.portgig.com.ng/", "_blank");
              }}
            />
          </div>
        </div>
      </div>

      {/* THIRD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 lg:mt-10">
        <div className="flex flex-col">
          <div className="max-md:max-w-[250px] md:max-w-[300px] lg:w-xl bg-secondary flex justify-start items-center mt-5 px-4 py-4">
            <p className="text-white font-extrabold text-base md:text-xl lg:text-3xl">
              Seamless Hiring for Recruiters
            </p>
          </div>
          <div className="flex flex-col lg:ml-5">
            <h2 className="text-primary text-xl md:text-2xl lg:text-3xl font-black mt-3 max-lg:mb-2 lg:mt-5 font-raleway">
              Hire the Right Talent, Fast
            </h2>
            <p className="text-[10px] sm:text-[20px] leading-6 sm:leading-[41px] text-left my-2 text-primary font-semibold sm:font-bold font-raleway max-w-full sm:max-w-md lg:max-w-lg">
              Access profiles with detailed portfolios and work histories.  
              Post jobs, track applications, and connect with professionals in a few clicks.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center">
          <Image
            src="/assets/Ellipse-woman.png"
            alt="ellipse woman"
            width={550}
            height={500}
            className="object-fill"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
