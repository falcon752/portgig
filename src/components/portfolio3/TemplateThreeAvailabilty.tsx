import React from "react";

const PortfolioTemplateThreeAvailability = () => {
  return (
    <section className="px-5 lg:px-12 py-20 bg-black space-y-16">
      
      {/* AVAILABILITY */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-2xl font-bold text-white">
          Availability
        </h2>

        <div className="border border-cyan-400 rounded-xl px-6 py-8 lg:px-10 lg:py-10 bg-gradient-to-br from-[#0d0d0d] to-[#151515]">
          <p className="text-sm md:text-lg lg:text-xl text-white text-center leading-relaxed">
            Available for all kind of gigs, projects, jobs, collaboration, kindly
            reach out to me. Looking forward to working with you.
          </p>
        </div>
      </div>

      {/* WHAT YOU GET */}
      <div className="space-y-4">
        <h2 className="text-lg lg:text-2xl font-bold text-white">
          What you get working <span className="text-cyan-400">with me</span>
        </h2>

        <div className="border border-cyan-400 rounded-xl px-6 py-8 lg:px-10 lg:py-10 bg-gradient-to-br from-[#0d0d0d] to-[#151515]">
          <p className="text-sm md:text-lg lg:text-xl text-white text-center leading-relaxed">
            Clean code, modern UI/UX, performance-optimized applications,
            effective communication, and reliable project delivery from start
            to finish.
          </p>
        </div>
      </div>

    </section>
  );
};

export default PortfolioTemplateThreeAvailability;
