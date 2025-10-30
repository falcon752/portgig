import React from "react";
import Image from "next/image";

const JobHero = () => {
  return (
    <section className="w-full flex justify-center my-5">
      <div className="w-[90%] md:w-[85%] lg:w-[80%] bg-primary text-white rounded-2xl h-fit gap-5">
        <div className="flex flex-col md:flex-row h-full">
          <div className="flex flex-col gap-3 justify-center w-full p-8 md:p-12">
            <h2 className="text-lg font-bold text-white">Find Your Dream Job</h2>
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-white">
              Land Your Next Opportunity
            </h2>
            <p className="text-xs md:text-sm text-white max-w-md">
              Discover job openings tailored to your skills and industry. Apply
              seamlessly and connect with top recruiters today!
            </p>
          </div>

          <div className="w-full flex justify-end items-end max-md:hidden">
            <Image
              src="/assets/newjob.svg"
              alt="creativehero"
              width={400}
              height={400}
              className="object-contain rounded-br-2xl h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobHero;
