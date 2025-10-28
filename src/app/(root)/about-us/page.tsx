"use client";
import {
  extraText,
  forCreativeText,
  ourStory,
  spaceWhere,
  webuiltThisFor,
} from "@/src/constants";
import React from "react";
import Image from "next/image";

const teamMembers = [
  { image: "blessing.png", name: "Blessing Omobolanle", role: "UI/UX Designer/Digital Marketing Strategist" },
  { image: "samuel.png", name: "Samuel Ajewole", role: "Business Strategist/Data Analyist" },
  { image: "sharon.png", name: "Sharon Lamebri ", role: "Product Manager" },
  { image: "bukky.png", name: "Bukky", role: "Operations Manager" },
  { image: "lashe.png", name: "Lashe", role: "Frontend Developer/ Video Editor" },
  { image: "virtue.png", name: "Virtue(One Man)", role: "Communities Manager" },
  { image: "precious.png", name: "Precious", role: "Content Writer/Strategist" },
  { image: "taiwo.png", name: "Taiye temitope", role: "Social Media Manager/Strategist" },
  { image: "david.png", name: "David Brownson", role: "Social Media Manager/Strategist" },
];

const AboutUs = () => {
  return (
    <main className="text-black my-10">
      {/* Header Section */}
      <div className="bg-gray200 center-flexCol py-7">
        <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-black font-inter">
          About Us
        </h2>
        <h2 className="text-xs md:text-sm lg:text-xl font-inter font-medium text-gray-500 font-inter">
          Home <span className="text-[#0851A3]">&gt;</span>
          <span className="text-[#0851A3]"> about Us</span>
        </h2>
      </div>

      {/* For Creatives Section */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col gap-10">
        <div className="flex flex-col gap-3 md:gap-5">
          <h2 className="text-base md:text-3xl font-raleway font-black text-[#0A1754]">
            For Creatives, By Creatives
          </h2>
          <p className="text-sm lg:text-xl font-medium font-raleway text-[#0A1754]">
            {forCreativeText}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:gap-5">
          <h2 className="text-base lg:text-3xl font-raleway font-black text-[#0A1754]">
            This is a space where creatives:
          </h2>
          <ol className="list-decimal pl-4 space-y-2 text-xs md:text-sm lg:text-2xl font-raleway font-medium text-[#0A1754]">
            {spaceWhere.map((text, index) => (
              <li key={index}>
                <p className="text-sm lg:text-2xl font-raleway font-medium">
                  {text}
                </p>
              </li>
            ))}
          </ol>
          <p className="text-sm lg:text-2xl font-raleway font-medium text-[#0A1754]">
            {extraText}
          </p>
          <p className="text-sm lg:text-2xl font-raleway font-medium text-[#0A1754]">
            So welcome, you’re not just here to fill a profile. <br /> You’re
            here to take up space, to be found, to rise.
          </p>
        </div>
      </div>

      {/* Meet the Team Section - full width banner */}
      <div className="bg-primary center heading text-white py-5 font-raleway text-xl md:text-2xl lg:text-4xl">
        Meet the Team
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col gap-2 w-full items-center">
              <div className="w-full h-[370px] relative bg-[#D9D9D9] rounded-md overflow-hidden">
                <Image
                  src={`/about/${member.image}`}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-[124px] w-[363px] bg-primary text-white flex flex-col items-center justify-center rounded-2xl font-raleway text-center px-2">
                <p className="text-xs md:text-sm lg:text-2xl font-bold">{member.name}</p>
                <p className="text-[10px] md:text-xs">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section - full width banner */}
      <div className="bg-[#0A1754] center heading text-white py-5 text-5xl font-black font-raleway">
        Our Story
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10">
        <div className="flex flex-col gap-10">
          <p className="text-xs md:text-sm lg:text-2xl text-[#0A1754]">
            {ourStory}
          </p>

          <div className="flex flex-col gap-5">
            <h2 className="text-[#00489A] font-black text-sm md:text-lg lg:text-3xl font-raleway">
              We built this for
            </h2>
            <ol className="list-decimal pl-4 space-y-2 text-xs md:text-sm lg:text-2xl font-raleway text-[#0A1754]">
              {webuiltThisFor.map((text, index) => (
                <li key={index}>
                  <p className="text-xs md:text-sm lg:text-2xl font-raleway text-[#0A1754]">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs md:text-sm lg:text-2xl text-[#0A1754]">
            This is for you. <br /> Let’s build something unforgettable
            together.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;
