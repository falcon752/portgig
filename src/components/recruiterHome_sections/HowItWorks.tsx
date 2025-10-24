"use client";

import Image from "next/image";
import Link from "next/link";
import Buttons from "../Buttons";

const HowItWorks = () => {
  return (
    <section className="flex flex-col gap-1 my-1 lg:gap-5 lg:my-5">
      <div className="bodyMargin h-15">
        <h2 className="text-base md:text-3xl lg:text-4xl text-white w-42 md:w-60 font-bold font-urbanist lg:w-md bg-[#00489A] px-4 py-2 rounded">
          How it works?
        </h2>
      </div>

      <div className="bodyMargin flex flex-col md:flex-row">
        <div className="text-primary text-center text-[10px] lg:text-xl font-black flex flex-col items-center justify-center gap-3 font-raleway lg:pl-10 order-1 md:order-0">
          <h2>Step 1: Post a Job – Create job listings in minutes.</h2>
          <h2>
            Step 2: Explore Talent – Browse creative profiles and portfolios.
          </h2>
          <h2>
            Step 3: Connect & Hire – Check out Cv/ Portfolio and hire top
            talent.
          </h2>
          <h2>
            Step 4: Manage & Track – Keep your hiring organized in one place.
          </h2>
        </div>

        <div className="w-full flex justify-center items-center order-2 md:order-0 mt-0">
          <Image
            src="/assets/questionmark.svg"
            alt="creativehero"
            width={400}
            height={400}
            className="object-contain rounded-br-2xl w-[200px] md:w-[400px]"
          />
        </div>
      </div>

      <div className="bodyMargin flex bg-primary lg:pl-10 font-raleway">
        <div className="text-white text-lg lg:text-4xl font-black flex flex-col items-center justify-center gap-5 p-5 font-raleway">
          <h4 className="text-sm lg:text-3xl font-black">
            Streamline Your Hiring – All in One Place
          </h4>
          <p className="text-white text-xs lg:text-2xl font-bold flex flex-col items-center justify-center gap-5 p-5 font-raleway">
            Manage job listings, track applications, and communicate with
            candidates effortlessly.
          </p>
        </div>
        <div className="w-full flex justify-center items-center">
          <Image
            src="/assets/newjob.svg"
            alt="creativehero"
            width={400}
            height={400}
            className="object-contain rounded-br-2xl"
          />
        </div>
      </div>

      <div className="bodyMargin flex justify-end my-3">
        <Link href="/recruiter-dashboard">
          <Buttons
            label="Go to dashbaord"
            className="bg-primary! lg:text-xl font-bold w-fit text-white rounded-lg py-3"
          />
        </Link>
      </div>

      <div className="mx-3">
        <div className="bodyMargin">
          <p className="text-base md:text-3xl lg:text-4xl font-black text-white w-full lg:w-2xl bg-[#00489A] px-4 py-4 lg:py-2 rounded">
            Need Help Finding the right Talent?
          </p>
        </div>
      </div>

      <div className="bg-white md:flex gap-10 bodyMargin lg:bg-primary mb-5 p-8 rounded-2xl text-[#0A1754] lg:text-white font-raleway">
        <div className="flex flex-col gap-5 lg:gap-15">
          <div className="flex flex-row md:block gap-3 -mt-3 md:mt-0">
            <p className="font-bold py-2 md:py-4 font-raleway text-[10px] lg:text-xl flex-1">
              Finding the perfect creative professional can be overwhelming, but
              we make it simple. Whether you need a graphic designer, writer,
              video editor, or marketing expert, we&apos;ll help you connect
              with the right talent for your project.
            </p>

            <div className="shrink-0 w-32 sm:w-40 md:hidden -mt-4">
              <Image
                src="/assets/female.png"
                alt="Creative professional"
                width={160}
                height={180}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-xl sm:text-3xl md:text-3xl lg:text-5xl font-black">
              How We Can Help?
            </h2>

            <div className="flex flex-row md:flex-col gap-3 md:gap-3">
              <div className="flex flex-col gap-2 md:gap-3 flex-1">
                <p className="font-semibold text-[10px] md:text-base">
                  ✅ Personalized Talent Matching – Get recommendations based on
                  your needs.
                </p>
                <p className="font-semibold text-xs md:text-base">
                  ✅ Verified Professionals – Work with pre-screened creatives
                  you can trust.
                </p>
                <p className="font-semibold text-xs md:text-base">
                  ✅ Effortless Hiring Process – Post jobs, review portfolios,
                  and hire seamlessly.
                </p>
                <p className="font-semibold text-xs md:text-base">
                  ✅ Dedicated Support – Our team is here to guide you every
                  step of the way.
                </p>
              </div>

              <div className="shrink-0 w-32 sm:w-40 hidden">
                <Image
                  src="/assets/two-women.png"
                  alt="Discover more creatives"
                  width={160}
                  height={180}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-md:hidden h-96 w-full">
          <Image
            src="/assets/two-women.png"
            alt="Discover more creatives"
            width={500}
            height={450}
          />
        </div>
      </div>

      <div className="h-10 bg-white w-full flex justify-center items-center md:bg-transparent md:shadow-none">
        <div className="bg-[#0A1754] lg:bg-white shadow-lg px-4 py-3 md:bg-transparent md:shadow-none md:px-0 md:py-0 md:rounded-none max-lg:mb-3">
          <h2 className="text-sm sm:text-xl font-black text-center text-white lg:text-primary">
            Contact us at hiretalents@portgig.com to get started!
          </h2>
        </div>
      </div>
{/* Last Image Centered */}
<div className="w-full flex justify-center items-center my-5">
  <Link
    href="https://phythealth.com"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <Image
      src="/assets/recruiter.png"
      alt="Community Illustration"
      width={1200}
      height={600}
      className="w-full max-w-7xl sm:max-w-full md:max-w-5xl lg:max-w-7xl h-auto object-cover cursor-pointer"
      priority
    />
  </Link>
</div>


    </section>
  );
};

export default HowItWorks;
