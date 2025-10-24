import Cookies from "universal-cookie";
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

export const uploadAllMedia = async (
  filesToUpload: File[]
): Promise<string[]> => {
  if (filesToUpload.length === 0) {
    return [];
  }
  try {
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });
    const cookies = new Cookies();
    const token = cookies.get("access_token");

    const headers: Record<string, string> = {
      "Content-Type": "multipart/form-data",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiClient.post(
      "/creator/upload-portfolio-files",
      formData,
      {
        headers: headers,
      }
    );

    if (response.data && Array.isArray(response.data.files)) {
      return response.data.files;
    } else {
      console.error(
        "Unexpected response structure from batch file upload API:",
        response.data
      );
      throw new Error(
        "Batch file upload successful, but could not retrieve file URLs from response."
      );
    }
  } catch (error: any) {
    console.error(
      "Error during batch file upload:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to upload files"
    );
  }
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
  creatorId: string
): Promise<GetPortfolioResponse> {
  try {
    if (!creatorId) {
      console.error("getPublicPortfolio: No creator ID provided.");
      throw new Error("Creator ID is required to fetch portfolio.");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      // NO Authorization header - this is a public endpoint
    };

    const url = `/creator/profile?creatorId=${encodeURIComponent(creatorId)}`;
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
        "Portfolio not found. The creator ID may be invalid or the portfolio may not be public."
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
 * Server-side function that fetches portfolio data using creatorId
 * This will be used in your Template4Page component
 */
export async function getPortfolioServer(
  creatorId: string
): Promise<GetPortfolioResponse> {
  console.log(
    "getPortfolioServer: Fetching portfolio for creatorId:",
    creatorId
  );
  return getPublicPortfolio(creatorId);
}
