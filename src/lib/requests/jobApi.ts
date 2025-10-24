import apiClient from "@/service/apiClient";

export interface CreateJobPayload {
  title: string;
  description: string;
  salary_range: string;
  work_mode: string;
  location: string;
  technical: string[];
  soft: string[];
  deadline: string;
}

export interface CreateJobResponse {
  status: number;
  message: string;
  data: {
    job_id: string;
    title: string;
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

/**
 * Function to create a new job post.
 * @param payload The data for the new job post.
 * @returns A promise that resolves with the API response data.
 */
export const createJobPost = async (
  payload: CreateJobPayload
): Promise<CreateJobResponse> => {
  try {
    const response = await apiClient.post<CreateJobResponse>(
      "/job/create",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating job post:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to create job post");
  }
};
