"use client";
import React from "react";
import Image from "next/image";
import { Buttons } from "../export_components";

const AboutSection = () => {
  return (
    <section className="w-full my-10 text-textColor">
      <div className="w-full max-w-[1260px] mx-auto px-4 sm:px-6 md:px-8 font-raleway">
        {/* FIRST GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 lg:mt-10">
          <div className="flex flex-col">
            <h1 className="text-textColor text-2xl md:text-4xl lg:text-5xl font-bold font-urbanist">
              What is this all about?
            </h1>
            <hr className="border-4 border-primary w-16 mt-5 md:mt-8 lg:mt-10" />
            <h2 className="lg:w-[480px] text-xl md:text-2xl lg:text-3xl font-black mt-5 text-primary max-lg:hidden">
              Redefining How Creatives Present Themselves
            </h2>
            <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-left leading-6 my-3 text-primary font-semibold">
              We understand the struggles creatives face in presenting their
              skills. Generic CVs don’t cut it anymore. That’s why we’re here to
              help you create a professional portfolio tailored to your craft.
              Whether you’re a designer, writer, developer, or artist.
            </p>
          </div>

          <div className="flex items-start justify-center flex-row gap-0">
            <p className="sm:hidden text-sm font-bold text-[#0A1754]">
              Get a stunning portfolio that speaks for you. Showcase your skills,
              impress recruiters, and land your next big opportunity.
            </p>
            <Image
              src="/assets/groupss.png"
              alt="Creative presentation"
              width={180}
              height={170}
              className="object-contain block md:w-[250px] md:h-[200px] lg:hidden"
            />
            <Image
              src="/assets/groupImage.png"
              alt="Creative presentation"
              width={520}
              height={340}
              className="object-contain hidden lg:block"
            />
          </div>
        </div>

        {/* SECOND GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mt-10">
          <div className="flex flex-col">
            <h2 className="text-lg md:text-2xl lg:text-4xl font-black text-primary font-urbanist">
              All your works in one place, easy to share. easy to impress.
            </h2>
            <hr className="border-4 border-primary w-16 my-3" />
            <Image
              src="/assets/about-man.png"
              alt="About man"
              width={659}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="flex flex-col items-start sm:justify-center gap-5">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mt-2 text-primary">
                Find Jobs That Fit You
              </h2>
              <p className="text-sm md:text-base lg:text-lg leading-6 my-2 font-bold text-primary">
                Discover gigs and job postings that match your expertise. <br />
                With just one click, apply using your comprehensive portfolio,{" "}
                <br />
                no CVs required.
              </p>
            </div>

            <div className="hidden md:flex flex-col gap-5 bg-primary text-white rounded-2xl p-6 md:p-8 lg:p-10 w-fit lg:w-[460px]">
              <p className="font-black text-xl md:text-2xl lg:text-3xl">
                Sell on Portgig Shop
              </p>
              <p className="font-bold text-sm md:text-base lg:text-base">
                As a creative, do you have any digital product you would like to
                sell or would you like to shop for items?
              </p>
              <Buttons
                label="Visit Shop"
                className="w-fit text-black bg-white font-urbanist font-bold px-6 md:px-8 lg:px-10 self-end"
                onClick={() => {
                  window.open("https://shop.portgig.com.ng/", "_blank");
                }}
              />
            </div>
          </div>
        </div>

        {/* THIRD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 lg:mt-10">
          <div className="flex flex-col">
            <div className="bg-secondary flex items-center mt-5 px-4 py-4 rounded-lg w-fit max-md:max-w-[250px] md:max-w-[300px] lg:w-[400px]">
              <p className="text-white font-extrabold text-base md:text-xl lg:text-3xl">
                Seamless Hiring for Recruiters
              </p>
            </div>
            <div className="flex flex-col lg:ml-5 mt-3">
              <h2 className="text-primary text-xl md:text-2xl lg:text-3xl font-black font-raleway">
                Hire the Right Talent, Fast
              </h2>
              <p className="text-primary text-[11px] sm:text-sm md:text-base lg:text-lg my-2 font-bold max-w-xs md:max-w-sm lg:w-[400px]">
                Access profiles with detailed portfolios and work histories. Post
                jobs, track applications, and connect with professionals in a few
                clicks.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <Image
              src="/assets/Ellipse-woman.png"
              alt="ellipse woman"
              width={550}
              height={500}
              className="object-fill"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
