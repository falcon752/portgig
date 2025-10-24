import axios from "axios"
import Cookies from "universal-cookie"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.portgig.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const cookies = new Cookies()
    const token = cookies.get("access_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Create fresh instance to read refresh token
      const cookies = new Cookies()
      const refreshToken = cookies.get("refresh_token")

      console.log("[v0] Token refresh attempt:", {
        hasRefreshToken: !!refreshToken,
      })

      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const newToken = response.data.access_token

          // Update the token in cookies
          cookies.set("access_token", newToken, { path: "/" })

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          cookies.remove("access_token", { path: "/" })
          cookies.remove("refresh_token", { path: "/" })
          cookies.remove("userType", { path: "/" })
          cookies.remove("userData", { path: "/" })

          window.location.href = "/login?error=session_expired"
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
