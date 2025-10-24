/* eslint-disable @typescript-eslint/no-empty-object-type */
export type RecruiterAuthData = {
    email: string
    token: {
      issued_at: string
    }
    validation_token: string | null
  }
  
  export type RecruiterBioData = {
    phone_number: string
    email: string
    full_name: string
  }
  
  export type RecruiterCompanyInfo = {
    company_name: string
    about_us?: string
  }
  
  export type RecruiterProfile = {
    _id: string
    auth: RecruiterAuthData
    email: string
    provider: string
    bio_data: RecruiterBioData
    company_info: RecruiterCompanyInfo
    created_at: string
    id: string
    profile: Record<string, any> 
    rating: number
    ratings: any[] 
    updated_at: string
  }
  
  export type RecruiterResponse = {
    profile: RecruiterProfile
    data: RecruiterProfile
    message: string
  }
  
  export interface RecruiterJobsResponse {
    status: number
    message: string
    data: {
      total_filtered_data: number
      page_count: number
      page_data: CreatorResponse[]
    }
  }
  
  export interface CreatorResponse {
    _id: string
    recruiter_id: string
    applicants: string[]
    title: string
    description: string
    experience: string
    industry: string
    salary_range: string
    deadline: string
    work_mode: string
    skills: {
      technical: string[]
      soft: string[]
      responsibilities: string[]
      requirements: string[]
      others: string
    }
    location: string
    status: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export interface RecruiterProfilePayload {
    profile: {
      full_name: string
      email: string
      phone_number: string
      location: string
      industry: string
      profile_picture: string
      social_links: {
        instagram?: string
        linkedin?: string
        website?: string
        twitter?: string
      }
    }
    company_info: {
      company_name: string
      about_us: string
    }
  }