"use client";

import React, { useState } from "react";
import {
  RecruiterHeroSection,
  ExploreCreative,
  SearchSection,
  HowItWorks,
} from "@/src/components/export_components";

type FilterData = {
  title: string;
  category: string;
  location: string;
  experienceLevels: string[];
  employmentTypes: string[];
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
      <SearchSection onSearch={handleSearch} />
      <ExploreCreative searchFilters={searchFilters} />
      <HowItWorks />
    </main>
  );
};

export default RecruiterHomepage;
