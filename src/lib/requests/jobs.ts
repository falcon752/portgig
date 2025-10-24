import apiClient from "@/service/apiClient";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const isApiError = (error: unknown): error is Error & ApiErrorResponse => {
  return (
    error instanceof Error &&
    typeof (error as ApiErrorResponse)?.response?.data?.message === "string"
  );
};

export interface RecruiterRating {
  _id: string;
  score: number;
  comment?: string;
  rated_by_user_id: string;
  created_at: string;
}

export interface Job {
  responsibilities: any;
  application_views: number;
  soft_skills: any;
  technical_skills: any;
  requirements: string;
  _id: string;
  recruiter_id: string;
  title: string;
  description: string;
  salary_range: string;
  deadline: string;
  work_mode: string;
  skills: {
    technical: string[];
    soft: string[];
    responsibilities?: string[];
    requirements?: string[];
    others?: string;
  };
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
  __v: number;
  recruiter: {
    full_name: string;
    company_name: string;
    about_us: string;
    rating: number;
    ratings: RecruiterRating[];
    location: string;
  };
  experience?: string;
  industry?: string;
}

export interface JobsApiResponse {
  status: number;
  message: string;
  data: {
    total_filtered_data: number;
    page_count: number;
    page_data: Job[];
  };
}

export async function fetchJobsApi(): Promise<JobsApiResponse> {
  try {
    const response = await apiClient.get<JobsApiResponse>(
      "/job/creator-get-jobs"
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching jobs:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch jobs data");
  }
}

export async function fetchJobDetailsApi(
  jobId: string
): Promise<{ data: Job }> {
  try {
    const response = await apiClient.get<Job>("/job/creator-get-jobs");
    return { data: response.data };
  } catch (error: unknown) {
    console.error(`Error fetching job details for ID ${jobId}:`, error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch job details");
  }
}
