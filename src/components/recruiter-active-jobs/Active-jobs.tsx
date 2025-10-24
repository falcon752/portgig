"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CloseJobModal } from "@/src/components/recruiter-active-jobs/CloseJob-Modal";
import type { JobPosted } from "@/types/jobs";

type ActiveJobsProps = {
  jobs: JobPosted[];
  onJobClosed: (jobId: string, reason: string) => void;
};

export function ActiveJobs({ jobs, onJobClosed }: ActiveJobsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");

  const handleOpenModal = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setIsModalOpen(true);
  };

  const handleCloseJob = (jobId: string, reason: string) => {
    onJobClosed(jobId, reason);
    setIsModalOpen(false);
    setSelectedJobId(null);
    setSelectedJobTitle("");
  };

  const handleViewApplications = (jobTitle: string) => {
    const jobTitleSlug = jobTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const encodedSlug = encodeURIComponent(jobTitleSlug);
    router.push(`/recruiter-dashboard/jobs/${encodedSlug}`);
  };

  return (
    <section className="mb-8 max-w-7xl w-full mx-auto pt-0 pb-2 font-raleway px-2 sm:px-4">
      {/* Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 w-full items-center text-sm md:text-base lg:text-xl font-medium text-[#0A1754] border border-[#D9D9D9] py-2 px-2 sm:px-4 md:px-5 lg:px-7 mb-4">
        <div className="pl-6 md:pl-8 lg:pl-20">Jobs</div>
        <div className="pl-6 md:pl-8 lg:pl-20">Applicants</div>
      </div>

      {/* Jobs */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Card
            key={job.id}
            className="grid grid-cols-2 md:grid-cols-4 w-full gap-2 md:gap-3 lg:gap-4 items-start md:items-center bg-gray-50 p-2 md:p-3 lg:p-4 mb-3 border-none shadow-none"
          >
            {/* Job Title */}
            <div className="bg-[#F4F4F4] text-[#0A1754] text-sm md:text-base lg:text-xl font-medium md:font-semibold py-3 px-2 md:py-4 lg:py-7 md:px-3 lg:px-5 text-left break-words">
              {job.title}
            </div>

            {/* Applicants */}
            <div className="bg-[#F4F4F4] text-[#0A1754] text-sm md:text-base lg:text-xl font-medium md:font-semibold py-3 px-2 md:py-4 lg:py-7 text-center">
              {job.applicants || 0}
            </div>

            {/* Close Job Button */}
            <div className="mt-2 md:mt-0 flex justify-center">
              <button
                onClick={() => handleOpenModal(job.id, job.title)}
                className="w-full max-w-[140px] md:max-w-[130px] lg:max-w-[176px] h-12 md:h-12 lg:h-14 bg-[#0A1754] text-white text-[10px] md:text-sm lg:text-xl px-2 rounded-md flex items-center justify-center text-center font-medium font-raleway cursor-pointer hover:bg-opacity-90 transition-colors"
              >
                Close Job
              </button>
            </div>

            {/* View Applications Button */}
            <div className="mt-2 md:mt-0 flex justify-center">
              <button 
                onClick={() => handleViewApplications(job.title)}
                className="w-full max-w-[140px] md:max-w-[130px] lg:max-w-[176px] h-12 md:h-12 lg:h-14 bg-[#0A1754] text-white text-[10px] md:text-sm lg:text-xl px-2 rounded-md flex items-center justify-center text-center font-medium font-raleway leading-tight cursor-pointer hover:bg-opacity-90 transition-colors"
              >
                View <br /> Applications
              </button>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 font-raleway">No active jobs</h3>
          <p className="text-sm md:text-base text-gray-500 font-raleway">You haven&apos;t posted any jobs yet.</p>
        </div>
      )}

      {/* Close Job Modal */}
      {selectedJobId && (
        <CloseJobModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onCloseJob={handleCloseJob}
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
        />
      )}
    </section>
  );
}
