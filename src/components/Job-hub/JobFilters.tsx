"use client";
import { experienceLevels, employmentTypes } from "@/src/constants";
import { Field, industryOptions } from '@/src/utils/industryData';
import NaijaStates from 'naija-state-local-government';
import React, { useState, useEffect } from "react";
import { z } from "zod";

const JobFilterSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
});

type FormData = {
  title: string;
  category: string;
  location: string;
  experienceLevels: string[];
  employmentTypes: string[];
};

interface JobFilterProps {
  onFilterChange?: (filters: FormData) => void;
  onSearch?: (filters: FormData) => void;
  isLoading?: boolean;
  totalJobs?: number;
}

const JobFilter: React.FC<JobFilterProps> = ({ 
  onFilterChange, 
  onSearch, 
  isLoading = false,
  totalJobs = 0 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    location: "",
    experienceLevels: [],
    employmentTypes: [],
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [selectedField, setSelectedField] = useState<Field | "">("");
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
  const [availableStates] = useState<string[]>(NaijaStates.states());
  const [searchQuery, setSearchQuery] = useState("");

  // Update available industries when field changes
  useEffect(() => {
    if (selectedField && selectedField in industryOptions) {
      setAvailableIndustries(industryOptions[selectedField]);
    } else {
      setAvailableIndustries([]);
    }
    // Reset category when field changes
    setFormData(prev => ({ ...prev, category: "" }));
  }, [selectedField]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange(formData);
      }
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [formData, onFilterChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Field | "";
    setSelectedField(value);
    setFormData((prev) => ({ ...prev, category: "" }));
  };

  const handleExperienceCheckboxChange = (level: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.experienceLevels.includes(level);
      const updatedLevels = alreadySelected
        ? prev.experienceLevels.filter((l) => l !== level)
        : [...prev.experienceLevels, level];

      return { ...prev, experienceLevels: updatedLevels };
    });
  };

  const handleTypeCheckboxChange = (type: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.employmentTypes.includes(type); 
      const updatedTypes = alreadySelected
        ? prev.employmentTypes.filter((t) => t !== type) 
        : [...prev.employmentTypes, type]; 

      return { ...prev, employmentTypes: updatedTypes }; 
    });
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, category, location } = formData;
    const schema = JobFilterSchema;
    const result = schema.safeParse({ title, category, location });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (onSearch) {
      onSearch(formData);
    }

    console.log("Search filters:", formData);
  };

  const clearFilters = () => {
    setFormData({
      title: "",
      category: "",
      location: "",
      experienceLevels: [],
      employmentTypes: [],
    });
    setSelectedField("");
    setSearchQuery("");
    setErrors({});
  };

  const labelStyles = "block text-sm md:text-xl font-medium text-textColor";
  const inputStyles =
    "text-secondary mt-2 py-3 px-2 w-52 bg-white border border-gray100 focus:outline-none focus:ring-0 rounded";
  const selectStyles = inputStyles;

  return (
    <aside className="p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Search Query Input */}
        <div className="text-white">
          <label htmlFor="searchQuery" className={labelStyles}>
            Search Jobs
          </label>
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Search by job title, keywords..."
            className={inputStyles}
          />
        </div>

        {/* Field Selection */}
        <div className="text-white">
          <label htmlFor="field" className={labelStyles}>
            Field
          </label>
          <select
            id="field"
            name="field"
            value={selectedField}
            onChange={handleFieldChange}
            className={selectStyles}
          >
            <option value="">Select a field</option>
            {Object.keys(industryOptions).map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        <div className="text-white">
          <label htmlFor="category" className={labelStyles}>
            Category/Industry
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={selectStyles}
            disabled={!selectedField}
          >
            <option value="">
              {selectedField ? "Select a category" : "Select a field first"}
            </option>
            {availableIndustries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-3">{errors.category}</p>
          )}
        </div>

        {/* Location Selection */}
        <div className="text-white">
          <label htmlFor="location" className={labelStyles}>
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={selectStyles}
          >
            <option value="">Select a location</option>
            {availableStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-3">{errors.location}</p>
          )}
        </div>

        {/* Experience Level */}
        <div className="flex flex-col gap-5">
          <p className={labelStyles}>Experience Level</p>
          <div className="flex flex-col gap-3">
            {experienceLevels.map((level) => (
              <div
                key={level.id}
                className="flex items-center space-x-2 text-textColor"
              >
                <input
                  type="checkbox"
                  id={level.level}
                  name="experienceLevels"
                  checked={formData.experienceLevels.includes(level.level)}
                  onChange={() => handleExperienceCheckboxChange(level.level)}
                  className="w-4 h-4 text-secondary focus:ring-white rounded"
                />
                <label htmlFor={level.level} className="text-sm font-medium">
                  {level.level}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Type of Employment */}
        <div className="flex flex-col gap-5">
          <p className={labelStyles}>Type of Employment</p>
          <div className="flex flex-col gap-3">
            {employmentTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center space-x-2 text-textColor"
              >
                <input
                  type="checkbox"
                  id={type.type}
                  name="employmentTypes"
                  checked={formData.employmentTypes.includes(type.type)}
                  onChange={() => handleTypeCheckboxChange(type.type)}
                  className="w-4 h-4 text-secondary focus:ring-white rounded"
                />
                <label htmlFor={type.type} className="text-sm font-medium">
                  {type.type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-secondary text-white font-medium rounded hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              "Search Jobs"
            )}
          </button>
          
          <button
            type="button"
            onClick={clearFilters}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-transparent border border-gray-300 text-textColor font-medium rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Summary */}
        {totalJobs > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 text-sm font-medium">
              {totalJobs} job{totalJobs !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Active Filters Display */}
        {(formData.title || formData.category || formData.location || 
          formData.experienceLevels.length > 0 || formData.employmentTypes.length > 0) && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {formData.title && <p>Search: &quot;{formData.title}&quot;</p>}
              {formData.category && <p>Category: {formData.category}</p>}
              {formData.location && <p>Location: {formData.location}</p>}
              {formData.experienceLevels.length > 0 && (
                <p>Experience: {formData.experienceLevels.join(", ")}</p>
              )}
              {formData.employmentTypes.length > 0 && (
                <p>Employment: {formData.employmentTypes.join(", ")}</p>
              )}
            </div>
          </div>
        )}
      </form>
    </aside>
  );
};

export default JobFilter;