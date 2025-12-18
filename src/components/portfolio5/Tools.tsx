import React from "react";

const tools = [
  "Canva",
  "Capcut",
  "Buffer",
  "Microsoft 360",
  "Lots more..",
];

const Tools = () => {
  return (
    <section className="bg-[#f9f9f9] px-6 py-12">
      {/* Section Title */}
      <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-8 text-center">
        Tools I Use
      </h3>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="
              bg-white
              border
              border-[#7fd3f7]
              rounded-lg
              px-6
              py-5
              text-sm
              md:text-base
              text-gray-700
              font-bold
              leading-relaxed
              flex
              items-center
              justify-center
              min-h-[96px]
            "
          >
            {tool}
          </div>
        ))}
      </div>

      {/* Why Work With Me */}
      <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-6 mt-16 text-center">
        Why You Should Work With Me
      </h3>
      <div className="bg-white border border-[#7fd3f7] font-semibold rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed">
        <p>
          As a passionate and detail-oriented photographer, I bring creativity,
          precision, and storytelling into every shot. Whether it’s capturing the
          essence of a brand, the emotions of an event, or the artistry of a
          product, I ensure every image tells a compelling story. With expertise
          in high-quality editing, lighting, and composition, I deliver visuals
          that stand out. My commitment to professionalism, quick turnaround,
          and client satisfaction makes me the ideal choice for your photography
          needs. Let’s create something amazing together!
        </p>
      </div>
    </section>
  );
};

export default Tools;
