export interface Template {
    id: string
    name: string
    description?: string
    preview?: string
    category?: string
  }
  
  export interface DownloadStatus {
    canDownload: boolean
    daysUntilDownload: number
  }
  
  export interface FormData {
    brief: string;
    full_name: string;
    first_name: string;
    email: string;
    phone_number: string;
    location: string;
    job_title: string;
    education: Array<{
      course: string;
      school: string;
      started: string;
      ended: string;
    }>;
    links: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      tiktok?: string;
    };
    skills: Array<{ value: string }>;
    experience: Array<{
      job_title: string;
      location: string;
      contribution: string;
      started: string;
      ended: string;
    }>;
    other_skills: Array<{ value: string }>;
    certifications: Array<{ value: string }>;
  }
  
  // Helper type for parsing localStorage data that might have legacy numeric IDs
  export interface LegacyTemplate {
    id: string | number
    name: string
    description?: string
    preview?: string
    category?: string
  }