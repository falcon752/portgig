"use client";
import Buttons from "@/src/components/Buttons";
import Image from "next/image";
import Link from "next/link";

const whatYouCando = [
  "Explore portfolios – Browse top-tier creatives in various industries.",
  "Post job listings – Find the perfect fit for your next project.",
  "Connect & hire – Chat with creatives and build your dream team.",
];

const RecruiterOnboarding = () => {
  return (
    <main className="w-full">
      <div className="self-start pb-7 sm:pb-30">
        <Link href="/">
          <Image
            src="/assets/portgig-2.svg"
            alt="Portgig Logo"
            width={120}
            height={120}
            className="w-[100px] sm:w-[120px] h-auto lg:hidden"
          />
        </Link>
      </div>
      <div className="w-full h-full flex flex-col gap-2 lg:gap-10 justify-center items-center max-lg:bg-white max-lg:text-primary lg:mx-3 md:mx-10 rounded-3xl px-5 md:px-10 py-10 lg:w-12/12 ">
        <h2 className="text-3xl lg:text-5xl text-center font-ramaraja font-normal">
          Welcome to PortGig
        </h2>
        <p className="text-center font-raleway font-bold text-xs lg:text-xl">
          You&apos;re all set to discover and hire top creative professionals.
        </p>
        <p className="self-start text-sm md:text-xl lg:text-2xl font-bold font-raleway">
          Here’s what you can do next:
        </p>
        <ul className="leading-10 text-sm gap-10 md:text-xl lg:text-2xl font-bold">
          {whatYouCando.map((item) => (
            <li
              key={item}
              className="self-start flex items-baseline font-raleway py-2"
            >
              {item}
            </li>
          ))}
        </ul>
        <Link href="recruiter-homepage">
          <Buttons
            label="Go to Dashboard"
            className="max-lg:bg-primary py-5 max-lg:text-white lg:bg-white lg:text-primary font-normal rounded-lg px-15! sm:text-xl font-inter"
          />
        </Link>
      </div>
    </main>
  );
};

export default RecruiterOnboarding;
