import JobApplied from "@/src/components/recruiter-dashboard/JobApplied";
import RecruiterDashboardHero from "@/src/components/recruiter-dashboard/RecruiterDashboardHero";

export default function Dashboard() {
  return (
    <>
      {/* <DashboardLayout> */}
      <div>
        <div className="p-6">
          <RecruiterDashboardHero />
        </div>
        <JobApplied />
      </div>
      {/* </DashboardLayout> */}
    </>
  );
}
