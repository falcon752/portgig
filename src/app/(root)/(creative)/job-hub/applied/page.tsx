"use client";
import { Buttons } from "@/src/components/export_components";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { FaCheck } from "react-icons/fa";

interface JobData {
  title: string;
  recruiter: {
    company_name: string;
    full_name: string;
  };
}

// Create a separate component that uses useSearchParams
const AppliedContent = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const [jobData, setJobData] = useState<JobData | null>(null);

  useEffect(() => {
    const jobTitle = searchParams.get("title");
    const companyName = searchParams.get("company");
    
    if (jobTitle && companyName) {
      setJobData({
        title: jobTitle,
        recruiter: {
          company_name: companyName,
          full_name: companyName
        }
      });
    } else {
      const savedJobData = localStorage.getItem("lastAppliedJob");
      if (savedJobData) {
        setJobData(JSON.parse(savedJobData));
      }
    }
  }, [searchParams]);

  const links = [
    { label: "Go back to Job Portal", path: "/job-hub" },
    { label: "Go to Dashboard", path: "/creative-dashboard" },
    { label: "Go to Hompage", path: "/creative-homepage" },
  ];

  const buttonStyles =
    "bg-primary! rounded-lg w-42 md:w-62 py-3 text-sm md:text-lg cursor-pointer";

  return (
    <main className="bodyMargin shadow my-10 py-5 text-primary flex flex-col gap-2 font-raleway">
      {jobData ? (
        <>
          <h2 className="px-5 subHeading">{jobData.title}</h2>
          <h2 className="px-5 text-xs lg:text-lg">
            by {jobData.recruiter.company_name || jobData.recruiter.full_name}
          </h2>
        </>
      ) : (
        <>
          <h2 className="px-5 subHeading">Job Application</h2>
          <h2 className="px-5 text-xs lg:text-lg">Application submitted successfully</h2>
        </>
      )}
      
      <div className="bg-primary px-5 py-5 text-white text-2xl font-inter">
        Application sent
      </div>
      <div className="bodyMargin flex flex-col items-center justify-center my-20 gap-5 text-white">
        <div className="mb-6">
          <div className="w-40 h-40 bg-[#0A1754] rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
            <FaCheck size={80} className="text-white" />
          </div>
        </div>

        {links.map((link) => (
          <Buttons
            key={link.path}
            label={link.label}
            onClick={() => navigate.push(link.path)}
            className={clsx(buttonStyles)}
          />
        ))}
      </div>
    </main>
  );
};

// Loading fallback component
const AppliedLoading = () => (
  <main className="bodyMargin shadow my-10 py-5 text-primary flex flex-col gap-2 font-raleway">
    <h2 className="px-5 subHeading">Loading...</h2>
        <div className="bg-primary px-5 py-5 text-white text-2xl font-inter">
            
      Application sent
    </div>
    <div className="bodyMargin flex flex-col items-center justify-center my-20 gap-5 text-white">
      <div className="mb-6">
        <div className="w-40 h-40 bg-[#0A1754] rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck size={80} className="text-white" />
        </div>
      </div>
    </div>
  </main>
);

// Main component wrapped with Suspense
const Applied = () => {
  return (
    <Suspense fallback={<AppliedLoading />}>
      <AppliedContent />
    </Suspense>
  );
};

export default Applied;