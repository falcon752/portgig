"use client";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsApi, type JobsApiResponse } from "@/src/lib/requests/jobs";
import { LoadingSpinner } from "@/src/utils/util_component";
import toast from "react-hot-toast";

const formSchema = z.object({
  cover_letter: z
    .string()
    .min(30, "Please write a cover letter (minimum 30 characters)"),
});

type FormData = z.infer<typeof formSchema>;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }
  return null;
};

const ApplyContent = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<JobsApiResponse>({
    queryKey: ["jobs"],
    queryFn: fetchJobsApi,
    enabled: !!jobId,
  });

  const jobsListingData = jobsResponse?.data?.page_data || [];
  const jobData = jobsListingData.find((job) => job._id === jobId);

  const onSubmit = async (data: FormData) => {
    if (!jobId) {
      console.error("No job ID provided");
      return;
    }

    if (!jobData) {
      console.error("Job data not available");
      return;
    }

    setApiError(null);

    try {
      const token = getCookie("access_token");

      if (!token) {
        throw new Error("Authentication token not found in cookies");
      }

      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const buildApiUrl = (endpoint: string) => {
        const baseUrl = BASE_URL?.replace(/\/$/, '') || '';
        return `${baseUrl}/${endpoint.replace(/^\//, '')}`;
      };
      
      // Then use it like:
      const response = await fetch(
        buildApiUrl(`job/apply?job_id=${jobId}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        reset();

        // Save job data to localStorage as fallback
        localStorage.setItem(
          "lastAppliedJob",
          JSON.stringify({
            title: jobData.title,
            recruiter: {
              company_name: jobData.recruiter.company_name,
              full_name: jobData.recruiter.full_name,
            },
          })
        );

        // Show success toast
        toast.success("Job applied successfully!");

        // Navigate with job data in query parameters
        navigate.push(
          `/job-hub/applied?title=${encodeURIComponent(
            jobData.title
          )}&company=${encodeURIComponent(
            jobData.recruiter.company_name || jobData.recruiter.full_name
          )}`
        );

        return result;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Application failed with status ${response.status}`
        );
      }
    } catch (error: any) {
      console.error("Application error:", error);

      if (error.message === "Authentication token not found in cookies") {
        setApiError("Please log in to apply for this job");
        toast.error("Please log in to apply for this job");
      } else if (
        error.message?.includes("Network Error") ||
        error.message?.includes("CORS")
      ) {
        setApiError(
          "Network error: Cannot connect to the server. Please try again later."
        );
        toast.error(
          "Network error: Cannot connect to the server. Please try again later."
        );
      } else {
        const errorMessage = error.message || "Job application failed";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }

      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner className="border-primary w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <div className="text-center text-secondary font-semibold bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-500 mb-4 text-sm sm:text-base">
            Error: {(error as Error)?.message || "Failed to load job details"}
          </p>
          <button
            onClick={() => navigate.back()}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <div className="text-center text-secondary font-semibold bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md max-w-md w-full">
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            Job not found
          </p>
          <button
            onClick={() => navigate.push("/job-hub")}
            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer text-sm sm:text-base"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Job Header Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Job Title Section */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 lg:ml-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1754] mb-1 font-raleway leading-tight">
              {jobData.title}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base font-semibold text-[#0A1754]">
              by {jobData.recruiter.company_name || jobData.recruiter.full_name}
            </p>
          </div>

          {/* Review Application Banner */}
          <div className="bg-[#0A1754] px-4 sm:px-6 py-4 sm:py-5">
            <h2 className="text-white text-sm sm:text-base lg:text-lg font-medium font-inter">
              Kindly input your cover letter here
            </h2>
          </div>

          {/* Application Form */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            {apiError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Cover Letter Textarea */}
              <div className="space-y-3">
                <div className="bg-[#D9D9D97A] rounded-lg p-3 sm:p-4 min-h-[120px] sm:min-h-[140px] flex items-center justify-center">
                  <textarea
                    id="cover_letter"
                    {...register("cover_letter")}
                    placeholder="Write your cover letter here..."
                    className="w-full h-20 sm:h-24 bg-transparent border-none outline-none resize-none text-gray-600 placeholder-[#0A17545E] text-center text-xs sm:text-sm lg:text-base leading-relaxed"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.cover_letter && (
                  <p className="text-red-500 text-xs text-center">
                    {errors.cover_letter.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0A1754] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed font-raleway w-full max-w-xs cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit your Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

// Loading component for Suspense fallback
const ApplyLoading = () => (
  <div className="flex justify-center items-center h-screen">
    <LoadingSpinner className="border-primary w-12 h-12 sm:w-16 sm:h-16" />
  </div>
);

// Main component with Suspense wrapper
const Apply = () => {
  return (
    <Suspense fallback={<ApplyLoading />}>
      <ApplyContent />
    </Suspense>
  );
};

export default Apply;
