import { PostJobForm } from "@/src/components/recruiter-postJobs/Post-Jobs-Form";
import { PostJobHeader } from "@/src/components/recruiter-postJobs/Post-Jobs-Header";


export default function PostJobPage() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-1 flex-col">
        <PostJobHeader />
        <PostJobForm />
      </div>
    </div>
  )
}
