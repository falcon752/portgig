import React from "react";

export default function Jobs() {
  return (
    <div className="bg-black text-white py-24 px-6">

      {/* OPEN TO ALL KINDS OF GIGS */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#FCC92F] mb-16">
        OPEN TO ALL KINDS OF GIGS
      </h2>

      {/* Pills container */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-32">
        {["Projects", "Gigs", "Full time role", "Freelancing"].map(
          (item, index) => (
            <div
              key={index}
              className="
                text-center px-4 py-4 rounded-md border border-[#FCC92F] bg-[#1E1E1E] text-sm sm:text-base font-medium
                w-full
              "
            >
              {item}
            </div>
          )
        )}
      </div>

      {/* WHY YOU SHOULD WORK WITH ME */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#FCC92F] mb-10">
        WHY YOU SHOULD WORK WITH ME
      </h2>

      <p className="max-w-4xl mx-auto text-center text-sm md:text-base leading-relaxed text-gray-200">
        As a passionate and detail-oriented photographer, I bring creativity,
        precision, and storytelling into every shot. Whether it’s capturing the
        essence of a brand, the emotions of an event, or the artistry of a
        product, I ensure every image tells a compelling story. With expertise
        in high-quality editing, lighting, and composition, I deliver visuals
        that stand out. My commitment to professionalism, quick turnaround, and
        client satisfaction makes me the ideal choice for your photography
        needs. Let’s create something amazing together!
      </p>

      <p className="text-center text-lg md:text-xl font-semibold mt-10 text-gray-300">
        Looking forward to working with you
      </p>
    </div>
  );
}
