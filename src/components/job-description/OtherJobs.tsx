"use client";
import { LoadingSpinner } from "@/src/utils/util_component";
import Link from "next/link";
import { Buttons } from "../export_components";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsApi } from "@/src/lib/requests/jobs";
import Image from "next/image";

const AvailableJobsComp = () => {
  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobsApi,
  });

  const jobsListingData = jobsResponse?.data?.page_data || [];
  const pageCount = jobsResponse?.data?.page_count || 0;

  return (
    <section className="flex flex-col gap-6 font-raleway">
      <div className="flex items-center bodyMargin">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold pl-4 sm:pl-10 text-[#00489A]">
          View other jobs
        </h2>
      </div>
      <div className="bodyMargin grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <LoadingSpinner className="border-primary w-16 h-16" />
          </div>
        ) : isError ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-red-500 mb-4">
                Error: {error?.message || "An unknown error occurred."}
              </p>{" "}
              {/* Display the actual error message */}
              <button
                onClick={() => refetch()}
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        ) : pageCount === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
              No jobs available
            </div>
          </div>
        ) : (
          jobsListingData.map((item) => (
            <Link
              key={item._id}
              className="flex flex-col gap-4 px-4 py-3 rounded-xl border-2 border-secondary text-secondary hover:shadow-lg transition-shadow duration-300"
              href={`/job-hub/${item._id}`}
            >
              <div className="flex items-start gap-3">
                {" "}
                {/* <Image
                  src="/assets/job-logo.svg"
                  alt="Company Logo"
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                /> */
                <div className="flex flex-col max-w-full">
                  <h2 className="font-bold text-base sm:text-lg md:text-2xl line-clamp-1 text-[#0A1754] font-raleway">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#0A1754] font-raleway font-normal">
                    by {item.recruiter.full_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                  {" "}
                  {/* Added items-center */}
                  <p className="ml-2 text-[#00489A] font-raleway">
                    {item.location}
                  </p>
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
                <div className="flex justify-between text-white text-[10px] font-bold gap-2">
                  <div className="bg-[#587DBD] rounded-lg py-1 px-3 text-[11px]">
                    {item.work_mode}
                  </div>
                  <div className="bg-[#587DBD] rounded-lg py-1 px-3 text-[11px]">
                    {item.experience}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="bodyMargin flex justify-end">
        <Link href="/job-hub">
          <Buttons
            label="Find more jobs"
            className="bg-primary! w-fit rounded-lg font-bold text-sm lg:text-xl text-white hover:bg-opacity-90 transition"
          />
        </Link>
      </div>
    </section>
  );
};

export default AvailableJobsComp;
