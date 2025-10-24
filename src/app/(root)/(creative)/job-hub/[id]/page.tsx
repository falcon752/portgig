import JobDetailsComp from '@/src/components/Job-hub/jobDetails'

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <JobDetailsComp jobId={id} />
}
