"use client";

import { AiOutlineSearch } from "react-icons/ai";
import { Buttons } from "../export_components";
import { useState } from "react";

type FilterData = {
  role: string;
  industry: string;
  location: string;
};

type Props = {
  onSearch: (filters: FilterData) => void;
};

const RecruiterSearchSection = ({ onSearch }: Props) => {
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (!role && !industry && !location) {
      console.log("Empty search ignored");
      return;
    }

    onSearch({ role, industry, location });
  };

  return (
    <section className="bodyMargin border border-gray100 flex flex-col lg:flex-row bg-white font-raleway gap-2 lg:gap-0 p-2 lg:p-0">
      <div className="flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 font-raleway py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          placeholder="Search creative by role"
          className="w-full h-full border-none outline-none text-sm lg:text-base py-5"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          placeholder="Search creative by industry"
          className="w-full h-full border-none outline-none text-sm lg:text-base"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
      </div>

      <div className="flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          placeholder="Search creative by location"
          className="w-full h-full border-none outline-none text-sm lg:text-base"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="w-full flex items-center justify-center py-3 lg:py-0">
        <Buttons
          label="Search"
          className="bg-primary! text-base lg:text-xl h-12 font-semibold px-6 lg:px-8 w-full lg:w-fit text-white rounded-xl"
          onClick={handleSubmit}
        />
      </div>
    </section>
  );
};

export default RecruiterSearchSection;
