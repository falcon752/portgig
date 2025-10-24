import {
  started,
  Forcreatives,
  clients,
  account,
  payment,
  contact,
} from "@/src/constants";
import React from "react";

const PrivatePolicy = () => {
  return (
    <main className="text-black  my-10">
      <div className="bg-gray200 center-flexCol py-7">
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black font-inter">
          Help Center
        </h2>
        <h2 className="text-xs md:text-sm lg:text-lg font-inter pt-3">
          Home <span className="text-[#0851A3]"> &gt; Help Center</span>
        </h2>
      </div>
      <div className="flex flex-col gap-10 py-10 bodyMargin">
        <p className="text-xs sm:text-sm lg:text-lg text-[#0A1754] font-raleway">
          Need help? You’re in the right place. Browse popular topics or chat
          with us directly.
        </p>
        {/* 1 */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-raleway font-bold text-[#0A1754]">
            Getting Started
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {started.map((text, index) => (
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
            For Creatives
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {Forcreatives.map((text, index) => (
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
            For Clients
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {clients.map((text, index) => (
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
            Account & Settings
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {account.map((text, index) => (
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
            Payments & Earnings
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {payment.map((text, index) => (
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
            Contact Support
          </h2>
          <ul className="list-disc pl-4 space-y-2 text-xs md:tex-sm lg:text-2xl font-raleway font-normal text-[#0A1754]">
            {contact.map((text, index) => (
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
