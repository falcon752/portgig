"use client"
import { AiOutlineSearch } from "react-icons/ai"
import { Buttons } from "../export_components"

const RecruiterSearchSection = () => {
  return (
    <section className="bodyMargin border border-gray100 flex flex-col lg:flex-row bg-white font-raleway gap-2 lg:gap-0 p-2 lg:p-0">
      <div className="flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 font-raleway py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search creative by role"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base py-5"
        />
      </div>

      <div className="flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          name="search"
          id="search-industry"
          placeholder="Search creative by industry"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
        />
      </div>

      <div className="flex gap-3 lg:gap-5 pl-3 lg:pl-5 text-textColor items-center w-full border border-gray100 py-3 lg:py-0">
        <AiOutlineSearch className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
        <input
          type="text"
          name="search"
          id="search-location"
          placeholder="Search creative by location"
          className="w-full h-full border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-sm lg:text-base"
        />
      </div>

      <div className="w-full flex items-center justify-center py-3 lg:py-0">
        <Buttons
          label="Search"
          className="bg-primary! text-base lg:text-xl h-12 font-semibold px-6 lg:px-8 py-2! lg:py-0 w-full lg:w-fit text-white rounded-xl"
          onClick={() => {}}
        />
      </div>
    </section>
  )
}

export default RecruiterSearchSection
