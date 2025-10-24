import apiClient from "@/service/apiClient";
import {
  ApiResponse,
  CreatorFormData,
  LoginCredentials,
  RecruiterFormData,
} from "@/types/auth";
import { RecruiterProfilePayload, RecruiterResponse } from "@/types/recruiter";
import {
  PasswordChangeType,
  ProfileUpdateFormData,
  ResumePayload,
  UserResponse,
} from "@/types/user";
import { AxiosError } from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ADMIN_EMAILS = ["portgigacademy@gmail.com"];

const ENDPOINTS = {
  CREATOR: {
    REGISTER: "/creator/register",
    LOGIN: "/creator/login",
    VALIDATE_OTP: "/creator/validate-registration-otp",
    RESEND_OTP: "/creator/resend-otp",
    PROFILE: "/creator/profile",
    PROFILE_UPDATE: "/creator/update-profile?section=",
    CHANGE_PASSWORD: "/creator/update-password",
  },
  RECRUITER: {
    REGISTER: "/recruiter/register",
    LOGIN: "/recruiter/login",
    VALIDATE_OTP: "/recruiter/validate-registration-otp",
    RESEND_OTP: "/recruiter/resend-otp",
    PROFILE: "/recruiter/profile",
    PROFILE_UPDATE: "/recruiter/update-profile?section=",
    CHANGE_PASSWORD: "/recruiter/update-password",
  },
};

interface ErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}

class ApiError extends Error {
  status?: number;
  response?: ErrorResponse;

  constructor(message: string, status?: number, response?: ErrorResponse) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

export const handleApiError = (error: AxiosError<ErrorResponse>) => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "An unexpected error occurred";
  const status = error.response?.status;
  throw new ApiError(errorMessage, status, error.response?.data);
};

const extractUserIdFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};

const isValidJWT = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const determineUserType = (
  email: string,
  originalType: "creator" | "recruiter"
): "creator" | "recruiter" | "admin" => {
  if (
    originalType === "recruiter" &&
    ADMIN_EMAILS.includes(email.toLowerCase())
  ) {
    return "admin";
  }
  return originalType;
};

export const determineGoogleUserType = (
  email: string,
  originalType: "Creator" | "Recruiter"
): "Creator" | "Recruiter" => {
  if (
    originalType === "Recruiter" &&
    ADMIN_EMAILS.includes(email.toLowerCase())
  ) {
    return "Creator";
  }
  return originalType;
};

// Auth storage management
export const AuthStorage = {
  setAuth: (
    token: string,
    refreshToken: string,
    userType: "creator" | "recruiter" | "admin",
    userData: any,
    email?: string
  ) => {
    if (!isValidJWT(token)) {
      console.error("Attempting to set invalid JWT token");
      return false;
    }

    const options = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 24 * 60 * 60,
    };

    try {
      const userId = extractUserIdFromToken(token);

      cookies.set("access_token", token, options);
      cookies.set("refresh_token", refreshToken, options);
      cookies.set("userType", userType, options);
      cookies.set("userData", JSON.stringify(userData), options);
      cookies.set("storedProfile", JSON.stringify(userData), options);
      if (email) cookies.set("userEmail", email, options);
      if (userId) cookies.set("userId", userId, options);

      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("storedProfile", JSON.stringify(userData));
      if (email) localStorage.setItem("userEmail", email);
      if (userId) localStorage.setItem("userId", userId);

      return true;
    } catch (error) {
      console.error("Error setting auth data:", error);
      return false;
    }
  },

  clearAuth: () => {
    try {
      const cookieOptions = { path: "/" };

      cookies.remove("access_token", cookieOptions);
      cookies.remove("refresh_token", cookieOptions);
      cookies.remove("userType", cookieOptions);
      cookies.remove("userData", cookieOptions);
      cookies.remove("storedProfile", cookieOptions);
      cookies.remove("userEmail", cookieOptions);
      cookies.remove("userId", cookieOptions);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userData");
      localStorage.removeItem("storedProfile");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");

     
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  },

  isAuthenticated: () => {
    const token = cookies.get("access_token") || localStorage.getItem("access_token");
    return token ? isValidJWT(token) : false;
  },

  getUserType: () => {
    if (!AuthStorage.isAuthenticated()) {
      return null;
    }
    return (
      cookies.get("userType") ||
      localStorage.getItem("userType") ||
      null
    ) as "creator" | "recruiter" | "admin" | null;
  },

  getUserId: (): string | null => {
    if (!AuthStorage.isAuthenticated()) {
      return null;
    }
    return cookies.get("userId") || localStorage.getItem("userId") || null;
  },

  getAccessToken: (): string | null => {
    const token = cookies.get("access_token") || localStorage.getItem("access_token");
    return token && isValidJWT(token) ? token : null;
  },

  getRefreshToken: (): string | null => {
    if (!AuthStorage.isAuthenticated()) {
      return null;
    }
    return cookies.get("refresh_token") || localStorage.getItem("refresh_token") || null;
  },

  getStoredProfile: <T = any>(): T | null => {
    if (!AuthStorage.isAuthenticated()) {
      return null;
    }
    const data = cookies.get("storedProfile") || localStorage.getItem("storedProfile");
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("Error parsing stored profile:", error);
      return null;
    }
  },

  isAdmin: () => {
    const userType = AuthStorage.getUserType();
    return userType === "admin";
  },

  hasRecruiterPermissions: () => {
    const userType = AuthStorage.getUserType();
    return userType === "recruiter" || userType === "admin";
  },

  getUserData: <T = any>(): T | null => {
    if (!AuthStorage.isAuthenticated()) {
      return null;
    }
    const data = cookies.get("userData") || localStorage.getItem("userData");
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("Error parsing userData:", error);
      return null;
    }
  },

  getUserEmail: (): string | null => {
    if (!AuthStorage.isAuthenticated()) {
      return null;
    }
    return cookies.get("userEmail") || localStorage.getItem("userEmail") || null;
  },

  validateAndCleanAuth: (): boolean => {
    const token = cookies.get("access_token") || localStorage.getItem("access_token");
    if (token && !isValidJWT(token)) {
      console.log("Invalid token detected, clearing auth state");
      AuthStorage.clearAuth();
      return false;
    }
    return !!token;
  },
};

export const CreatorAuth = {
  register: async (formData: CreatorFormData): Promise<ApiResponse> => {
    try {
      const requestData = {
        full_name: formData.full_name,
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password,
        state: formData.state,
        lga: formData.lga,
        years_of_experience: formData.years_of_experience,
        industry: formData.industry,
        field: formData.field,
      };

      const response = await apiClient.post(
        ENDPOINTS.CREATOR.REGISTER,
        requestData
      );

      if (response.data.access_token) {
        const userType = determineUserType(formData.email, "creator");
        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile || response.data.data,
          formData.email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.CREATOR.LOGIN,
        credentials
      );

      if (response.data.access_token) {
        const userType = determineUserType(credentials.email, "creator");
        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile,
          credentials.email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  validateRegistration: async (data: { token: string; email: string }) => {
    try {
      const response = await apiClient.put(
        ENDPOINTS.CREATOR.VALIDATE_OTP,
        data
      );

      if (response.data.access_token) {
        const userType = determineUserType(data.email, "creator");
        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile || response.data.data,
          data.email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return {
        ...response.data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        return {
          ...error.response.data,
          status: error.response.status,
        };
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  resendOTP: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put(ENDPOINTS.CREATOR.RESEND_OTP, {
        type: "REGISTRATION",
        s_type: "EMAIL",
        email: email,
      });

      return {
        ...response.data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        return {
          ...error.response.data,
          status: error.response.status,
        };
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  getProfile: async (userId?: string): Promise<UserResponse> => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const currentUserType = AuthStorage.getUserType();
      const userIdToUse = userId || AuthStorage.getUserId();

      if (!userIdToUse) {
        throw new Error("User ID is required to fetch profile");
      }

      if (currentUserType === "creator") {
        const endpoint = `${ENDPOINTS.CREATOR.PROFILE}?creatorId=${userIdToUse}`;
        const response = await apiClient.get(endpoint);

        if (response.data.profile) {
          const userData = AuthStorage.getUserData();
          const currentToken = AuthStorage.getAccessToken();
          const currentRefreshToken = AuthStorage.getRefreshToken();

          if (currentToken) {
            AuthStorage.setAuth(
              currentToken,
              currentRefreshToken || "",
              currentUserType,
              { ...userData, ...response.data.profile }
            );
          }
        }

        return response.data;
      }

      if (currentUserType === "admin") {
        const storedProfile = AuthStorage.getStoredProfile<UserResponse>();
        return (
          storedProfile ||
          ({ message: "Admin profile not available" } as UserResponse)
        );
      }

      throw new Error("Invalid user type for this operation");
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  logout: async (): Promise<boolean> => {
    try {
      if (!AuthStorage.isAuthenticated()) {
        console.warn("No active session to logout");
        return true; 
      }

      AuthStorage.clearAuth();
      return true;
    } catch (error) {
      console.error("Error during creator logout:", error);
      AuthStorage.clearAuth();
      return false;
    }
  },

  updateProfile: async (
    formData: ProfileUpdateFormData,
    slug: string,
    userId?: string
  ) => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const userIdToUse = userId || AuthStorage.getUserId();
      let endpoint = `${ENDPOINTS.CREATOR.PROFILE_UPDATE}${slug}`;

      if (userIdToUse) {
        endpoint += `&userId=${userIdToUse}`;
      }

      const response = await apiClient.put(endpoint, formData);
      return response.data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  updateResume: async (
    formData: ResumePayload,
    slug: string,
    userId?: string
  ) => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const userIdToUse = userId || AuthStorage.getUserId();
      let endpoint = `${ENDPOINTS.CREATOR.PROFILE_UPDATE}${slug}`;

      if (userIdToUse) {
        endpoint += `&userId=${userIdToUse}`;
      }

      const response = await apiClient.put(endpoint, formData);
      return response.data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  changePassword: async (formData: PasswordChangeType, userId?: string) => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const userIdToUse = userId || AuthStorage.getUserId();
      let endpoint = ENDPOINTS.CREATOR.CHANGE_PASSWORD;

      if (userIdToUse) {
        endpoint += `?userId=${userIdToUse}`;
      }

      const response = await apiClient.put(endpoint, formData);
      return response.data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

export const RecruiterAuth = {
  register: async (formData: RecruiterFormData): Promise<ApiResponse> => {
    try {
      const requestData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        company_name: formData.company_name,
        industry: formData.industry,
        about_us: formData.about_us,
      };

      const response = await apiClient.post(
        ENDPOINTS.RECRUITER.REGISTER,
        requestData
      );

      if (response.data.access_token) {
        const userType = determineUserType(formData.email, "recruiter");
        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile || response.data.data,
          formData.email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        return error.response.data;
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.RECRUITER.LOGIN,
        credentials
      );

      console.log("Recruiter login response:", response.data);

      if (response.data.access_token) {
        const userType = determineUserType(credentials.email, "recruiter");
        console.log(
          "Determined user type:",
          userType,
          "for email:",
          credentials.email
        );

        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile,
          credentials.email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  loginWithGoogle: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(
        `${ENDPOINTS.RECRUITER.LOGIN}/google`
      );

      if (response.data.access_token) {
        const email =
          response.data.profile?.auth?.email ||
          response.data.profile?.email ||
          "";
        const userType = determineUserType(email, "recruiter");

        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile,
          email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  validateRegistration: async (data: { token: string; email: string }) => {
    try {
      const response = await apiClient.put(
        ENDPOINTS.RECRUITER.VALIDATE_OTP,
        data
      );

      if (response.data.access_token) {
        const userType = determineUserType(data.email, "recruiter");
        const success = AuthStorage.setAuth(
          response.data.access_token,
          response.data.refresh_token || "",
          userType,
          response.data.profile || response.data.data,
          data.email
        );

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }
      }

      return {
        ...response.data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        return {
          ...error.response.data,
          status: error.response.status,
        };
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  resendOTP: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put(ENDPOINTS.RECRUITER.RESEND_OTP, {
        type: "REGISTRATION",
        s_type: "EMAIL",
        email: email,
      });

      return {
        ...response.data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        return {
          ...error.response.data,
          status: error.response.status,
        };
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  getProfile: async (userId?: string): Promise<RecruiterResponse> => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const userIdToUse = userId || AuthStorage.getUserId();
      if (!userIdToUse) {
        throw new Error("User ID is required to fetch profile");
      }

      const endpoint = `${ENDPOINTS.RECRUITER.PROFILE}`;
      const response = await apiClient.get(endpoint);

      if (response.data.profile) {
        const userData = AuthStorage.getUserData();
        const currentUserType =
          AuthStorage.getUserType() || "recruiter" || "admin";
        const currentToken = AuthStorage.getAccessToken();
        const currentRefreshToken = AuthStorage.getRefreshToken();

        if (currentToken) {
          AuthStorage.setAuth(
            currentToken,
            currentRefreshToken || "",
            currentUserType,
            {
              ...userData,
              ...response.data.profile,
            }
          );
        }
      }

      return response.data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  updateProfile: async (
    formData: RecruiterProfilePayload,
    slug: string,
    userId?: string
  ) => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const userIdToUse = userId || AuthStorage.getUserId();
      let endpoint = `${ENDPOINTS.RECRUITER.PROFILE_UPDATE}${slug}`;

      if (userIdToUse) {
        endpoint += `&userId=${userIdToUse}`;
      }

      const response = await apiClient.put(endpoint, formData);
      return response.data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  changePassword: async (formData: PasswordChangeType, userId?: string) => {
    try {
      if (!AuthStorage.validateAndCleanAuth()) {
        throw new Error("Authentication required");
      }

      const userIdToUse = userId || AuthStorage.getUserId();
      let endpoint = ENDPOINTS.RECRUITER.CHANGE_PASSWORD;

      if (userIdToUse) {
        endpoint += `?userId=${userIdToUse}`;
      }

      const response = await apiClient.put(endpoint, formData);
      return response.data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        AuthStorage.clearAuth();
      }
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  logout: async (): Promise<boolean> => {
    try {
      if (!AuthStorage.isAuthenticated()) {
        console.warn("No active session to logout");
        return true; 
      }

      AuthStorage.clearAuth();
      return true;
    } catch (error) {
      console.error("Error during recruiter logout:", error);
      AuthStorage.clearAuth();
      return false;
    }
  },
};

export const AdminUtils = {
  isCurrentUserAdmin: (): boolean => {
    return AuthStorage.isAdmin();
  },

  getAdminEmails: (): string[] => {
    return [...ADMIN_EMAILS];
  },

  isAdminEmail: (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  },
};

export { AuthStorage as default };