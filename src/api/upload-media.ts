import apiClient from "../../service/apiClient";
import type {
  PortfolioApiPayload,
  GetPortfolioResponse,
  ActualUserData,
  ApiPortfolioData,
} from "@/types/portfolio";

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

interface ApiError {
  message?: string;
  error?: string;
}

/**
 * Uploads multiple files to Cloudinary via the /api/upload route
 * and returns an array of secure Cloudinary URLs.
 */
export const uploadAllMedia = async (filesToUpload: File[]): Promise<string[]> => {
  if (filesToUpload.length === 0) return [];

  const formData = new FormData();
  filesToUpload.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Failed to upload files");
  if (!Array.isArray(data.files)) throw new Error("Upload succeeded but no URLs returned");

  return data.files as string[];
};


/**
 * Generic function to save any portfolio type.
 */
export const savePortfolio = async (payload: PortfolioApiPayload): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put("/creator/update-profile?section=PORTFOLIO", { portfolio: payload });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: ApiError }; message?: string };
    console.error("Error saving portfolio:", apiError.response?.data || apiError.message);
    throw new Error(
      apiError.response?.data?.message ||
      apiError.response?.data?.error ||
      "Failed to save portfolio"
    );
  }
};

// Convenience functions for all portfolio types
export const saveWriterPortfolio = (payload: PortfolioApiPayload) => savePortfolio(payload);
export const saveVideographerPortfolio = (payload: PortfolioApiPayload) => savePortfolio(payload);
export const saveDeveloperPortfolio = (payload: PortfolioApiPayload) => savePortfolio(payload);
export const savePhotographerPortfolio = (payload: PortfolioApiPayload) => savePortfolio(payload);
export const saveSocialMediaManagerPortfolio = (payload: PortfolioApiPayload) => savePortfolio(payload);
export const saveDesignerPortfolio = (payload: PortfolioApiPayload) => savePortfolio(payload);

/**
 * Fetches the full user profile including portfolio data.
 */
export async function getPortfolio(token: string): Promise<GetPortfolioResponse> {
  if (!token) {
    console.error("getPortfolio: No token provided. Cannot fetch authenticated portfolio.");
    throw new Error("Authentication token is required to fetch portfolio.");
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await apiClient.get("/creator/profile", { headers });

    const apiResponse = response.data;
    const actualUserData: ActualUserData = apiResponse.data;

    return {
      data: {
        user: {
          message: apiResponse.message || "Success",
          data: actualUserData,
        },
        portfolio: {} as ApiPortfolioData,
      },
      message: "Portfolio fetched successfully",
    };
  } catch (error: any) {
    console.error("getPortfolio: Error fetching portfolio:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch portfolio"
    );
  }
}
