"use client";

import React, { useState } from "react";
import {
  RecruiterHeroSection,
  ExploreCreative,
  HowItWorks,
} from "@/src/components/export_components";

import RecruiterSearchSection from "@/src/components/recruiter-creative-hub/RecruiterSearchSection";

// This is the type used by your new search inputs
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
    <main>
      <RecruiterHeroSection />

      {/* Pass search handler to the new search section */}
      <RecruiterSearchSection onSearch={handleSearch} />

      {/* Map the new FilterData to ExploreCreative's expected FilterData */}
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
    </main>
  );
};

export default RecruiterHomepage;
