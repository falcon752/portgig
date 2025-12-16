import React from "react";
import { Buttons } from "../export_components";

const PortfolioTemplateTwoPortfolio = () => {
  return (
    <>
      <section className="flex flex-col gap-8 md:gap-10 py-8 md:py-14 lg:py-20 px-4 md:px-10">
        {/* Heading aligned to start */}
        <h2 className="font-next text-xl md:text-3xl mb-8 font-normal text-white">
          My <span className="text-gold">Portfolio</span>
        </h2>

        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5 md:gap-8 lg:gap-40">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2 md:gap-3 lg:gap-5">
              <div className="bg-gray100 flex flex-col gap-5 h-56 sm:h-64 md:h-72 lg:h-96 center rounded-sm">
                <p className="text-black uppercase font-black text-xs sm:text-sm md:text-base lg:text-lg text-center px-4 sm:px-6 md:px-10">
                  Paste youtube/Instagram link
                </p>
              </div>
              {/* Product shoot button background changed to white */}
              <div className="bg-white center py-2 md:py-2.5 font-bold uppercase text-black text-xs sm:text-sm md:text-base rounded-sm">
                Product shoot
              </div>
            </div>
          ))}
        </div>

        <Buttons
          label="View more"
          className="rounded-none text-black font-bold w-fit px-10 sm:px-12 md:px-16 lg:px-20 py-2 md:py-2.5 mt-8 md:mt-12 lg:mt-20 self-center sm:self-start text-sm md:text-base"
        />

        <div className="mt-14">
          {/* Header like TOOLS */}
          <h2 className="font-next text-xl md:text-3xl mb-6 font-normal text-white">
            Open to <span className="text-gold">all kinds of gigs</span>
          </h2>

          {/* List like TOOLS */}
          <ul className="space-y-4 md:space-y-5 list-disc list-inside text-sm md:text-base lg:text-xl font-instrument font-bold text-white leading-relaxed md:leading-loose">
            <li>Projects</li>
            <li>One off Gigs</li>
            <li>Freelancing</li>
            <li>Collaborations</li>
          </ul>
        </div>

        <div className="flex flex-col gap-5 mt-8 md:mt-12 lg:mt-20">
          {/* Heading like About */}
          <h2 className="font-bold text-xl md:text-3xl text-white">
            WHY YOU <span className="text-gold">SHOULD WORK WITH ME</span>
          </h2>

          {/* Paragraph styled like About */}
          <div className="text-white w-full">
            <h2
              className="font-bold text-sm md:text-base lg:text-lg leading-relaxed"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              As a passionate and detail-oriented photographer, I bring
              creativity, precision, and storytelling into every shot. Whether
              it's capturing the essence of a brand, the emotions of an event,
              or the artistry of a product, I ensure every image tells a
              compelling story. With expertise in high-quality editing,
              lighting, and composition, I deliver visuals that stand out. My
              commitment to professionalism, quick turnaround, and client
              satisfaction makes me the ideal choice for your photography needs.
              Let's create something amazing together!
            </h2>
          </div>
        </div>
      </section>

      <section className="center py-6 md:py-8 lg:py-10">
        <p className="text-center font-bold text-sm md:text-base lg:text-xl px-4 sm:px-6 md:px-8 lg:px-30 text-white">
          Looking forward to working with you
        </p>
      </section>
    </>
  );
};

export default PortfolioTemplateTwoPortfolio;
