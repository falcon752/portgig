"use client";
import { Buttons } from "@/src/components/export_components";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsApi } from "@/src/lib/requests/jobs";
import { LoadingSpinner } from "@/src/utils/util_component";

const JobProfile = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobsApi,
    staleTime: 1000 * 60 * 5,
  });

  const jobsListingData = jobsResponse?.data?.page_data || [];
  const jobDetails = jobsListingData.find((job: any) => job._id === jobId);

  if (isLoading) {
    return (
      <section className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner className="border-primary w-16 h-16" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="h-fit pt-20 bodyMargin my-10 flex flex-col gap-5 shadow p-5 md:p-10 lg:items-center">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">
            Error loading job: {error?.message || "An unknown error occurred."}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!jobDetails) {
    return (
      <section className="h-fit pt-20 bodyMargin my-10 flex flex-col gap-5 shadow p-5 md:p-10 lg:items-center">
        <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">Job not found.</p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="h-fit pt-20 bodyMargin my-10 flex flex-col gap-5 shadow p-5 md:p-10 lg:items-center">
      <div className="flex items-center gap-0">
        {/* <div className="flex w-fit justify-center border border-[#D9D9D90A] rounded-full">
          <Image
            src={"/assets/companyImage.svg"}
            alt={jobDetails.recruiter?.company_name || "Company Logo"}
            width={200}
            height={200}
            className="object-contain max-md:w-[100px] max-md:h-[100px]"
          />
        </div> */
        <div>
          <h2 className="text-xl font-bold lg:text-5xl font-raleway">
            {jobDetails.title}
          </h2>
          <p className="text-base lg:text-lg font-semibold font-raleway">
            by{" "}
            {jobDetails.recruiter?.company_name ||
              jobDetails.recruiter?.full_name ||
              "Unknown Company"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 items-center lg:-mt-16 lg:ml-60">
        <div className="w-[300px] h-[100px] lg:w-[400px] lg:h-[150px] border border-primary px-5 py-2 rounded-lg overflow-hidden break-words">
          <p className="text-[10px] md:text-sm overflow-hidden text-ellipsis line-clamp-10">
            {jobDetails.recruiter.about_us}
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          <Buttons
            label="Apply Now"
            className="bg-primary! text-white rounded-sm cursor-pointer text-xs md:text-sm"
            onClick={() => {
                console.log("Navigating to apply with job ID:", jobDetails._id);
                router.push(`/job-hub/apply?jobId=${jobDetails._id}`);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default JobProfile;
