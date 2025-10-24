import apiClient from "@/service/apiClient"
import type { JobsApiResponse } from "./jobs" 

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}
const isApiError = (error: unknown): error is Error & ApiErrorResponse => {
  return error instanceof Error && typeof (error as ApiErrorResponse)?.response?.data?.message === "string"
}

export async function fetchJobHubJobsApi(): Promise<JobsApiResponse> {
  try {
    const response = await apiClient.get<JobsApiResponse>("/job/creator-get-jobs")
    return response.data
  } catch (error: unknown) {
    console.error("Error fetching job hub jobs:", error)
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!)
    }
    throw new Error("Failed to fetch job hub data")
  }
}
