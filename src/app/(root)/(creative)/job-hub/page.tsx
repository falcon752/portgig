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

      {/* JOBS + FILTERS SECTION */}
      <div className="max-w-[1200px] mx-auto w-full flex gap-5 px-4 md:px-6 lg:px-0">
        {/* LEFT FILTERS */}
        <div className="flex-2/7 max-lg:hidden">
          <JobFilters
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            isLoading={isSearching}
            totalJobs={totalJobsCount}
          />
        </div>

        {/* RIGHT JOB LISTING */}
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
