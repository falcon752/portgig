"use client";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Buttons } from "./export_components";
import { industryOptions } from "@/src/utils/industryData";
import NaijaStates from "naija-state-local-government";

type FilterData = {
  title: string;
  category: string;
  location: string;
  experienceLevels: string[];
  employmentTypes: string[];
};

interface SearchSectionProps {
  onSearch?: (filters: FilterData) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    title: "",
    category: "",
    location: "",
    state: "",
    lga: "",
  });

  const availableStates = NaijaStates.states();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (!onSearch) return;

    const finalLocation = searchData.state || searchData.location;

    const searchFilters: FilterData = {
      title: searchData.title,
      category: searchData.category,
      location: finalLocation,
      experienceLevels: [],
      employmentTypes: [],
    };

    onSearch(searchFilters);
  };

  const getRoleSuggestions = () => {
    if (!searchData.title) return [];

    const allRoles: string[] = [];
    Object.values(industryOptions).forEach((roles) => {
      allRoles.push(...roles);
    });

    return allRoles
      .filter((role) =>
        role.toLowerCase().includes(searchData.title.toLowerCase())
      )
      .slice(0, 5);
  };

  const getIndustrySuggestions = () => {
    if (!searchData.category) return [];

    return Object.keys(industryOptions).filter((industry) =>
      industry.toLowerCase().includes(searchData.category.toLowerCase())
    );
  };

  const getLocationSuggestions = () => {
    if (!searchData.location) return [];

    return availableStates
      .filter((state) =>
        state.toLowerCase().includes(searchData.location.toLowerCase())
      )
      .slice(0, 5);
  };

  const roleSuggestions = getRoleSuggestions();
  const industrySuggestions = getIndustrySuggestions();
  const locationSuggestions = getLocationSuggestions();

  return (
    <section className="bodyMargin border border-gray100 flex flex-col lg:flex-row bg-white font-raleway gap-2 lg:gap-0 p-2 lg:p-0 relative">
      {/* Role Search */}
      <div className="relative flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 font-raleway py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          name="title"
          value={searchData.title}
          onChange={handleInputChange}
          placeholder="Search jobs by role"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
        />

        {/* Role Suggestions Dropdown */}
        {roleSuggestions.length > 0 && searchData.title && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {roleSuggestions.map((role) => (
              <div
                key={role}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() =>
                  setSearchData((prev) => ({ ...prev, title: role }))
                }
              >
                {role}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Industry Search */}
      <div className="relative flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          name="category"
          value={searchData.category}
          onChange={handleInputChange}
          placeholder="Search jobs by industry"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
        />

        {/* Industry Suggestions Dropdown */}
        {industrySuggestions.length > 0 && searchData.category && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {industrySuggestions.map((industry) => (
              <div
                key={industry}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() =>
                  setSearchData((prev) => ({ ...prev, category: industry }))
                }
              >
                {industry}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Location Search */}
      <div className="hidden lg:flex relative gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          name="location"
          value={searchData.location}
          onChange={handleInputChange}
          placeholder="Search jobs by location"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
        />

        {/* Location Suggestions Dropdown */}
        {locationSuggestions.length > 0 && searchData.location && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {locationSuggestions.map((state) => (
              <div
                key={state}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() =>
                  setSearchData((prev) => ({ ...prev, location: state }))
                }
              >
                {state}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile State Search */}
      <div className="flex lg:hidden relative gap-3 pl-3 text-textColor items-center w-full border border-gray100 py-3">
        <AiOutlineSearch className="h-4 w-4 shrink-0" />
        <input
          type="text"
          name="state"
          value={searchData.state}
          onChange={handleInputChange}
          placeholder="Search jobs by state"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm"
        />

        {/* State Suggestions Dropdown for Mobile */}
        {searchData.state && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {availableStates
              .filter((state) =>
                state.toLowerCase().includes(searchData.state.toLowerCase())
              )
              .slice(0, 5)
              .map((state) => (
                <div
                  key={state}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => setSearchData((prev) => ({ ...prev, state }))}
                >
                  {state}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mobile LGA Search */}
      <div className="flex lg:hidden gap-3 pl-3 text-textColor items-center w-full border border-gray100 py-3">
        <AiOutlineSearch className="h-4 w-4 shrink-0" />
        <input
          type="text"
          name="lga"
          value={searchData.lga}
          onChange={handleInputChange}
          placeholder="Search jobs by local government"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm"
        />
      </div>

      {/* Search Button */}
      <div className="w-full flex items-center justify-center py-3 lg:py-0">
        <Buttons
          label="Search Jobs"
          className="bg-primary! text-base lg:text-xl h-12 font-semibold px-6 lg:px-8 py-2! lg:py-0 w-full lg:w-fit text-white rounded-xl hover:bg-primary/90 transition-colors"
          onClick={handleSearch}
        />
      </div>

      {/* Quick Clear Option */}
      {(searchData.title ||
        searchData.category ||
        searchData.location ||
        searchData.state) && (
        <button
          onClick={() =>
            setSearchData({
              title: "",
              category: "",
              location: "",
              state: "",
              lga: "",
            })
          }
          className="absolute top-2 right-2 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
        >
          Clear
        </button>
      )}
    </section>
  );
};

export default SearchSection;
