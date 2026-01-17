"use client";

import React, { useState, useCallback } from "react";
import DashboardLayout from "@/src/components/Dashboard-layout";
import { RecruiterHeroSection, ExploreCreative, HowItWorks } from "@/src/components/export_components";
import SearchCreatives from "@/src/components/SearchCreatives";

export type SearchData = {
  role: string;
  industry: string;
  location: string;
};

export type FilterData = SearchData;

const RecruiterHomepage = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    role: "",
    industry: "",
    location: "",
  });

  const [searchFilters, setSearchFilters] = useState<any>(null);

  const handleSearchChange = useCallback((search: SearchData) => {
    setSearchData(search);

    setSearchFilters({
      title: search.role || "",
      category: search.industry || "",
      location: search.location || "",
      experienceLevels: [],
      employmentTypes: [],
    });

    const creativesSection = document.querySelector("section");
    if (creativesSection) {
      creativesSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <DashboardLayout>
      <RecruiterHeroSection />

      <SearchCreatives onSearchChange={handleSearchChange} />

      <ExploreCreative searchFilters={searchFilters} />

      <HowItWorks />
    </DashboardLayout>
  );
};

export default RecruiterHomepage;
