import React from "react";

export default function MoreWork() {
  return (
    <div className="bg-black text-white py-20 px-6">

      {/* Title */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#FCC92F] mb-20">
        MORE OF MY WORK/EVENTS
      </h2>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
        {[
          "Corporate Events",
          "Convocations",
          "Corporate Events",
          "Convocations",
        ].map((title, index) => (
          <div key={index} className="flex flex-col items-center gap-6">

            {/* Dark pill */}
            <div className="w-full max-w-md py-4 text-center rounded-md border border-[#FCC92F] bg-[#1E1E1E] text-lg font-semibold">
              {title}
            </div>

            {/* Button */}
            <button className="bg-[#F6CF5A] text-black font-semibold px-10 py-4 rounded-md hover:bg-yellow-500 transition">
              View more on google drive
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
