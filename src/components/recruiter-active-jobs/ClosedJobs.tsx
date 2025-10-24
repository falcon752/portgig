import { Card } from "@/components/ui/card";
import type { JobPosted } from "@/types/jobs";

type ClosedJobsProps = {
  jobs: JobPosted[];
};

export function ClosedJobs({ jobs }: ClosedJobsProps) {
  return (
    <section className="relative overflow-x-hidden">
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-6 pt-0 pb-2">
        {/* Header */}
        <div className="max-md:bg-[#0A1754] max-md:px-4 max-md:py-4">
          <h2 className="text-sm md:text-xl lg:text-3xl pb-0 md:pb-2 lg:pb-3 font-bold text-[#0A1754] max-md:text-white font-raleway">
            Closed Jobs
          </h2>
        </div>

        {/* Divider for tablet and desktop */}
        <div className="hidden md:block absolute left-0 right-0 w-full border-t border-black" />

        {/* Job List */}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className="p-0 mb-0 border-none shadow-none"
            >
              <div className="md:bg-[#F4F4F4] text-[#0A1754] text-sm md:text-base lg:text-xl font-raleway text-start md:py-5 lg:py-7 md:px-4 lg:px-5 py-3 px-2 font-semibold max-w-full md:max-w-[240px] lg:max-w-[320px] break-words">
                {job.title}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 md:py-10 lg:py-12">
            <p className="text-sm md:text-base text-gray-500 font-raleway">No closed jobs yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}