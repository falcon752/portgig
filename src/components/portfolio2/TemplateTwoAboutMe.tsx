import React from "react";

const PortfolioTemplateTwoAboutMe = () => {
  return (
    <section className="py-8 lg:py--60 px-5 md:px-10 flex flex-col gap-10">
      {/* Boxes stacked vertically */}
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white w-full h-40 sm:h-52 md:h-72 lg:h-92"
          ></div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="font-bold text-xl lg:text-3xl text-white">
          ABOUT
          <span className="text-yellowGold"> ME</span>
        </h2>
        <div className="text-white w-full h-18">
          <h2
            className="font-bold"
            style={{ fontFamily: "Instrument Sans, sans-serif" }}
          >
            Creative and detail-oriented Graphic Designer with [X] years of
            experience in brand identity, social media design, and marketing
            visuals. Adept at transforming concepts into compelling visuals that
            enhance brand presence. Proficient in Adobe Creative Suite, Canva,
            and Figma, with a strong understanding of design principles and user
            experience. Passionate about delivering high-quality designs that
            resonate with audiences and drive engagement.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default PortfolioTemplateTwoAboutMe;
