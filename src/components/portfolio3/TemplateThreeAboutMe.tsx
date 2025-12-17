import React from "react";
import Image from "next/image";

const PortfolioTemplateThreeAboutMe = () => {
  return (
    <section className="px-5 lg:px-12 py-16 flex flex-col gap-10 bg-black">
      
      {/* ABOUT ME */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">
          About Me
        </h2>

        <div className="border border-cyan-400 rounded-xl px-6 py-6 lg:px-10 lg:py-8 text-sm lg:text-lg text-center text-white leading-relaxed bg-[#0d0d0d]">
          I’m a passionate Web Developer & UI/UX Designer dedicated to building
          visually stunning and high-performing websites and applications. With
          expertise in front-end and full-stack development, I specialize in
          crafting user-friendly digital experiences using modern technologies
          like React, Vue, and CMS platforms.
        </div>
      </div>

      {/* SERVICES */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
          Services I <span className="text-cyan-400">Offer</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border border-cyan-400 rounded-xl bg-[#0d0d0d] px-8 py-10 flex flex-col items-center gap-4 text-center"
            >
              <Image
                src="/assets/square-logo.svg"
                alt="service icon"
                width={40}
                height={40}
              />
              <h3 className="text-cyan-400 font-bold text-lg">
                Website & App
              </h3>
              <p className="text-xs lg:text-sm text-gray-300">
                I build responsive and high-performance web applications using
                modern front-end frameworks for seamless user interaction.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
          Skills / <span className="text-cyan-400">Language</span>
        </h2>

        <div className="flex flex-col gap-4">
          {["CSS", "JavaScript", "React", "Figma", "WordPress"].map(
            (skill, index) => (
              <div
                key={index}
                className="border border-cyan-400 rounded-md px-6 py-3 text-white bg-[#0d0d0d]"
              >
                {skill}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioTemplateThreeAboutMe;
