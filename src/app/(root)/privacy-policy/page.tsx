import {
  infoCollection,
  information,
  DataSharing,
  YourRights,
  Cookies,
  Security,
  ChangesInPolicy,
} from "@/src/constants";
import React from "react";

const PrivatePolicy = () => {
  return (
    <main className="text-black  my-10">
      <div className="bg-gray200 center-flexCol py-7">
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black font-inter">
          Private Policy
        </h2>
        <h2 className="text-xs md:text-sm lg:text-lg font-inter">
          Home <span className="text-[#0851A3]"> &gt; Private Policy</span>
        </h2>
      </div>
      <div className="flex flex-col gap-10 py-10 bodyMargin">
        <p className="text-xs sm:text-sm lg:text-lg text-[#0A1754] font-raleway">
          Welcome to Portgig! Your privacy is important to us. This Privacy
          Policy outlines how we collect, use, store, and protect your personal
          information when you use our platform.
        </p>
        {/* 1 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Information We Collect
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {infoCollection.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* 2 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {information.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* 3 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Data Sharing and Third Parties
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {DataSharing.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* 4 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Your Rights
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {YourRights.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* 5 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Cookies & Tracking
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {Cookies.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* 6 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Security
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {Security.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* 7 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Changes to This Policy
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {ChangesInPolicy.map((text, index) => (
              <li key={index}>
                {" "}
                <p className="text-xs md:tex-sm lg:text-2xl font-raleway font-normal">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default PrivatePolicy;
