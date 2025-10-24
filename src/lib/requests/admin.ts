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

export interface User {
  _id: string;
  auth: {
    email: string;
    provider: string;
  };
  bio_data: {
    full_name: string;
    user_name?: string;
  };
  company_info?: {
    company_name: string;
    about_us?: string;
  };
  profile?: {
    phone_number?: string;
    industry?: string;
    location?:
      | string
      | {
          state: string;
          lga: string;
          _id: string;
        };
    social_links?: {
      twitter?: string;
      instagram?: string;
      website?: string;
      linkedin?: string;
    };
    years_of_experience?: string;
    field?: string;
  };
  rating: number;
  ratings: any[];
  created_at: string;
  updated_at: string;
  __v: number;
  resume?: any;
  profile_views?: any;
  social_clicks?: any;
}

export interface JobSkills {
  technical: string[];
  soft: string[];
  responsibilities?: string[];
  requirements?: string[];
  others?: string;
}

export interface JobApplicant {
  id: string;
  status: string;
  views: number;
  application_date: string;
  user_name: string;
  full_name: string;
  email: string;
  rating: number;
  profile: any;
  resume: any;
  portfolio: any;
  profile_views: any;
  social_clicks: any;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  salary_range: string;
  deadline: string;
  work_mode: string;
  location: string;
  skills: JobSkills;
  status: string;
  created_at: string;
  updated_at: string;
  recruiter: {
    full_name: string;
    company_name: string;
  };
  applicants?: JobApplicant | object;
  applicant_status_counts: {
    pending: number;
    selected: number;
    shortlisted: number;
    not_qualified: number;
  };
}

export interface AdminUsersData {
  creators: User[];
  recruiters: User[];
  totalCreators: number;
  totalRecruiters: number;
}

export interface AdminUsersApiResponse {
  status: number;
  message: string;
  data: AdminUsersData;
}

export interface DashboardJobsData {
  jobs: Job[];
  total_jobs_posted: number;
  job_titles: string[];
  total_applicants: number;
  shortlisted_applicants: any[];
  selected_applicants: any[];
  not_qualified_applicants: any[];
  applicant_details: any[];
  applicant_status_counts: {
    pending: number;
    selected: number;
    shortlisted: number;
    not_qualified: number;
  };
  latest_application: any;
}

export interface DashboardJobsApiResponse {
  status: number;
  message: string;
  data: DashboardJobsData;
}

export interface UserByIdApiResponse {
  status: number;
  message: string;
  data: User;
}

export interface DeleteAccountResponse {
  status: number;
  message: string;
  data: User;
}

export interface UpdateRecruiterStatusResponse {
  status: number;
  message: string;
  data: any;
}

export interface NewsletterConfig {
  topic: string;
  description: string;
  mainImage: string;
  content: string;
  ctaLink: string;
  ctaText: string;
  sections: {
    title: string;
    content: string;
    image: string;
  }[];
}

export interface NewsletterRecipient {
  recipientType: "ALL" | "ALL_CREATORS" | "ALL_RECRUITERS";
  specificEmails?: string[];
}

export interface NewsletterData {
  newsletterConfig: NewsletterConfig;
  newsletterRecipient: NewsletterRecipient;
}

// Email download types
export type UserType =
  | "WRITER"
  | "SOCIAL_MEDIA_MANAGER"
  | "DEVELOPER"
  | "DESIGNER"
  | "PHOTOGRAPHER"
  | "VIDEOGRAPHER"
  | "ALL_CREATORS"
  | "ALL_RECRUITERS";

export interface EmailsResponse {
  success: boolean;
  template_type: string;
  emails: string[];
}

export async function fetchAllUsersAdmin(
  page: number = 1,
  limit: number = 10000
): Promise<AdminUsersData> {
  try {
    const response = await apiClient.get<AdminUsersApiResponse>(
      `/recruiter/all-users-by-admin?limit=${limit}&page=${page}`
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error fetching all users:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch users data");
  }
}

export async function fetchUserByIdAdmin(userId: string): Promise<User> {
  try {
    const response = await apiClient.get<UserByIdApiResponse>(
      `/recruiter/get-user-by-id/${userId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    console.error(`Error fetching user by ID ${userId}:`, error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch user details");
  }
}

export async function fetchDashboardJobsAdmin(): Promise<DashboardJobsData> {
  try {
    const response = await apiClient.get<DashboardJobsApiResponse>(
      "/recruiter/get-job-details"
    );

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error fetching dashboard jobs:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch jobs data");
  }
}

export const deleteUserAccountAdmin = async (
  userId: string,
  userType: "creator" | "recruiter"
) => {
  try {
    const response = await apiClient.delete("/recruiter/delete-account", {
      params: {
        userTypeId: userId,
        userType: userType,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

export const updateRecruiterStatusAdmin = async (
  recruiterId: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<UpdateRecruiterStatusResponse> => {
  try {
    const response = await apiClient.put<UpdateRecruiterStatusResponse>(
      "/recruiter/update-recruiter-status",
      {},
      {
        params: {
          recruiterId: recruiterId,
          status: status,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Update recruiter status error:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to update recruiter status");
  }
};

export async function sendNewsletterAdmin(
  newsletterData: NewsletterData
): Promise<any> {
  try {
    const response = await apiClient.post(
      "/recruiter/newsletter",
      newsletterData
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error sending newsletter:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to send newsletter");
  }
}

// New function to fetch emails by user type
export async function fetchEmailsByType(
  type: UserType
): Promise<EmailsResponse> {
  try {
    const response = await apiClient.get<EmailsResponse>(
      "/recruiter/get-emails",
      {
        params: { type },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching emails for type ${type}:`, error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch emails");
  }
}

// Helper function to download emails as CSV
export function downloadEmailsAsCSV(
  emails: string[],
  filename: string = "user_emails.csv"
): void {
  if (emails.length === 0) {
    throw new Error("No emails to download");
  }

  const csvContent =
    "data:text/csv;charset=utf-8," +
    "Email\n" +
    emails.map((email) => email).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper function to download emails as TXT
export function downloadEmailsAsTXT(
  emails: string[],
  filename: string = "user_emails.txt"
): void {
  if (emails.length === 0) {
    throw new Error("No emails to download");
  }

  const txtContent = "data:text/plain;charset=utf-8," + emails.join("\n");
  const encodedUri = encodeURI(txtContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function getDashboardStats() {
  try {
    const [usersData, jobsData] = await Promise.all([
      fetchAllUsersAdmin(),
      fetchDashboardJobsAdmin(),
    ]);

    return {
      totalUsers: usersData.totalCreators + usersData.totalRecruiters,
      totalRecruiters: usersData.totalRecruiters,
      totalCreators: usersData.totalCreators,
      totalJobs: jobsData.total_jobs_posted,
      totalApplicants: jobsData.total_applicants,
      users: usersData,
      jobs: jobsData,
      activeJobs: jobsData.jobs.filter((job) => job.status === "ACTIVE").length,
      pendingApplicants: jobsData.applicant_status_counts.pending,
      shortlistedApplicants: jobsData.applicant_status_counts.shortlisted,
      selectedApplicants: jobsData.applicant_status_counts.selected,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
}

export async function fetchJobDetailsAdmin(): Promise<Job[]> {
  try {
    const dashboardData = await fetchDashboardJobsAdmin();
    return dashboardData.jobs;
  } catch (error: unknown) {
    console.error("Error fetching job details:", error);
    throw error;
  }
}
