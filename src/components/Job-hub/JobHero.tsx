import React from 'react'
import Image from "next/image";
const JobHero = () => {
  return (
    <section className="bodyMargin  h-fit bg-primary my-5 rounded-2xl gap-5 text-white">
      <div className=" h-full flex ">
        <div className=" flex flex-col gap-3 justify-center w-full p-15 ">
          <h2 className="text-lg -ml-8 font-bold text-white">Find Your Dream Job</h2>
          <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-white">
            Land Your Next Opportunity
          </h2>
          <p className="text-xs text-white">
            Discover job openings tailored to your skills and industry. Apply
            seamlessly and connect with top recruiters today!
          </p>
        </div>
        <div className=" w-full flex justify-end items-end max-md:hidden ">
          <Image
            src="/assets/newjob.svg"
            alt="creativehero"
            width={400}
            height={400}
            className="object-contain rounded-br-2xl  h-full"
          />
        </div>
      </div>
    </section>
  );
}

export default JobHero

