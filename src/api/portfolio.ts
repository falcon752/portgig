
import Cookies from "universal-cookie"
import apiClient from "../../service/apiClient"
import type { PortfolioApiPayload, GetPortfolioResponse } from "@/types/portfolio"

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

export const savePortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(
      "/creator/update-profile?section=PORTFOLIO",
      payload, 
    )
    return response.data
  } catch (error: unknown) {
    const apiError = error as {
      response?: { data?: ApiError }
      message?: string
    }
    console.error("Error saving portfolio:", apiError.response?.data || apiError.message)
    throw new Error(apiError.response?.data?.message || apiError.response?.data?.error || "Failed to save portfolio")
  }
}

export const getPortfolio = async (authToken: string, userId: string): Promise<GetPortfolioResponse> => {
    try {
      const response = await apiClient.get(`/creator/profile?creatorId=${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      return response.data;
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: ApiError }
        message?: string
      }
      console.error("Error fetching portfolio:", apiError.response?.data || apiError.message);
      throw new Error(apiError.response?.data?.message || apiError.response?.data?.error || "Failed to fetch portfolio");
    }
  };

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