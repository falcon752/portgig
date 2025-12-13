import Image from "next/image";
import React from "react";

const PortfolioTemplateOneHero = () => {
  return (
    <>
      {/* MOBILE – image on top, text below */}
      <section className="lg:hidden bg-black px-6 pt-6 pb-14">
        {/* Image */}
        <div className="w-full h-[300px] rounded-2xl overflow-hidden mb-6">
          <Image
            src="/assets/template1.png"
            alt="Designer"
            width={640}
            height={420}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-3xl font-bold">Gracier Aftang</h1>

          <p className="text-purple-500 text-base leading-relaxed">
            Creative Graphic & UI/UX Designer{" "}
            <span className="sm:block lg:inline">
              Crafting Engaging Digital Experiences
            </span>
          </p>
        </div>
      </section>

      {/* DESKTOP */}
      <section className="hidden lg:flex bg-black items-start pt-8 pb-20 px-8">
        <div className="flex gap-24">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-[640px] h-[420px] rounded-2xl overflow-hidden">
              <Image
                src="/assets/template1.png"
                alt="Designer"
                width={640}
                height={420}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-3 mt-[150px]">
            <h1 className="text-white text-4xl font-bold">Gracier Aftang</h1>

            <p className="text-purple-500 text-lg max-w-md leading-relaxed">
              Creative Graphic & UI/UX Designer
              <br />
              Crafting Engaging Digital Experiences
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioTemplateOneHero;
