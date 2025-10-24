"use client";
import React, { useState } from "react";
import Image from "next/image";
import { creatives } from "@/src/constants";
import { IoIosArrowForward } from "react-icons/io";
import Buttons from "@/src/components/Buttons";
const ShortlistedCandidate = () => {
  const creativesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCreative, setSelectedCreative] = useState(creatives[0]);
  const totalPages = Math.ceil(creatives.length / creativesPerPage);

  const startIndex = currentPage * creativesPerPage;
  const endIndex = startIndex + creativesPerPage;
  const currentCreatives = creatives.slice(startIndex, endIndex);
  return (
    <main className="flex flex-col gap-5 my-10 font-raleway">
      <div className="flex justify-between items-center">
        <h2 className="subHeading text-primary">Dashboard</h2>
        <Image
          src={"/assets/creativeImage.svg"}
          alt="recruiter profile"
          width={150}
          height={150}
        />
      </div>
      <div className="flex justify-between items-center text-sm md:text-xl lg:text-2xl">
        <h2 className=" text-primary  font-bold">
          Graphics Designer Application
        </h2>
        <div>
          {" "}
          <h2 className=" text-primary  font-bold">Shortlisted Talents (50)</h2>
        </div>
      </div>
      <hr className="border-t border-black" />
      {/* creatives */}
      <div className="flex gap-5">
        {/* first div */}
        <div className="flex-1/2 flex flex-col gap-5">
          {" "}
          {currentCreatives.map((creative) => (
            <div
              key={creative.id}
              onClick={() => setSelectedCreative(creative)}
              className="relative p-2 bg-gray100 rounded-lg cursor-pointer hover:bg-gray200">
              <div className="absolute bg-secondary text-white text-sm px-5 py-1 -top-2 right-5 font-ramaraja">
                {creative.level}
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src={creative.creativeImage}
                  alt={creative.name}
                  width={100}
                  height={100}
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-primary">
                    {creative.name} ({creative.username})
                  </h2>
                  <h2 className="text-[10px] text-primary">
                    {creative.field}/{creative.location}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 2nd div */}
        <div className="flex-1/2 flex flex-col gap-2 max-md:hidden">
          <div className="bg-primary text-white w-fit  px-5 py-2">
            Candidate Information
          </div>
          <div className="bg-gray100  flex flex-col gap-5 pb-5 rounded-lg">
            <div className="flex items-center gap-3">
              <Image
                src={selectedCreative.creativeImage}
                alt={selectedCreative.name}
                width={100}
                height={100}
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-primary">
                  {selectedCreative.name} ({selectedCreative.username})
                </h2>
                <h2 className="text-[10px] text-primary">
                  {selectedCreative.field}/{selectedCreative.location}
                </h2>
              </div>
            </div>
            <hr className="border-t-4 border-primary" />
            <p className="pl-10">
              <strong>Email:</strong> {selectedCreative.email}
            </p>
            <hr className="border-t-2 border-primary" />
            <div className="flex justify-between px-10">
              <Buttons
                className="bg-primary! rounded-sm text-white"
                label="View Profile"
                onClick={() => {}}
              />
              <Buttons
                className="bg-primary! rounded-sm text-white"
                label="View CV"
                onClick={() => {}}
              />
            </div>
          </div>
          {/* cover letter */}
          <div className="bg-gray100 py-10 h-62 center gap-5  rounded-lg">
            <p className=" ">Cover </p>
          </div>
          {/* buttons */}
          <div className="bg-gray100 flex flex-wrap gap-5  p-5 rounded-lg">
            <Buttons
              className="bg-primary! py-3 rounded-sm text-white w-[calc(50%-0.625rem)]"
              label="Not Qualified"
              onClick={() => {}}
            />
            <Buttons
              className="bg-primary! py-3 rounded-sm text-white w-[calc(50%-0.625rem)]"
              label="Shortlist"
              onClick={() => {}}
            />
            <Buttons
              className="bg-primary! py-3 rounded-sm text-white w-[calc(50%-0.625rem)]"
              label="Download CV"
              onClick={() => {}}
            />
            <Buttons
              className="bg-primary! py-3 rounded-sm text-white w-[calc(50%-0.625rem)]"
              label="Chat Up"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4 ">
        {/* Generate buttons dynamically based on total pages */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold font-inter ${
              currentPage === index
                ? "bg-primary text-white cursor-not-allowed"
                : "text-secondary hover:bg-accents"
            }`}>
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold border border-accents ${
            currentPage >= totalPages - 1
              ? "bg-accents cursor-not-allowed"
              : "text-secondary hover:bg-accents"
          }`}
          disabled={currentPage >= totalPages - 1}>
          <IoIosArrowForward />
        </button>
      </div>
    </main>
  );
};

export default ShortlistedCandidate;
