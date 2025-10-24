import Cookies from "universal-cookie"
import apiClient from "../../service/apiClient"
import type { PortfolioApiPayload, GetPortfolioResponse, ActualUserData, ApiPortfolioData } from "@/types/portfolio" 

interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success?: boolean
}

interface ApiError {
  message?: string
  error?: string
}

export const uploadAllMedia = async (filesToUpload: File[]): Promise<string[]> => {
  if (filesToUpload.length === 0) {
    return []
  }
  try {
    const formData = new FormData()
    filesToUpload.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file)
      }
    })
    const cookies = new Cookies()
    const token = cookies.get("access_token")

    const headers: Record<string, string> = {
      "Content-Type": "multipart/form-data",
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await apiClient.post("/creator/upload-portfolio-files", formData, {
      headers: headers,
    })

    if (response.data && Array.isArray(response.data.files)) {
      return response.data.files
    } else {
      console.error("Unexpected response structure from batch file upload API:", response.data)
      throw new Error("Batch file upload successful, but could not retrieve file URLs from response.")
    }
  } catch (error: any) {
    console.error("Error during batch file upload:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || error.response?.data?.error || "Failed to upload files")
  }
}

// Generic save function for any portfolio type
export const savePortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put("/creator/update-profile?section=PORTFOLIO", { portfolio: payload })
    return response.data
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: ApiError }; message?: string }
    console.error("Error saving portfolio:", apiError.response?.data || apiError.message)
    throw new Error(apiError.response?.data?.message || apiError.response?.data?.error || "Failed to save portfolio")
  }
}

export const saveWriterPortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  return savePortfolio(payload)
}
export const saveVideographerPortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  return savePortfolio(payload)
}
export const saveDeveloperPortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  return savePortfolio(payload)
}
export const savePhotographerPortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  return savePortfolio(payload)
}
export const saveSocialMediaManagerPortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  return savePortfolio(payload)
}
export const saveDesignerPortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  return savePortfolio(payload)
}

/**
 * Fetches the entire user profile, including all portfolio sections.
 * @param token The authentication token.
 * @returns The full profile data wrapped in GetPortfolioResponse.
 */
export async function getPortfolio(token: string): Promise<GetPortfolioResponse> {
  try {
    if (!token) {
      console.error("getPortfolio: No token provided. Cannot fetch authenticated portfolio.")
      throw new Error("Authentication token is required to fetch portfolio.")
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    const response = await apiClient.get("/creator/profile", { headers })


    const apiResponse = response.data
    const actualUserData: ActualUserData = apiResponse.data

    return {
      data: {
          user: {
              message: apiResponse.message || "Success",
              data: actualUserData,
          },
          portfolio: {} as ApiPortfolioData
      },
      message: "Portfolio fetched successfully",
    }
  } catch (error: any) {
    console.error("getPortfolio: Error fetching portfolio:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || error.response?.data?.error || "Failed to fetch portfolio")
  }
}
