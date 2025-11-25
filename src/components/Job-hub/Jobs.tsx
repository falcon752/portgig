"use client"
import { LoadingSpinner } from "@/src/utils/util_component"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { Buttons } from "../export_components"
import { useQuery } from "@tanstack/react-query"
import { fetchJobHubJobsApi } from "@/src/lib/requests/jobHub" 
import Image from "next/image"

type FilterData = {
  title: string;
  category: string;
  location: string;
  experienceLevels: string[];
  employmentTypes: string[];
};

interface JobsProps {
  filters?: FilterData;
  onTotalJobsChange?: (total: number) => void;
}

const Jobs: React.FC<JobsProps> = ({ filters, onTotalJobsChange }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobHubJobs"], 
    queryFn: fetchJobHubJobsApi,
    // Keep data fresh, e.g., refetch every 5 minutes
    staleTime: 1000 * 60 * 5,
  })

  const allJobs = jobsResponse?.data?.page_data || []

  // Filter jobs using useMemo to avoid infinite loops
  const filteredJobs = useMemo(() => {
    if (!filters) {
      return allJobs
    }

    return allJobs.filter((job: any) => {
      // Filter by title/search query
      if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false
      }

      // Filter by category
      if (filters.category && job.category !== filters.category) {
        return false
      }

      // Filter by location
      if (filters.location && job.location !== filters.location) {
        return false
      }

      // Filter by experience levels
      if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experience)) {
        return false
      }

      // Filter by employment types
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.work_mode)) {
        return false
      }

      return true
    })
  }, [allJobs, filters])

  // Update total jobs count when filtered jobs change
  useEffect(() => {
    if (onTotalJobsChange) {
      onTotalJobsChange(filteredJobs.length)
    }
    setCurrentPage(0) // Reset to first page when filters change
  }, [filteredJobs.length]) // Removed onTotalJobsChange from dependencies

  const jobsPerPage = 12
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) 

  const startIndex = currentPage * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  // Handle page change for pagination
  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex)
  }

  // Check if any filters are active
  const hasActiveFilters = filters && (
    filters.title || 
    filters.category || 
    filters.location || 
    filters.experienceLevels.length > 0 || 
    filters.employmentTypes.length > 0
  )

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner className="border-primary w-16 h-16" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="col-span-full flex items-center justify-center min-h-[300px]">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">Error: {error?.message || "An unknown error occurred."}</p>
          <button onClick={() => refetch()} className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="p-5 flex flex-col gap-3">
      <header className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-textColor text-xl font-bold">
            {hasActiveFilters ? "Search Results" : "Latest jobs"}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-primary text-sm">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </p>
            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Filtered
              </span>
            )}
          </div>
        </div>
        <Buttons
          label="View all jobs"
          className="text-textColor underline font-bold cursor-pointer"
          onClick={() => {
            setCurrentPage(0) 
          }}
        />
      </header>

      {/* Show active filters summary */}
      {hasActiveFilters && (
        <div className="bg-gray-50 p-3 rounded-lg border mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.title && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Search: &quot;{filters.title}&quot;
              </span>
            )}
            {filters.category && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Category: {filters.category}
              </span>
            )}
            {filters.location && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                Location: {filters.location}
              </span>
            )}
            {filters.experienceLevels.map((level) => (
              <span key={level} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                {level}
              </span>
            ))}
            {filters.employmentTypes.map((type) => (
              <span key={type} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
        {currentJobs.length === 0 ? (
          <div className="col-span-full text-center text-secondary text-lg font-medium min-h-[200px] flex items-center justify-center">
            {hasActiveFilters ? (
              <div className="text-center">
                <p className="mb-2">No jobs match your current filters.</p>
                <p className="text-sm text-gray-500">Try adjusting your search criteria.</p>
              </div>
            ) : (
              "No jobs available at the moment."
            )}
          </div>
        ) : (
          currentJobs.map((job) => (
            <Link
              key={job._id}
              className="flex flex-col justify-between gap-5 h-full px-5 py-3 rounded-xl border-2 border-secondary text-secondary cursor-pointer hover:shadow-lg transition-shadow"
              href={`/job-hub/${job._id}`}
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/job-logo.svg"
                  alt="Company Logo"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col flex-1">
                  <h2 className="font-bold text-base sm:text-lg md:text-2xl line-clamp-1 text-[#0A1754] font-raleway">
                    {job.title}
                  </h2>
                  <p className="text-sm text-[#0A1754] font-raleway font-normal">
                    by {job.recruiter.company_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex justify-between text-sm font-bold">
                  <p className="ml-2 text-[#00489A] font-raleway">{job.location}</p>
                  <p className="ml-2 text-[#00489A] font-raleway">{job.salary_range}</p>
                </div>
                <div className="flex justify-between text-white text-[10px] font-bold">
                  <div className="bg-[#587DBD] rounded-lg py-1 px-3 text-[11px]">{job.work_mode}</div>
                  <div className="bg-[#587DBD] rounded-lg py-1 px-3 text-[11px]">{job.experience}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold border border-accents ${
              currentPage === 0 ? "bg-accents cursor-not-allowed" : "text-secondary hover:bg-accents"
            }`}
            disabled={currentPage === 0}
          >
            <IoIosArrowForward className="rotate-180" />
          </button>

          {/* Generate buttons dynamically based on total pages */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold font-inter ${
                currentPage === index ? "bg-primary text-white cursor-not-allowed" : "text-secondary hover:bg-accents"
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold border border-accents ${
              currentPage >= totalPages - 1 ? "bg-accents cursor-not-allowed" : "text-secondary hover:bg-accents"
            }`}
            disabled={currentPage >= totalPages - 1}
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </section>
  )
}

export default Jobs