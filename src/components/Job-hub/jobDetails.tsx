"use client";
import {
    Buttons,
    EmailSubscription,
    JobProfile,
    OtherJobs,
    SearchSection,
} from "@/src/components/export_components";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchJobsApi } from "@/src/lib/requests/jobs";
import { LoadingSpinner } from "@/src/utils/util_component";

interface JobDetailsCompProps {
    jobId: string;
}

export default function JobDetailsComp({ jobId }: JobDetailsCompProps) {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const jobId_param = params.id as string;

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
    const jobData = jobsListingData.find(
        (job: any) => job._id === (jobId_param || jobId)
    );

    const handleGoBack = () => {
        router.push("/job-hub");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner className="border-primary w-16 h-16" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center text-secondary text-lg sm:text-2xl font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
                    <p className="text-red-500 mb-4">
                        Error: {error?.message || "An unknown error occurred."}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!jobData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-secondary text-lg font-semibold bg-gray-100 p-6 rounded-lg shadow-md">
                    <p className="text-gray-500">Job not found.</p>
                    <button
                        onClick={handleGoBack}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Go Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const technicalSkills = jobData?.skills?.technical || [];
    const softSkills = jobData?.skills?.soft || [];
    const responsibilities = jobData?.skills?.responsibilities || [];

    return (
        <main className="flex flex-col text-primary font-raleway">
            <div className="w-full p-5 bg-primary max-lg:hidden">
                <SearchSection />
            </div>

            <JobProfile />

            <div className="bodyMargin grid grid-cols-2 md:grid-cols-4 gap-4 text-primary text-xs md:text-sm lg:text-base font-medium my-6 font-raleway">
                <div>
                    <h4 className="text-sm lg:text-2xl font-bold mb-1">Salary</h4>
                    <p className="text-base lg:text-xl">
                        {jobData.salary_range
                            ? (() => {
                                const [min, max] = jobData.salary_range
                                    .split("/")
                                    .map(Number);
                                return `${min.toLocaleString()} - ${max.toLocaleString()}`;
                            })()
                            : "Not specified"}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm lg:text-2xl font-bold mb-1">Job Deadline</h4>
                    <p className="text-base lg:text-xl">
                        {jobData.deadline
                            ? new Date(jobData.deadline).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : "N/A"}
                    </p>
                </div>
                <div>
                    <h4 className="text-sm lg:text-2xl font-bold mb-1">Location</h4>
                    <p className="text-base lg:text-xl">{jobData.location}</p>
                </div>
                <div>
                    <h4 className="text-sm lg:text-2xl font-bold mb-1">Work Mode</h4>
                    <p className="text-base lg:text-xl">{jobData.work_mode}</p>
                </div>
            </div>

            <div className="bodyMargin my-6">
                {jobData.description && (
                    <div className="bodyMargin my-6">
                        <h2 className="text-sm md:text-lg font-bold text-primary mb-2">
                            Job Description
                        </h2>
                        <p className="text-sm md:text-xl text-primary leading-relaxed">
                            {jobData.description}
                        </p>
                    </div>
                )}

                {responsibilities.length > 0 && (
                    <div className="my-6">
                        <h2 className="text-sm md:text-lg font-bold text-primary mb-2">
                            Key Responsibilities
                        </h2>
                        <div className="text-xs md:text-xl text-primary space-y-2">
                            {responsibilities.map((responsibility: string, index: number) => (
                                <p key={index} className="leading-relaxed">
                                    {responsibility}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                <h3 className="font-bold text-sm md:text-lg text-primary mt-6 mb-2">
                    Technical Skills:
                </h3>
                {technicalSkills.length > 0 ? (
                    <div className="text-xs md:text-xl text-primary space-y-2">
                        {technicalSkills.map((skill: string, index: number) => (
                            <p key={index} className="leading-relaxed">{skill}</p>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs md:text-xl text-gray-500">No technical skills specified</p>
                )}

                <h3 className="font-bold text-sm md:text-lg text-primary mt-6 mb-2">
                    Soft Skills:
                </h3>
                {softSkills.length > 0 ? (
                    <div className="text-xs md:text-xl text-primary space-y-2">
                        {softSkills.map((skill: string, index: number) => (
                            <p key={index} className="leading-relaxed">{skill}</p>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs md:text-xl text-gray-500">No soft skills specified</p>
                )}
            </div>

            {jobData.experience && (
                <div className="bodyMargin my-6">
                    <h2 className="text-sm md:text-lg font-bold text-primary mb-2">
                        Experience Level
                    </h2>
                    <p className="text-sm md:text-xl text-primary leading-relaxed capitalize">
                        {jobData.experience}
                    </p>
                </div>
            )}

            <div className="bodyMargin mt-6 max-lg:my-3 flex justify-start lg:justify-end">
                <Buttons
                    label="Apply Now"
                    className="bg-primary! text-white rounded-sm w-fit cursor-pointer text-xs md:text-sm"
                    onClick={() => {
                        console.log("Navigating to apply with job ID:", jobData._id);
                        router.push(`/job-hub/apply?jobId=${jobData._id}`);
                    }}
                />
            </div>

            <OtherJobs />
            <EmailSubscription />
        </main>
    );
}