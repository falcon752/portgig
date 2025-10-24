import axios from "axios";
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

// Function to refresh access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.get(
      `creator/refresh-access-token?refresh_token=${refreshToken}`
    );
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Update stored tokens
    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Clear tokens on refresh failure
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};
