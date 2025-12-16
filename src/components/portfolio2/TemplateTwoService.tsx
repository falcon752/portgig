import React from "react";

const PortfolioTemplateTwoService = () => {
  return (
    <section className="bg-black py-12 px-4 md:px-10 text-white">
      {/* Headings */}
      <h2 className="font-next text-xl md:text-3xl mb-8 font-normal">
        MY <span className="text-yellowGold">SERVICES</span>
      </h2>

      {/* Services List */}
      <ul className="space-y-4 md:space-y-5 list-disc list-inside text-sm md:text-base font-instrument font-bold leading-relaxed md:leading-loose">
        <li>Camera Operation & Cinematography</li>
        <li>Lighting & Composition</li>
        <li>Audio Recording & Mixing</li>
        <li>Drone Videography</li>
      </ul>

      <h2 className="font-next text-xl md:text-3xl mt-14 mb-6 text-yellowGold font-normal">
        TOOLS
      </h2>

      {/* Tools List */}
      <ul className="space-y-4 md:space-y-5 list-disc list-inside text-sm md:text-base font-instrument font-bold leading-relaxed md:leading-loose">
        <li>Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve</li>
        <li>Color Grading & Correction</li>
        <li>Motion Graphics & VFX</li>
        <li>Audio Enhancement & Sound Design</li>
        <li>Video Compression & Optimization</li>
      </ul>
    </section>
  );
};

export default PortfolioTemplateTwoService;
