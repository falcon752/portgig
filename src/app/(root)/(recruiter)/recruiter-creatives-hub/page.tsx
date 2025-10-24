"use client";
import React from "react";
import RecruiterCreativeHero from "@/src/components/recruiter-creative-hub/RecruiterCreativeHero";
import RecruiterCreativeFilter from "@/src/components/recruiter-creative-hub/RecruiterCreativeFilter";
import RecruiterCreatives from "@/src/components/recruiter-creative-hub/RecruiterCreatives";
import RecruiterSearchSection from "@/src/components/recruiter-creative-hub/RecruiterSearchSection";
import RecruiterCommunity from "@/src/components/recruiter-creative-hub/RecruiterCommunity";

const CreativeHub = () => {
  return (
    <main className="font-raleway">
      <RecruiterCreativeHero />
      <RecruiterSearchSection />
      <div className="flex gap-5 bodyMargin ">
        <div className="flex-2/7 max-lg:hidden">
          <RecruiterCreativeFilter />
        </div>
        <div className="flex-5/7 ">
          <RecruiterCreatives />
        </div>
      </div>
      <RecruiterCommunity />
    </main>
  );
};

export default CreativeHub;
