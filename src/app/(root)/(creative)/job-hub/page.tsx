"use client";
import React, { useState, useCallback } from "react";
import {
  SearchSection,
  JobHero,
  Jobs,
  JobFilters,
} from "@/src/components/export_components";
import JobCategories from "@/src/components/JobCategories";

type FilterData = {
  title: string;
  category: string;
  location: string;
  experienceLevels: string[];
  employmentTypes: string[];
};

const JobHub = () => {
  const [currentFilters, setCurrentFilters] = useState<FilterData>({
    title: "",
    category: "",
    location: "",
    experienceLevels: [],
    employmentTypes: [],
  });
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleFilterChange = useCallback((filters: FilterData) => {
    setCurrentFilters(filters);
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 200);
  }, []);

  const handleSearch = useCallback((filters: FilterData) => {
    setCurrentFilters(filters);
    setIsSearching(true);
  
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  }, []);

  const handleTotalJobsChange = useCallback((total: number) => {
    setTotalJobsCount(total);
  }, []);

  return (
    <main className="font-raleway">
      <JobHero />
      <SearchSection onSearch={handleSearch} />
      <div className="flex gap-5 bodyMargin">
        <div className="flex-2/7 max-lg:hidden">
          <JobFilters
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            isLoading={isSearching}
            totalJobs={totalJobsCount}
          />
        </div>
        <div className="flex-5/7">
          <Jobs 
            filters={currentFilters}
            onTotalJobsChange={handleTotalJobsChange}
          />
        </div>
      </div>
      <JobCategories />
    </main>
  );
};

export default JobHub;