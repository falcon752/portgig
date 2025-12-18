import Image from "next/image";
import { Buttons } from "../export_components";

const PortfolioTemplateFourPortfolio = () => {
  return (
    <section className="bg-[#faf7f3] px-5 md:px-10 lg:px-20 py-10 space-y-12">

      {/* PORTFOLIO */}
      <div className="space-y-8">
        <h2 className="text-darkBlue font-bold text-lg">
          My Portfolio
        </h2>

        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg px-6 py-8 space-y-6"
          >
            <h3 className="font-bold text-darkBlue text-base">
              Blog post: Matters Trending
            </h3>

            <p className="text-sm text-gray-600 font-istokWeb text-center max-w-2xl mx-auto">
              I’m a passionate Content Writer & Storyteller with a knack for
              crafting compelling, engaging, and results-driven content. I help
              brands and businesses communicate their message effectively.
            </p>

            <Buttons
              label="Read more"
              className="
                w-full
                border
                border-orange-400
                text-orange-400
                bg-transparent
                rounded-md
                py-3
                font-medium
              "
            />
          </div>
        ))}
      </div>

      {/* CASE STUDY — FIXED */}
      <div className="space-y-6">
        <h2 className="text-darkBlue font-bold text-lg">
          Case Study
        </h2>

        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 text-sm lg:text-base font-istokWeb text-gray-600 leading-relaxed"
          >
            I’m a passionate Content Writer & Storyteller with a knack for
            crafting compelling, engaging, and results-driven content. I help
            brands and businesses communicate their message effectively, boost
            engagement, and drive conversions. Whether it’s blog writing,
            website copy, social media content, or email marketing, I ensure
            that every word adds value and impact. I thrive on creating content
            that resonates with audiences and aligns with business goals. Let’s
            work together to bring your brand’s story to life!
          </div>
        ))}
      </div>

      {/* SOCIAL LINKS */}
      <div className="space-y-6">
        <h2 className="text-darkBlue font-bold text-lg">
          Social & Writing Platform Links
        </h2>

        <div className="flex flex-col gap-10">
          {["LinkedIn", "Medium"].map((platform, index) => (
            <div key={index} className="space-y-3">
              <p className="font-bold text-darkBlue">{platform}</p>

              <Buttons
                label="Click here"
                className="
                  w-full
                  border
                  border-orange-400
                  text-orange-400
                  bg-white
                  rounded-md
                  py-3
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* WHY WORK WITH ME */}
      <div className="space-y-6">
        <h2 className="text-darkBlue font-bold text-lg">
          Why you should work with me?
        </h2>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm lg:text-base font-istokWeb text-gray-600 leading-relaxed">
          I’m a passionate Content Writer & Storyteller with a knack for crafting
          compelling, engaging, and results-driven content. I help brands and
          businesses communicate their message effectively, boost engagement,
          and drive conversions. Whether it’s blog writing, website copy, social
          media content, or email marketing, I ensure that every word adds value
          and impact. I thrive on creating content that resonates with audiences
          and aligns with business goals. Let’s work together to bring your
          brand’s story to life!
        </div>
      </div>



    </section>
  );
};

export default PortfolioTemplateFourPortfolio;
