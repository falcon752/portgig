export interface Recruiter {
  full_name: string
  company_name: string
  about_us: string
  rating: number
}

export interface Skills {
  technical: string[]
  soft: string[]
  responsibilities: string[]
  requirements: string[]
  others: string
}

export interface Job {
  _id: string
  recruiter_id: string
  title: string
  description: string
  experience: string
  industry: string
  salary_range: string
  deadline: string
  work_mode: string
  skills: Skills
  location: string
  status: string
  created_at: string
  updated_at: string
  __v: number
  recruiter: Recruiter
}

export interface JobResponseData {
  total_filtered_data: number
  page_count: number
  page_data: Job[]
}
export type JobPosted = {
    id: string
    title: string
    applicants?: number 
  }
  

export interface JobResponse {
  status: number
  message: string
  data: JobResponseData
}

export interface JobDetailsResponse {
  status: number
  message: string
  data: Job
}
