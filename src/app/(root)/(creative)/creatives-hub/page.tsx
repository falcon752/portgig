"use client";
import React, { useState, useCallback } from "react";
import {
  CreativeHero,
  Creatives,
  CreativeFilter,
} from "@/src/components/export_components";
import SearchCreatives from "@/src/components/SearchCreatives";
import CommunityTwo from "@/src/components/CommunityTwo";

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

  const handleFilterChange = useCallback((filters: FilterData) => {
    setActiveFilters(filters);
    console.log("Filters applied:", filters);
  }, []);

  const handleSearchChange = useCallback((search: SearchData) => {
    setSearchData(search);
    console.log("Search applied:", search);
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
  }, []);

  return (
    <main className="font-raleway">
      <CreativeHero />
      <SearchCreatives onSearchChange={handleSearchChange} />
      <div className="flex gap-5 bodyMargin">
        <div className="flex-2/7 max-lg:hidden">
          <CreativeFilter 
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>
        <div className="flex-5/7">
          <Creatives 
            filters={activeFilters}
            searchData={searchData}
            onClearFilters={handleClearAll}
          />
        </div>
      </div>
      <CommunityTwo />
    </main>
  );
};

export default CreativeHub;