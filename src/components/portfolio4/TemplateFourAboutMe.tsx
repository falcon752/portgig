import { myServices } from "@/src/constants";
import React from "react";
import Image from "next/image";
const PortfolioTemplateFourAboutMe = () => {
  return (
    <section>
      <div className="flex flex-col gap-5 mt-10 mb-5 px-5 lg:px-10 font-[inter]">
        <h2 className="text-darkBlue font-bold">About me</h2>
        <div className="bg-gray200 p-5">
          <h2 className="text-darkBlue text-xs lg:text-sm font-istokWeb">
            I’m a passionate Content Writer & Storyteller with a knack for
            crafting compelling, engaging, and results-driven content. I help
            brands and businesses communicate their message effectively, boost
            engagement, and drive conversions. Whether it’s blog writing,
            website copy, social media content, or email marketing, I ensure
            that every word adds value and impact. I thrive on creating content
            that resonates with audiences and aligns with business goals. Let’s
            work together to bring your brand’s story to life!
          </h2>
        </div>
        <h2 className="text-darkBlue font-bold">My Services</h2>
      </div>
      <div className="bg-darkBlue flex">
        <ul className="w-full p-2 text-xs md:text-sm lg:text-sm font-bold flex flex-col justify-center gap-3 py-5 lg:ml-20 font-istokWeb text-white">
          {myServices.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
        <div className="w-full flex justify-end items-start">
          <Image
            src={"/assets/handwrite.svg"}
            alt="hand with pen"
            height={150}
            width={150}
            className=" md:h-52 md:w-52 lg:h-72 lg:w-72	 "
          />
        </div>
      </div>
    </section>
  );
};

export default PortfolioTemplateFourAboutMe;
