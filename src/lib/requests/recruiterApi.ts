import apiClient from "@/service/apiClient";

export interface ApplicantInfo {
  id: string;
  bio_data: {
    profile_picture: any;
    full_name: string;
    user_name: string;
  };
  profile: {
    profile_picture: any;
    years_of_experience: string;
    field: string;
    industry: string;
    location: {
      state: string;
      lga: string;
      _id: string;
    };
    skill_level?:
      | "Beginner"
      | "Intermediate"
      | "Mid-level"
      | "Professional"
      | "Expert";
  };
  resume: {
    skills: string[];
    other_skills: string[];
    certifications: string[];
    experience: string[];
    education: string[];
  };
  rating: number;
  profile_views: number;
  social_clicks: {
    linkedin: number;
    twitter: number;
    instagram: number;
    tiktok: number;
  };
  email?: string;
}

export interface ShortlistedCandidate {
  id: any;
  job_title: string;
  applicant_info: ApplicantInfo;
  application_date: string;
}

export interface SelectedCandidate {
  job_title: string;
  applicant_info: ApplicantInfo;
  application_date: string;
}

export interface NotQualifiedCandidate {
  job_title: string;
  applicant_info: ApplicantInfo;
  application_date: string;
}

export interface ApplicantDetail {
  job_title: string;
  applicant_info: ApplicantInfo;
  application_date: string;
}

export interface LatestApplication {
  job_title: string;
  applicant_info: ApplicantInfo;
  application_date: string;
}

export interface RecruiterDashboardData {
  total_jobs_posted: number;
  total_applicants: number;
  job_titles: string[];
  shortlisted_applicants: ShortlistedCandidate[];
  selected_applicants: SelectedCandidate[];
  not_qualified_applicants: NotQualifiedCandidate[];
  applicant_details: ApplicantDetail[];
  latest_application: LatestApplication;
}

interface RecruiterDashboardResponse {
  status: number;
  message: string;
  data: RecruiterDashboardData;
}

export interface JobApplicationCandidate {
  id: string;
  job_title: string;
  applicant_info: ApplicantInfo;
  application_date: string;
}

export interface JobDetailsResponse {
  status: number;
  message: string;
  data: {
    page_data: any;
    total_applications: number;
    shortlisted_talents: number;
    selected_candidates_count: number;
    candidates: JobApplicationCandidate[];
    job_description?: string;
    requirements?: string[];
  };
}

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

export const getRecruiterDashboard =
  async (): Promise<RecruiterDashboardData> => {
    try {
      const response = await apiClient.get<RecruiterDashboardResponse>(
        "/recruiter/dashboard"
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching recruiter dashboard:", error);
      if (isApiError(error)) {
        throw new Error(error.response!.data!.message!);
      }
      throw new Error("Failed to fetch dashboard data");
    }
  };

// Alternative version with error handling that returns the full response
export const getRecruiterDashboardFull =
  async (): Promise<RecruiterDashboardResponse> => {
    try {
      const response = await apiClient.get<RecruiterDashboardResponse>(
        "/recruiter/dashboard"
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching recruiter dashboard:", error);
      if (isApiError(error)) {
        throw new Error(error.response!.data!.message!);
      }
      throw new Error("Failed to fetch dashboard data");
    }
  };



// Helper function to convert URL slug back to proper job title
const formatSlugToJobTitle = (slug: string): string => {
    return decodeURIComponent(slug)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  
  export const getJobApplications = async (
    title: string,
    experienceFilter = "all",
    workMode?: string,
  ): Promise<JobDetailsResponse> => {
    try {
      const formattedTitle = formatSlugToJobTitle(title)
  
      const params: {
        title: string
        status?: string
        work_mode?: string
      } = { title: formattedTitle }
  
      if (experienceFilter !== "all") {
        params.status = experienceFilter.toUpperCase()
      }
  
      if (workMode) {
        params.work_mode = workMode
      }
  
      const response = await apiClient.get<{
        status: number
        message: string
        data: {
          total_filtered_data: number
          page_count: number
          page_data: any[]
        }
      }>(`/job/get`, { params })
  
      const jobs = response.data.data.page_data
  
      // Collect applicants from ALL jobs and deduplicate by applicant ID
      const allApplicants: any[] = []
      let totalApplicants = 0
      let totalShortlisted = 0
      let totalSelected = 0
  
      jobs.forEach((job) => {
        const applicants = job?.applicants || []
  
        // Add unique applicants only
        applicants.forEach((applicant: { id: any }) => {
          if (!allApplicants.find((a) => a.id === applicant.id)) {
            allApplicants.push(applicant)
          }
        })
  
        totalApplicants += applicants.length
        totalShortlisted += job?.applicant_status_counts?.shortlisted || 0
        totalSelected += job?.applicant_status_counts?.selected || 0
      })
  
      // Map all unique applicants to the expected structure
      const candidates = allApplicants.map((applicant: any) => {
        // Determine skill level based on years of experience
        const yearsExpText = applicant.profile?.years_of_experience || "0 years"
        const yearsExp = Number.parseInt(yearsExpText) || 0
        let skillLevel: "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert" = "Beginner"
  
        if (yearsExp >= 5) skillLevel = "Expert"
        else if (yearsExp >= 3) skillLevel = "Professional"
        else if (yearsExp >= 2) skillLevel = "Mid-level"
        else if (yearsExp >= 1) skillLevel = "Intermediate"
  
        return {
          id: applicant.id,
          job_title: title,
          applicant_info: {
            id: applicant.id, 
            bio_data: {
              profile_picture: applicant.profile?.profile_picture,
              full_name: applicant.full_name,
              user_name: applicant.user_name,
            },
            profile: {
              profile_picture: applicant.profile?.profile_picture,
              years_of_experience: applicant.profile?.years_of_experience || "0 years",
              field: applicant.profile?.field || "",
              industry: applicant.profile?.industry || "",
              location: applicant.profile?.location || {
                state: "",
                lga: "",
                _id: "",
              },
              skill_level: skillLevel,
            },
            resume: applicant.resume || {
              skills: [],
              other_skills: [],
              certifications: [],
              experience: [],
              education: [],
            },
            rating: applicant.rating || 0,
            profile_views: applicant.views || 0,
            social_clicks: {
              linkedin: 0,
              twitter: 0,
              instagram: 0,
              tiktok: 0,
            },
            email: applicant.email,
          },
          application_date: new Date().toISOString(),
        }
      })
  
      const firstJob = jobs[0] || {}
  
      return {
        status: response.data.status,
        message: response.data.message,
        data: {
          page_data: response.data.data.page_data,
          total_applications: totalApplicants,
          shortlisted_talents: totalShortlisted,
          selected_candidates_count: totalSelected,
          candidates, 
          job_description: firstJob?.description,
          requirements: firstJob?.skills ? [...(firstJob.skills.technical || []), ...(firstJob.skills.soft || [])] : [],
        },
      }
    } catch (error: unknown) {
      console.error(`Error fetching job applications for title=${title}:`, error)
      if (isApiError(error)) {
        throw new Error(error.response?.data?.message ?? "Unknown API error")
      }
      throw new Error("Failed to fetch job application data")
    }
  }


export interface UpdateApplicantStatusRequest {
  job_id: string;
  creator_id: string;
  status: "PENDING" | "SHORTLISTED" | "NOT_QUALIFIED" | "SELECTED";
}

export interface UpdateApplicantStatusResponse {
  status: number;
  message: string;
  data: {
    updatedApplicant: any;
  };
}

export const updateApplicantStatus = async (
  requestData: UpdateApplicantStatusRequest
): Promise<UpdateApplicantStatusResponse> => {
  try {
    const response = await apiClient.patch<UpdateApplicantStatusResponse>(
      "/job/update-applicant-status",
      {
        status: requestData.status
      },
      {
        params: {
          job_id: requestData.job_id,
          creator_id: requestData.creator_id
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating applicant status:", error);
    if (isApiError(error)) {
      throw new Error(error.response?.data?.message ?? "Failed to update applicant status");
    }
    throw new Error("Failed to update applicant status");
  }
};

export interface CreatorReviewResponse {
  message: string;
  data: {
    total_filtered_data: number;
    page_count: number;
    page_data: Array<{
      cv_url: any;
      resume_url: any;
      _id: string;
      bio_data: {
        full_name: string;
        user_name: string;
      };
      profile: {
        cv_url: any;
        full_name: string;
        email: string;
        bio: string;
        phone_number: string;
        years_of_experience: string;
        field: string;
        industry: string;
        location: {
          state: string;
          lga: string;
          _id: string;
        };
        profile_picture: string;
      };
      resume: {
        cv_url: any;
        experience: Array<{
          job_title: string;
          location: string;
          contribution: string;
          ended: string;
          started?: string;
        }>;
        job_title: string;
        full_name: string;
        email: string;
        location: string;
        phone_number: string;
        education: Array<{
          course: string;
          school: string;
          started: string;
          ended: string;
        }>;
        brief: string;
        skills: string[];
        other_skills: string[];
        certifications: string[];
        links: {
          linkedin: string;
          twitter: string;
          instagram: string;
          tiktok: string;
        };
      };
      portfolio?: {
        template_type?: string;
      };
    }>;
  };
}

export const getCreatorReview = async (creatorId: string): Promise<CreatorReviewResponse> => {
  try {
    const response = await apiClient.get<CreatorReviewResponse>(
      `/recruiter/get-creator-review?creatorId=${creatorId}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching creator review:', error);
    if (isApiError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to fetch creator data');
    }
    throw new Error('Failed to fetch creator data');
  }
};


export const closeJob = async (jobId: string, reason: string) => {
  try {
    const response = await apiClient.patch(`/job/close`, 
      { reason }, 
      { params: { job_id: jobId } }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error closing job:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to close job');
  }
};

// Get all jobs (for listing jobs in dashboard)
export const getAllJobs = async (params?: {
  status?: 'ACTIVE' | 'CLOSED';
  title?: string;
  work_mode?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await apiClient.get<{
      status: number;
      message: string;
      data: {
        total_filtered_data: number;
        page_count: number;
        page_data: any[];
      };
    }>('/job/get', { params });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch jobs');
  }
};

// Get job by ID (to get full job details including ID)
export const getJobById = async (jobId: string) => {
  try {
    const response = await apiClient.get(`/job/get`, {
      params: { job_id: jobId }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching job by ID:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch job details');
  }
};

// Helper function to find job by title from the jobs list
export const findJobByTitle = async (jobTitle: string) => {
  try {
    // First get all active jobs
    const response = await getAllJobs({ status: 'ACTIVE' });
    const jobs = response.data.page_data || [];
    
    // Find the job with matching title (case insensitive)
    const matchingJob = jobs.find((job: any) => 
      job.title?.toLowerCase() === jobTitle.toLowerCase() ||
      job.job_title?.toLowerCase() === jobTitle.toLowerCase()
    );
    
    return matchingJob;
  } catch (error: any) {
    console.error('Error finding job by title:', error);
    throw new Error('Failed to find job by title');
  }
};