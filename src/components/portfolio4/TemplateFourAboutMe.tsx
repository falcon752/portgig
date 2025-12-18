import { myServices } from "@/src/constants";
import React from "react";

const PortfolioTemplateFourAboutMe = () => {
  return (
    <section className="bg-[#faf7f3] px-5 md:px-10 lg:px-20 py-10 font-inter">
      
      {/* ABOUT ME */}
      <div className="flex flex-col gap-4 mb-10">
        <h2 className="text-darkBlue font-bold">About me</h2>

        <div className="bg-white border border-gray-200 rounded-md p-5 text-xs md:text-sm text-gray-700 font-istokWeb leading-relaxed">
          I’m a passionate Content Writer & Storyteller with a knack for
          crafting compelling, engaging, and results-driven content. I help
          brands and businesses communicate their message effectively, boost
          engagement, and drive conversions. Whether it’s blog writing,
          website copy, social media content, or email marketing, I ensure
          that every word adds value and impact. I thrive on creating content
          that resonates with audiences and aligns with business goals. Let’s
          work together to bring your brand’s story to life!
        </div>
      </div>

      {/* SERVICES */}
      <div className="flex flex-col gap-4">
        <h2 className="text-darkBlue font-bold">My Services</h2>

        <div className="flex flex-col gap-4">
          {myServices.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md px-4 py-4 text-xs md:text-sm font-bold text-gray-700 font-istokWeb"
            >
              {service}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default PortfolioTemplateFourAboutMe;
