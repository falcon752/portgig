"use client";

import { creativeProcess, recruiterProcess } from "@/src/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegSquareCheck } from "react-icons/fa6";
import Buttons from "../Buttons";

const HowToSection = () => {
  const router = useRouter();

  return (
    <section className="w-full my-10">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6 font-raleway">

        {/* Header */}
        <div className="h-15 bg-linear-gradient w-full flex justify-center items-center">
          <h2 className="text-base md:text-2xl lg:text-4xl font-black text-white">
            How it works?
          </h2>
        </div>

        {/* Creatives & Recruiters */}
        <div className="flex flex-col lg:flex-row gap-6 justify-evenly">
          {/* Creatives */}
          <div className="flex flex-col">
            <h2 className="text-textColor text-base md:text-xl lg:text-3xl font-black mt-5 text-center lg:mb-2">
              For Creatives
            </h2>
            <div className="bg-[#001834] md:bg-primary py-8 md:py-10 lg:py-10 px-5 rounded-lg h-fit shadow-xl">
              <ul>
                {creativeProcess.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 mb-2">
                    <FaRegSquareCheck className="text-white" />
                    <p className="text-[10px] md:text-base lg:text-lg font-bold leading-10 text-white">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recruiters */}
          <div className="flex flex-col">
            <h2 className="text-textColor text-base md:text-xl lg:text-3xl font-black mt-5 text-center lg:mb-2">
              For Recruiters
            </h2>
            <div className="bg-[#001834] md:bg-primary py-8 md:py-10 lg:py-10 px-5 rounded-lg h-full shadow-xl">
              <ul>
                {recruiterProcess.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 mb-2">
                    <FaRegSquareCheck className="text-white" />
                    <p className="text-[10px] md:text-base lg:text-lg font-bold leading-10 text-white">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Banner */}
        <div className="md:hidden flex flex-col gap-6 justify-center items-center mt-10">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-base sm:text-xl font-black text-textColor text-center">
              Create your portfolio
            </h2>
            <Buttons
              label="Get started"
              className="bg-primary text-white font-medium rounded-md shadow-md text-sm py-2 px-5 w-fit"
              onClick={() => router.push("/sign-up")}
            />
          </div>

          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-base sm:text-xl font-black text-textColor text-center">
              Hire creatives
            </h2>
            <Buttons
              label="Get started"
              className="bg-primary text-white font-medium rounded-md shadow-md text-sm py-2 px-5 w-fit"
              onClick={() => router.push("/sign-up")}
            />
          </div>

          <div className="flex justify-center items-center mt-5">
            <Image
              src="/assets/Ellipse-woman.png"
              alt="Ellipse-woman"
              width={151}
              height={177}
              className="object-fill"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowToSection;
