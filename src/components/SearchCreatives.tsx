"use client";
import { AiOutlineSearch } from "react-icons/ai";
import { IoChevronDown, IoFilter } from "react-icons/io5";
import { Buttons } from "./export_components";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  setError,
  setLgas,
  setLoading,
  setSelectedField,
  setSelectedState,
} from "@/src/redux/features/authSlice";
import { Field, industryOptions } from "@/src/utils/industryData";
import NaijaStates from 'naija-state-local-government';
import { SearchData } from "@/src/app/(root)/(creative)/creatives-hub/page"; 

// Get Nigerian states from the library
const nigerianStates = NaijaStates.states();

const experienceOptions = [
  { label: "Beginner (0-1 years)", value: "Beginner" },
  { label: "Intermediate (2 years)", value: "Intermediate" },
  { label: "Mid-level (3 years)", value: "Mid-level" },
  { label: "Professional (4-6 years)", value: "Professional" },
  { label: "Expert (7-15 years)", value: "Expert" },
];

interface Filters {
  field: string;
  industry: string;
  state: string;
  lga: string;
  experienceLevel: string[];
}

interface SearchCreativesProps {
  onSearchChange: (search: SearchData) => void;
}

const SearchCreatives: React.FC<SearchCreativesProps> = ({ onSearchChange }) => {
  const dispatch = useAppDispatch();
  const {
    selectedField,
    selectedState,
    lgas,
    loading: loadingLgas,
  } = useAppSelector((state) => state.auth);

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    field: "",
    industry: "",
    state: "",
    lga: "",
    experienceLevel: [],
  });

  // Search input states
  const [searchInputs, setSearchInputs] = useState<SearchData>({
    role: "",
    industry: "",
    location: "",
    state: "",
    lg: "",
  });

  useEffect(() => {
    const fetchLgas = async () => {
      if (!selectedState) return;

      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setLgas([]));

      try {
        // Use naija-state-local-government library to get LGAs
        const lgaResult = NaijaStates.lgas(selectedState);
        if (lgaResult && Array.isArray(lgaResult.lgas) && lgaResult.lgas.length > 0) {
          dispatch(setLgas(lgaResult.lgas));
        } else {
          dispatch(setError("No LGAs found for this state."));
        }
      } catch (error) {
        console.error("Failed to fetch LGAs:", error);
        dispatch(setError("Failed to load LGAs. Please try again."));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLgas();
  }, [selectedState, dispatch]);

  const stateOptions = nigerianStates.map((state) => ({
    label: state,
    value: state,
  }));

  const lgaOptions = lgas.map((lga) => ({
    label: lga,
    value: lga,
  }));

  const fields = Object.keys(industryOptions).map((field) => ({
    label: field,
    value: field,
  })) as { label: string; value: Field }[];

  const industries = selectedField
    ? industryOptions[selectedField as Field].map((industry: string) => ({
        label: industry,
        value: industry,
      }))
    : [];

  const handleFieldChange = (field: string) => {
    setFilters((prev) => ({ ...prev, field, industry: "" }));
    dispatch(setSelectedField(field));
  };

  const handleStateChange = (state: string) => {
    setFilters((prev) => ({ ...prev, state, lga: "" }));
    dispatch(setSelectedState(state));
  };

  const handleExperienceChange = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevel: prev.experienceLevel.includes(level)
        ? prev.experienceLevel.filter((l) => l !== level)
        : [...prev.experienceLevel, level],
    }));
  };

  const handleSearchInputChange = (field: keyof SearchData, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    console.log("Applied filters:", filters);
    console.log("Search inputs:", searchInputs);
    setShowMobileFilter(false);
    
    // Convert filters and search inputs to SearchData format
    const searchData: SearchData = {
      role: searchInputs.role,
      industry: searchInputs.industry || filters.industry,
      location: searchInputs.location,
      state: searchInputs.state || filters.state,
      lg: searchInputs.lg || filters.lga,
    };

    onSearchChange(searchData);
  };

  const handleSearch = () => {
    console.log("Search clicked with inputs:", searchInputs);
    
    const searchData: SearchData = {
      role: searchInputs.role,
      industry: searchInputs.industry,
      location: searchInputs.location,
      state: searchInputs.state,
      lg: searchInputs.lg,
    };

    onSearchChange(searchData);
  };

  return (
    <div className="bodyMargin">
      {/* Search Section */}
      <section className="border border-gray100 flex flex-col lg:flex-row bg-white font-raleway gap-2 lg:gap-0 p-2 lg:p-0">
        {/* Mobile: Role and Industry in a row */}
        <div className="flex lg:hidden gap-2 w-full">
          <div className="flex gap-3 pl-3 text-textColor items-center w-full border border-gray100 font-raleway py-3">
            <AiOutlineSearch className="h-4 w-4 shrink-0" />
            <input
              type="text"
              name="search-role"
              placeholder="Search by role"
              value={searchInputs.role}
              onChange={(e) => handleSearchInputChange("role", e.target.value)}
              className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm"
            />
          </div>

          <div className="flex gap-3 pl-3 text-textColor items-center w-full border border-gray100 py-3">
            <AiOutlineSearch className="h-4 w-4 shrink-0" />
            <input
              type="text"
              name="search-industry"
              placeholder="Search by industry"
              value={searchInputs.industry}
              onChange={(e) => handleSearchInputChange("industry", e.target.value)}
              className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm"
            />
          </div>
        </div>

        {/* Desktop: All fields in a row */}
        <div className="hidden lg:flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 font-raleway py-3 lg:py-0">
          <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
          <input
            type="text"
            name="search-role"
            placeholder="Search creative by role"
            value={searchInputs.role}
            onChange={(e) => handleSearchInputChange("role", e.target.value)}
            className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
          />
        </div>

        <div className="hidden lg:flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3 lg:py-0">
          <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
          <input
            type="text"
            name="search-industry"
            placeholder="Search creative by industry"
            value={searchInputs.industry}
            onChange={(e) => handleSearchInputChange("industry", e.target.value)}
            className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
          />
        </div>

        <div className="hidden lg:flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3">
          <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
          <input
            type="text"
            name="search-location"
            placeholder="Search creative by location"
            value={searchInputs.location}
            onChange={(e) => handleSearchInputChange("location", e.target.value)}
            className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
          />
        </div>

        <div className="w-full flex items-center justify-center py-3 lg:py-0">
          <Buttons
            label="Search"
            className="bg-primary! text-base lg:text-xl h-12 font-semibold px-6 lg:px-8 py-2! lg:py-0 w-full lg:w-fit text-white rounded-xl"
            onClick={handleSearch}
          />
        </div>
      </section>

      {/* Mobile Filter Button - Full Width like Input */}
      <button
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        className="lg:hidden w-full flex items-center justify-between gap-3 pl-3 pr-3 text-textColor bg-white border border-gray100 font-raleway py-3 mt-2"
      >
        <div className="flex items-center gap-3">
          <IoFilter className="h-4 w-4 shrink-0" />
          <span className="text-sm">Filter</span>
        </div>
        <IoChevronDown
          className={`h-4 w-4 transition-transform ${
            showMobileFilter ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mobile Filter Dropdown */}
      {showMobileFilter && (
        <div className="lg:hidden bg-white border border-gray100 mt-1 p-4 space-y-4">
          {/* Field Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textColor">
              Field
            </label>
            <select
              value={filters.field}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="w-full py-3 px-3 bg-white border border-gray100 text-primary rounded-md focus:outline-none focus:ring-0 text-sm"
            >
              <option value="">Select your field</option>
              {fields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textColor">
              Industry
            </label>
            <select
              value={filters.industry}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, industry: e.target.value }))
              }
              className="w-full py-3 px-3 bg-white border border-gray100 text-primary rounded-md focus:outline-none focus:ring-0 text-sm"
              disabled={!selectedField}
            >
              <option value="">Select your industry</option>
              {industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textColor">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full py-3 px-3 bg-white border border-gray100 text-primary rounded-md focus:outline-none focus:ring-0 text-sm"
            >
              <option value="">Select your state</option>
              {stateOptions.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          {/* LGA Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textColor">
              Local Government
            </label>
            <select
              value={filters.lga}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, lga: e.target.value }))
              }
              className="w-full py-3 px-3 bg-white border border-gray100 text-primary rounded-md focus:outline-none focus:ring-0 text-sm"
              disabled={loadingLgas || !selectedState}
            >
              <option value="">
                {loadingLgas ? "Loading LGAs..." : "Select your LGA"}
              </option>
              {lgaOptions.map((lga) => (
                <option key={lga.value} value={lga.value}>
                  {lga.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-textColor">
              Experience Level
            </label>
            <div className="space-y-2">
              {experienceOptions.map((experience) => (
                <label
                  key={experience.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.experienceLevel.includes(experience.value)}
                    onChange={() => handleExperienceChange(experience.value)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-textColor text-sm">
                    {experience.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Buttons
              label="Apply Filters"
              className="bg-primary! text-white w-full py-3 px-6 rounded-lg font-semibold"
              onClick={applyFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchCreatives;