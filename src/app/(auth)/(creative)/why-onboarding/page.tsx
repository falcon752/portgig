"use client";

import Buttons from "@/src/components/Buttons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"; 

const creativeFeatures = [
  "Create a Stunning Portfolio – Professionally designed templates tailored to your field.",
  "Get Discovered – Connect with recruiters and clients actively looking for creative talent.",
  "Find Gigs & Jobs – Access exclusive job listings in the creative industry.",
  "Join a Thriving Community – Network with like-minded professionals and grow together",
];

const recruiterFeatures = [
  "Access Top Creative Talent – Browse through professionally curated portfolios.",
  "Streamlined Hiring – Post jobs and connect with qualified creatives instantly.",
  "Quality Assurance – Review detailed portfolios and past work samples.",
  "Efficient Management – Track applications and manage your hiring process seamlessly.",
];

const WhyOnboardingContent = () => {
  const searchParams = useSearchParams();
  const userType = searchParams.get("type");
  const features =
    userType === "recruiter" ? recruiterFeatures : creativeFeatures;
  const dashboardUrl =
    userType === "recruiter" ? "/recruiter-sign-in" : "sign-in";

  return (
    <main className=" ">
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
      <div className="h-full flex flex-col gap-10 lg:gap-10 justify-center items-center max-lg:bg-white max-lg:text-primary mx-3 md:mx-10 rounded-3xl px-5 md:px-10 py-20 xl:w-8/12 lg:mx-auto">
        <h2 className="font-normal text-2xl md:text-3xl lg:text-6xl text-center font-ramaraja">
          Why Portgig?
        </h2>
        <ul className="leading-10 text-sm md:text-2xl gap-20 font-bold space-y-10">
          {features.map((item) => (
            <li
              key={item}
              className="self-start flex items-baseline gap-5 font-raleway"
            >
              {item}
            </li>
          ))}
        </ul>
        <Link href={dashboardUrl}>
          <Buttons
            label="Get Started"
            className="max-lg:bg-primary max-lg:text-white lg:text-primary lg:bg-white rounded-sm px-15! sm:text-xl font-inter py-4"
          />
        </Link>
      </div>
    </main>
  );
};

export default function WhyOnboarding() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      {/* Wrap with Suspense */}
      <WhyOnboardingContent />
    </Suspense>
  );
}
