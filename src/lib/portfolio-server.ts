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
export const uploadAllMedia = async (
  filesToUpload: File[]
): Promise<string[]> => {
  if (filesToUpload.length === 0) return [];

  const formData = new FormData();
  filesToUpload.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Failed to upload files");
  if (!Array.isArray(data.files)) throw new Error("Upload succeeded but no URLs returned");

  return data.files as string[];
};

// Generic save function for any portfolio type
export const savePortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(
      "/creator/update-profile?section=PORTFOLIO",
      { portfolio: payload }
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as {
      response?: { data?: ApiError };
      message?: string;
    };
    console.error(
      "Error saving portfolio:",
      apiError.response?.data || apiError.message
    );
    throw new Error(
      apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        "Failed to save portfolio"
    );
  }
};

export const saveWriterPortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  return savePortfolio(payload);
};
export const saveVideographerPortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  return savePortfolio(payload);
};
export const saveDeveloperPortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  return savePortfolio(payload);
};
export const savePhotographerPortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  return savePortfolio(payload);
};
export const saveSocialMediaManagerPortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  return savePortfolio(payload);
};
export const saveDesignerPortfolio = async (
  payload: PortfolioApiPayload
): Promise<ApiResponse> => {
  return savePortfolio(payload);
};

/**
 * Fetches a public portfolio by creator ID - NO AUTHENTICATION REQUIRED
 * This is used for shared portfolio links that anyone can view
 * @param creatorId The creator ID to fetch portfolio for
 * @returns The full profile data wrapped in GetPortfolioResponse.
 */
export async function getPublicPortfolio(
  creatorIdOrUsername: string,
  isUsername: boolean = false
): Promise<GetPortfolioResponse> {
  try {
    if (!creatorIdOrUsername) {
      console.error("getPublicPortfolio: No creator ID or username provided.");
      throw new Error("Creator ID or username is required to fetch portfolio.");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      // NO Authorization header - this is a public endpoint
    };

    const queryParam = isUsername ? 'username' : 'creatorId';
    const url = `/creator/profile?${queryParam}=${encodeURIComponent(creatorIdOrUsername)}`;
    console.log("getPublicPortfolio: Making public request to:", url);

    const response = await apiClient.get(url, { headers });

    const apiResponse = response.data;
    const actualUserData: ActualUserData = apiResponse.data;

    return {
      data: {
        user: {
          message: apiResponse.message || "Success",
          data: actualUserData,
        },
        portfolio: actualUserData?.portfolio as ApiPortfolioData,
      },
      message: "Portfolio fetched successfully",
    };
  } catch (error: any) {
    console.error(
      "getPublicPortfolio: Error fetching portfolio:",
      error.response?.data || error.message
    );
    console.error("getPublicPortfolio: Status code:", error.response?.status);

    if (error.response?.status === 404) {
      throw new Error(
        isUsername 
          ? `Creator with username "${creatorIdOrUsername}" not found. Please check the username and try again.`
          : "Portfolio not found. The creator ID may be invalid or the portfolio may not be public."
      );
    }

    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message ||
        isUsername
          ? `Creator with username "${creatorIdOrUsername}" not found. Please check the username and try again.`
          : "Invalid request. Please check the creator information."
      );
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch portfolio. Please try again later."
    );
  }
}

/**
 * Fetches the authenticated user's portfolio using token from cookies
 * @param token The authentication token.
 * @param userId The user ID/creator ID to fetch profile for
 * @returns The full profile data wrapped in GetPortfolioResponse.
 */
export async function getPortfolio(
  token: string,
  userId: string
): Promise<GetPortfolioResponse> {
  try {
    if (!token) {
      console.error(
        "getPortfolio: No token provided. Cannot fetch authenticated portfolio."
      );
      throw new Error("Authentication token is required to fetch portfolio.");
    }

    if (!userId) {
      console.error("getPortfolio: No user ID provided.");
      throw new Error("User ID is required to fetch portfolio.");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const url = `/creator/profile?creatorId=${encodeURIComponent(userId)}`;

    const response = await apiClient.get(url, { headers });

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
    console.error(
      "getPortfolio: Error fetching portfolio:",
      error.response?.data || error.message
    );
    console.error("getPortfolio: Status code:", error.response?.status);

    if (error.response?.status === 403) {
      throw new Error(
        "Access forbidden. You may not have permission to view this portfolio."
      );
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch portfolio"
    );
  }
}

/**
 * Server-side function that fetches portfolio data using creatorId or username
 * This will be used in your Template4Page component
 */
export async function getPortfolioServer(
  creatorIdOrUsername: string,
  isUsername: boolean = false
): Promise<GetPortfolioResponse> {
  console.log(
    "getPortfolioServer: Fetching portfolio for",
    isUsername ? "username" : "creatorId",
    ":",
    creatorIdOrUsername
  );
  return getPublicPortfolio(creatorIdOrUsername, isUsername);
}
