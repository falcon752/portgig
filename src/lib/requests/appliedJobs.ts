import apiClient from "@/service/apiClient"
import type { Job } from "./jobs" 

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

interface AppliedJobsApiResponse {
  status: number
  message: string
  data: {
    total_filtered_data: number
    page_count: number
    page_data: Job[] 
  }
}

interface FetchAppliedJobsParams {
  title?: string
  work_mode?: string
  creatorJob: string 
}

export async function fetchAppliedJobsApi(params: FetchAppliedJobsParams): Promise<AppliedJobsApiResponse> {
  try {
    const queryParams = {
      ...params,
    }

    const response = await apiClient.get<AppliedJobsApiResponse>("/job/creator-get-jobs", {
      params: queryParams,
    })
    return response.data
  } catch (error: unknown) {
    console.error("Error fetching applied jobs:", error)
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!)
    }
    throw new Error("Failed to fetch applied jobs data")
  }
}
