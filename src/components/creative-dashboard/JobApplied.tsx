"use client"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { LooadingSpinner } from "@/src/utils/util_component"
import { Buttons } from "../export_components"
import { fetchAppliedJobsApi } from "@/src/lib/requests/appliedJobs" 

const AppliedJobsList = () => {
  const {
    data: appliedJobsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appliedJobs", { creatorJob: "yes" }], 
    queryFn: () => fetchAppliedJobsApi({ creatorJob: "yes" }), 
  })

  const appliedJobs = appliedJobsResponse?.data?.page_data || []
  const pageCount = appliedJobsResponse?.data?.page_count || 0

  const getViewStatus = (applicationViews: number) => {
    return applicationViews > 0 ? "Viewed by Recruiter" : "Not seen yet"
  }

  const getViewStatusColor = (applicationViews: number) => {
    return applicationViews > 0 ? "bg-green-500" : "bg-gray-500"
  }

  return (
    <section className="bodyMargin flex flex-col gap-8 font-raleway px-4 sm:px-6 md:px-12 py-6">
      {/* Header */}
      <div className="h-auto p-4 bg-[#0A1754] w-full flex items-center rounded-md">
        <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white lg:pl-5">Job Applied</h2>
      </div>
      {/* Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center h-40">
            <LooadingSpinner className="border-primary w-16 h-16" />
          </div>
        ) : isError ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-red-500 mb-4">Error: {error?.message || "An unknown error occurred."}</p>
              <button onClick={() => refetch()} className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer">
                Retry
              </button>
            </div>
          </div>
        ) : pageCount === 0 ? (
          <div className="col-span-full text-center text-secondary text-lg font-medium">
            No jobs available. Apply for some jobs to see them here!
          </div>
        ) : (
          appliedJobs.map((item) => (
            <Link
              key={item._id}
              href={`/job-hub/${item._id}`}
              className="flex flex-col gap-4 p-4 rounded-lg border-2 border-secondary text-secondary hover:shadow-lg transition-shadow duration-300"
            >
              {/* Title and Company */}
              <div className="flex flex-col gap-1">
                <h2 className="font-bold text-xl line-clamp-1">{item.title}</h2>
                <h3 className="text-sm text-gray-600">by {item.recruiter?.company_name || "Unknown Company"}</h3>
              </div>
              {/* Location and Salary */}
              <div className="flex justify-between text-sm font-semibold">
                <span>{item.location}</span>
                {item.salary_range &&
                    (() => {
                      const [min, max] = item.salary_range
                        .split("/")
                        .map(Number);
                      return (
                        <span className="ml-2 text-[#00489A] font-raleway">
                          NGN{min.toLocaleString()} - {max.toLocaleString()}
                        </span>
                      );
                    })()}
              </div>
              {/* Tags - Updated to show view status instead of work_mode */}
              <div className="flex justify-between text-white text-xs font-bold">
                <div className={`${getViewStatusColor(item.application_views || 0)} rounded-lg py-2 px-3`}>
                  {getViewStatus(item.application_views || 0)}
                </div>
                <div className="bg-secondary rounded-lg py-2 px-3">{item.status}</div>
              </div>
            </Link>
          ))
        )}
      </div>
      {/* View More Button */}
      <div className="flex justify-end">
        <Link href="/job-hub">
          <Buttons
            label="View more jobs"
            className="w-fit rounded-lg font-bold text-sm lg:text-xl text-[#00489A] font-raleway"
          />
        </Link>
      </div>
    </section>
  )
}

export default AppliedJobsList