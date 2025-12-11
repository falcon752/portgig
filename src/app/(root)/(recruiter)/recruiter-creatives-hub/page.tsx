"use client";

import React, { useState } from "react";
import DashboardLayout from "@/src/components/Dashboard-layout";
import NavHeaderMinimal from "@/src/components/NavigationBar";
import RecruiterCreativeHero from "@/src/components/recruiter-creative-hub/RecruiterCreativeHero";
import RecruiterCreativeFilter from "@/src/components/recruiter-creative-hub/RecruiterCreativeFilter";
import RecruiterCreatives, {
  CreativesSearchFilters,
} from "@/src/components/recruiter-creative-hub/RecruiterCreatives";
import RecruiterSearchSection from "@/src/components/recruiter-creative-hub/RecruiterSearchSection";
import RecruiterCommunity from "@/src/components/recruiter-creative-hub/RecruiterCommunity";

const CreativeHub = () => {
  const [searchFilters, setSearchFilters] =
    useState<CreativesSearchFilters>(null);

  const handleSearch = (filters: any) => {
    setSearchFilters({
      title: filters.role || "",
      category: filters.industry || "",
      location: filters.location || "",
      experienceLevels: [],
      employmentTypes: [],
    });
  };

  return (
    <DashboardLayout>
      <NavHeaderMinimal />

      <RecruiterCreativeHero />
      <RecruiterSearchSection onSearch={handleSearch} />
      <div className="flex gap-5 bodyMargin">
        <div className="flex-2/7 max-lg:hidden">
          <RecruiterCreativeFilter />
        </div>
        <div className="flex-5/7">
          <RecruiterCreatives searchFilters={searchFilters} />
        </div>
      </div>
      <RecruiterCommunity />
    </DashboardLayout>
  );
};

export default CreativeHub;
