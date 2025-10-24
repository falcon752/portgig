import React from "react";

export default function Jobs() {
  return (
    <div className="bg-black text-white py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-2">Jobs</h2>
          <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-[#FFBA00] mb-8 md:mb-10 lg:mb-12">
            OPEN TO ALL KINDS OF GIGS
          </h3>
        </div>

        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="mb-4 md:mb-5 lg:mb-6">
            <h4 className="text-lg md:text-xl lg:text-3xl font-bold mb-3">Projects</h4>
          </div>

          <div className="mb-4 md:mb-5 lg:mb-6">
            <h4 className="text-lg md:text-xl lg:text-3xl font-bold mb-3">One off Gigs</h4>
          </div>

          <div className="mb-4 md:mb-5 lg:mb-6">
            <h4 className="text-lg md:text-xl lg:text-3xl font-bold mb-3">Freelancing</h4>
          </div>

          <div className="mb-8 md:mb-10 lg:mb-12">
            <h4 className="text-lg md:text-xl lg:text-3xl font-bold mb-3">
              Collaborations
            </h4>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-base md:text-xl lg:text-4xl mb-6 md:mb-8 mt-10 md:mt-12 lg:mt-16 font-bold text-[#FFBA00] px-4">
            WHY YOU SHOULD WORK WITH ME
          </h3>

          {/* Why Work With Me */}
          <div className="bg-[#2B2B2B] px-5 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 rounded-lg text-center max-w-5xl mx-auto">
            <p className="text-white text-sm md:text-base lg:text-xl font-normal leading-relaxed">
              As a passionate and detail-oriented photographer, I bring
              creativity, precision, and storytelling into every shot. Whether
              it&apos;s capturing the essence of a brand, the emotions of an event,
              or the artistry of a product, I ensure every image tells a
              compelling story. With expertise in high-quality editing,
              lighting, and composition, I deliver visuals that stand out. My
              commitment to professionalism, quick turnaround, and client
              satisfaction makes me the ideal choice for your photography needs.
              Let&apos;s create something amazing together!
            </p>
          </div>
          <p className="text-base md:text-xl lg:text-3xl font-bold font-lateef pt-4 md:pt-6 px-4">
            Looking forward to working with you
          </p>
        </div>
      </div>
    </div>
  );
}   