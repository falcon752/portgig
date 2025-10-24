import apiClient from "@/service/apiClient"
import type { Job, JobsApiResponse } from "./jobs" 

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

interface FetchJobDetailsParams {
  id: string 
}

export async function fetchJobDetailsApi(params: FetchJobDetailsParams): Promise<Job | null> {
  try {
    const response = await apiClient.get<JobsApiResponse>("/job/creator-get-jobs", {
      params: { _id: params.id }, // Pass the ID from params as _id
    })

    // Assuming page_data will contain the specific job if found
    if (response.data.data.page_data && response.data.data.page_data.length > 0) {
      return response.data.data.page_data[0] // Return the first job found
    }
    return null // No job found with the given ID
  } catch (error: unknown) {
    console.error(`Error fetching job details for ID ${params.id}:`, error)
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!)
    }
    throw new Error("Failed to fetch job details")
  }
}
