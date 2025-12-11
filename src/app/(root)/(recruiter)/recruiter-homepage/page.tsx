"use client";

import React, { useState } from "react";
import DashboardLayout from "@/src/components/Dashboard-layout";
import {
  RecruiterHeroSection,
  ExploreCreative,
  HowItWorks,
} from "@/src/components/export_components";
import RecruiterSearchSection from "@/src/components/recruiter-creative-hub/RecruiterSearchSection";

// Type for search input
export type FilterData = {
  role: string;
  industry: string;
  location: string;
};

const RecruiterHomepage = () => {
  const [searchFilters, setSearchFilters] = useState<FilterData | null>(null);

  const handleSearch = (filters: FilterData) => {
    console.log("Search filters:", filters);
    setSearchFilters(filters);

    const creativesSection = document.querySelector("section");
    if (creativesSection) {
      creativesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <DashboardLayout>
      <RecruiterHeroSection />
      <RecruiterSearchSection onSearch={handleSearch} />
      <ExploreCreative
        searchFilters={
          searchFilters
            ? {
                title: searchFilters.role,
                category: searchFilters.industry,
                location: searchFilters.location,
                experienceLevels: [],
                employmentTypes: [],
              }
            : null
        }
      />
      <HowItWorks />
    </DashboardLayout>
  );
};

export default RecruiterHomepage;
