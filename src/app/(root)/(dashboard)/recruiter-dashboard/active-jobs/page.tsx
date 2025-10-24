"use client";

import { ActiveJobs } from "@/src/components/recruiter-active-jobs/Active-jobs";
import { ClosedJobs } from "@/src/components/recruiter-active-jobs/ClosedJobs";
import { Header } from "@/src/components/recruiter-active-jobs/Header";
import type { JobPosted } from "@/types/jobs";
import { useState, useEffect } from "react";
import { getAllJobs, closeJob, findJobByTitle } from "@/src/lib/requests/recruiterApi";
import toast from "react-hot-toast";

interface ExtendedJobPosted extends JobPosted {
  _id?: string;
  company_name?: string;
  location?: string;
  salary?: string;
  job_type?: string;
  work_mode?: string;
  created_at?: string;
  description?: string;
  skills_required?: string[];
  closedAt?: string;
  reason?: string;
}

export default function PostJobPage() {
  const [activeJobs, setActiveJobs] = useState<ExtendedJobPosted[]>([]);
  const [closedJobs, setClosedJobs] = useState<ExtendedJobPosted[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CLOSED_JOBS_STORAGE_KEY = 'portgig_closed_jobs';

  useEffect(() => {
    try {
      const savedClosedJobs = localStorage.getItem(CLOSED_JOBS_STORAGE_KEY);
      if (savedClosedJobs) {
        const parsed = JSON.parse(savedClosedJobs);
        setClosedJobs(parsed);
      }
    } catch (error) {
      console.error('Error loading closed jobs from localStorage:', error);
      localStorage.removeItem(CLOSED_JOBS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLOSED_JOBS_STORAGE_KEY, JSON.stringify(closedJobs));
    } catch (error) {
      console.error('Error saving closed jobs to localStorage:', error);
    }
  }, [closedJobs]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching jobs from API...');
      
      const response = await getAllJobs({ 
        status: 'ACTIVE',
        limit: 50
      });

      console.log('API Response:', response);

      const jobsData = response?.data?.page_data || [];
      console.log('Jobs Data:', jobsData);

      const mappedJobs: ExtendedJobPosted[] = jobsData.map((job: any) => ({
        id: job._id || job.id,
        _id: job._id || job.id,
        title: job.title || job.job_title || 'Untitled Job',
        applicants: job.total_applications || job.applicants?.length || 0,
        company_name: job.company_name || job.company,
        location: job.location || job.work_location,
        salary: job.salary || job.salary_range,
        job_type: job.job_type,
        work_mode: job.work_mode,
        created_at: job.created_at || job.date_posted,
        description: job.description || job.job_description,
        skills_required: job.skills_required || job.requirements || []
      }));

      console.log('Mapped Jobs:', mappedJobs);
      setActiveJobs(mappedJobs);

    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load jobs';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobClosed = async (jobId: string, reason: string) => {
    try {
      console.log('Closing job with ID:', jobId, 'Reason:', reason);

      const jobToClose = activeJobs.find((job) => job.id === jobId);
      if (!jobToClose) {
        toast.error('Job not found');
        return;
      }

      const jobDetails = await findJobByTitle(jobToClose.title);
      if (!jobDetails) {
        toast.error('Could not find job details. Please try again.');
        return;
      }

      const apiJobId = jobDetails._id || jobDetails.id;
      if (!apiJobId) {
        toast.error('Could not get job ID. Please try again.');
        return;
      }

      await closeJob(apiJobId, reason);

      setActiveJobs((prev) => prev.filter((job) => job.id !== jobId));

      const closedJob: ExtendedJobPosted = {
        ...jobToClose,
        closedAt: new Date().toISOString(),
        reason: reason
      };

      setClosedJobs((prev) => {
        const existingIndex = prev.findIndex(cj => cj.id === jobId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = closedJob;
          return updated;
        } else {
          return [...prev, closedJob];
        }
      });

      console.log('Job closed successfully');
      toast.success(`Job "${jobToClose.title}" has been closed successfully!`);

    } catch (error: any) {
      console.error('Error closing job:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to close job';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center px-4">
                <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-[#0A1754] mx-auto mb-4"></div>
                <p className="text-base md:text-lg text-gray-700 font-raleway">Loading jobs...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md mx-auto p-4 md:p-6">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 font-raleway">Failed to load jobs</h2>
                <p className="text-sm md:text-base text-gray-600 mb-6 font-raleway">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="px-5 py-2.5 md:px-6 md:py-3 bg-[#0A1754] text-white rounded-md hover:bg-opacity-90 transition-colors font-raleway font-medium text-sm md:text-base"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <ActiveJobs jobs={activeJobs} onJobClosed={handleJobClosed} />
          <ClosedJobs jobs={closedJobs} />
        </main>
      </div>
    </div>
  );
}