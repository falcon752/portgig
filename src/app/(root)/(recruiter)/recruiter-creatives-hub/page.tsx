"use client";

import React, { useState, useCallback } from "react";
import DashboardLayout from "@/src/components/Dashboard-layout";
import RecruiterCreativeHero from "@/src/components/recruiter-creative-hub/RecruiterCreativeHero";
import CreativeFilter from "@/src/components/creative-hub/CreativeFilter";
import RecruiterCreatives, {
  CreativesSearchFilters,
} from "@/src/components/recruiter-creative-hub/RecruiterCreatives";
import SearchCreatives from "@/src/components/SearchCreatives";
import RecruiterCommunity from "@/src/components/recruiter-creative-hub/RecruiterCommunity";

export interface FilterData {
  field: string;
  industry: string;
  state: string;
  localGovernment: string;
  experienceLevels: string[];
}

export interface SearchData {
  role: string;
  industry: string;
  location: string;
  state: string;
  lg: string;
}

const CreativeHub = () => {
  const [activeFilters, setActiveFilters] = useState<FilterData>({
    field: "",
    industry: "",
    state: "",
    localGovernment: "",
    experienceLevels: [],
  });

  const [searchData, setSearchData] = useState<SearchData>({
    role: "",
    industry: "",
    location: "",
    state: "",
    lg: "",
  });

  const [searchFilters, setSearchFilters] =
    useState<CreativesSearchFilters>(null);

  const handleFilterChange = useCallback((filters: FilterData) => {
    setActiveFilters(filters);

    // Update RecruiterCreatives searchFilters
    setSearchFilters({
      title: filters.field || "",
      category: filters.industry || "",
      location: filters.state || "",
      experienceLevels: [],
      employmentTypes: [],
    });
  }, []);

  const handleSearchChange = useCallback((search: SearchData) => {
    setSearchData(search);

    // Update RecruiterCreatives searchFilters
    setSearchFilters({
      title: search.role || "",
      category: search.industry || "",
      location: search.location || "",
      experienceLevels: [],
      employmentTypes: [],
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveFilters({
      field: "",
      industry: "",
      state: "",
      localGovernment: "",
      experienceLevels: [],
    });
    setSearchData({
      role: "",
      industry: "",
      location: "",
      state: "",
      lg: "",
    });
    setSearchFilters(null);
  }, []);

  return (
    <DashboardLayout>
      <RecruiterCreativeHero />

      {/* Replace RecruiterSearchSection with SearchCreatives */}
      <SearchCreatives onSearchChange={handleSearchChange} />

      <div className="flex gap-5 bodyMargin">
        <div className="flex-2/7 max-lg:hidden">
          <CreativeFilter
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-5/7">
          <RecruiterCreatives
            searchFilters={searchFilters}
          />
        </div>
      </div>

      <RecruiterCommunity />
    </DashboardLayout>
  );
};

export default CreativeHub;
