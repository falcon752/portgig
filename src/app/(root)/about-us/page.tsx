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
  {
    image: "blessing.png",
    name: "Blessing Omobolanle",
    role: "UI/UX Designer/Digital Marketing Strategist",
  },
  {
    image: "samuel.png",
    name: "Samuel Ajewole",
    role: "Business Strategist/Data Analyist",
  },
  { image: "sharon.png", name: "Sharon Lamebri ", role: "Product Manager" },
  { image: "bukky.png", name: "Bukky", role: "Operations Manager" },
  {
    image: "lashe.png",
    name: "Lashe",
    role: "Frontend Developer/ Video Editor",
  },
  { image: "virtue.png", name: "Virtue(One Man)", role: "Communities Manager" },
  {
    image: "precious.png",
    name: "Precious",
    role: "Content Writer/Strategist",
  },
  {
    image: "taiwo.png",
    name: "Taiye temitope",
    role: "Social Media Manager/Strategist",
  },
  {
    image: "david.png",
    name: "David Brownson",
    role: "Social Media Manager/Strategist",
  },
];

const AboutUs = () => {
  return (
    <main className="text-black my-10">
      {/* Header Section */}
      <div className="bg-gray200 center-flexCol py-7">
        <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-black font-inter">
          About Us
        </h2>
        <h2 className="text-xs md:text-sm lg:text-xl font-inter font-medium text-gray-500">
          Home <span className="text-[#0851A3]">&gt;</span>
          <span className="text-[#0851A3]"> about Us</span>
        </h2>
      </div>

      {/* For Creatives Section */}
      <div className="bodyMargin px-2 md:px-10 py-10 flex flex-col gap-10">
        <div className="flex flex-col gap-3 md:gap-5">
          <h2 className="text-lg md:text-3xl font-raleway font-extrabold text-[#0A1754]">
            Forrrrrr Creatives, By Creatives
          </h2>
          <p className="font-raleway font-medium text-sm md:text-base lg:text-lg leading-relaxed text-[#0A1754]">
            {forCreativeText}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:gap-5">
          <h2 className="text-lg md:text-3xl font-raleway font-extrabold text-[#0A1754]">
            This is a space where creatives:
          </h2>

          <ol className="list-decimal pl-4 space-y-2">
            {spaceWhere.map((text, index) => (
              <li key={index}>
                <p className="font-raleway font-medium text-sm md:text-base lg:text-xl leading-relaxed text-[#0A1754]">
                  {text}
                </p>
              </li>
            ))}
          </ol>

          <p className="font-raleway font-medium text-sm md:text-base lg:text-lg leading-relaxed text-[#0A1754]">
            {extraText}
          </p>

          <p className="font-raleway font-medium text-sm md:text-base lg:text-lg leading-relaxed text-[#0A1754]">
            So welcome, you’re not just here to fill a profile. <br /> You’re
            here to take up space, to be found, to rise.
          </p>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="bg-primary center heading text-white py-5 font-raleway text-xl md:text-2xl lg:text-4xl">
        Meet the Team
      </div>

      <div className="bodyMargin py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 w-full items-center"
            >
              <div className="w-full h-[370px] relative bg-[#D9D9D9] rounded-md overflow-hidden">
                <Image
                  src={`/about/${member.image}`}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-[124px] w-[363px] bg-primary text-white flex flex-col items-center justify-center rounded-2xl font-raleway text-center px-2">
                <p className="text-sm md:text-base lg:text-xl font-bold">
                  {member.name}
                </p>
                <p className="text-[10px] md:text-xs lg:text-sm">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-[#0A1754] center heading text-white py-5 text-3xl md:text-4xl lg:text-5xl font-black font-raleway">
        Our Story
      </div>

      <div className="bodyMargin py-10">
        <div className="flex flex-col gap-10">
          <p className="font-raleway font-medium text-sm md:text-base lg:text-lg leading-relaxed text-[#0A1754]">
            {ourStory}
          </p>

          <div className="flex flex-col gap-5">
            <h2 className="text-[#00489A] font-black text-base md:text-lg lg:text-3xl font-raleway">
              We built this for
            </h2>

            <ol className="list-decimal pl-4 space-y-2">
              {webuiltThisFor.map((text, index) => (
                <li key={index}>
                  <p className="font-raleway font-medium text-sm md:text-base lg:text-lg leading-relaxed text-[#0A1754]">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <p className="font-raleway font-medium text-sm md:text-base lg:text-lg leading-relaxed text-[#0A1754]">
            This is for you. <br /> Let’s build something unforgettable
            together.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;
