import React from "react";

const tools = [
  "Canva",
  "Capcut",
  "Capcut",
  "Buffer",
  "Microsoft 360",
  "Lots more..",
];

const Tools = () => {
  return (
    <div className="bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-8 sm:ml-10 md:ml-12 lg:ml-16">
          Tools I use
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl sm:ml-10 md:ml-12 lg:ml-16">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-[#FFBA00] text-black text-base sm:text-lg lg:text-xl font-bold py-4 sm:py-5 lg:py-6 px-3 sm:px-4 rounded text-center shadow-md"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>

      <h3 className="max-w-5xl mx-auto text-white text-lg sm:text-xl md:text-4xl font-bold mb-4 mt-16">
        Why you should work with me
      </h3>
      <div className="bg-[#2B2B2B] px-10 py-10 rounded-lg text-center max-w-5xl mx-auto">
        <p className="text-white text-sm lg:text-xl font-normal leading-relaxed">
          As a passionate and detail-oriented photographer, I bring creativity,
          precision, and storytelling into every shot. Whether it&rsquo;s capturing
          the essence of a brand, the emotions of an event, or the artistry of a
          product, I ensure every image tells a compelling story. With expertise
          in high-quality editing, lighting, and composition, I deliver visuals
          that stand out. My commitment to professionalism, quick turnaround,
          and client satisfaction makes me the ideal choice for your photography
          needs. Let&rsquo;s create something amazing together!
        </p>
      </div>
    </div>
  );
};

export default Tools;