import React from "react";
import Image from "next/image";
const PortfolioTemplateThreeAboutMe = () => {
  return (
    <section className="lg:py-20 px-5 lg:px-10 flex flex-col gap-5">
      <h2 className="text-lg lg:text-2xl font-bold text-white">
        About <span className="text-yellow">Me</span>
      </h2>
      <div className="bg-lightBrown py-2 px-5 text-xs md:text-sm lg:text-2xl font-normal font-lalezar text-white">
        <p>
          I’m a passionate Web Developer & UI/UX Designer dedicated to building
          visually stunning and high-performing websites and applications. With
          expertise in front-end and full-stack development, I specialize in
          crafting user-friendly digital experiences using modern technologies
          like React, Vue, and CMS platforms. Whether it’s designing sleek
          interfaces, optimizing website performance, or developing custom
          solutions,
        </p>
      </div>
      <h2 className="text-lg lg:text-2xl font-bold text-white">
        Service I <span className="text-yellow">Offer</span>
      </h2>
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-bb w-full flex flex-col items-center px-10 py-10 gap-3">
            <Image
              src={"/assets/square-logo.svg"}
              alt="squre logo"
              width={30}
              height={30}
            />
            <h2 className="font-bold font-lalezar text-white">Website & App</h2>
            <p className="text-center font-bold text-xs text-white">
              I build responsive and high-performance web applications using
              modern front-end frameworks for seamless user interaction.
            </p>
          </div>
        ))}
      </div>
      <h2 className="text-lg lg:text-2xl font-bold text-white">
        Skills/ <span className="text-yellow">Languages</span>
      </h2>
      <div className="flex ">
        <div className="px-5 py-5 space-y-3 ">
          {Array.from({ length: 6 }).map((skill, index) => (
            <div key={index} className="gap-3">
              <Image
                src={"/assets/arrow.svg"}
                alt="arrow icon"
                width={30}
                height={30}
              />
            </div>
          ))}
        </div>
        <div className="w-full px-5 py-5 space-y-3 font-bold text-black text-xl font-lalezar bg-yellow lg:w-150">
          {["CSS", "JavaScript", "React", "Figma", "Html", "WordPress"].map(
            (skill, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <span className=" w-full">{skill}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioTemplateThreeAboutMe;