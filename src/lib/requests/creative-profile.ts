import apiClient from "@/service/apiClient";
import { AuthStorage } from "@/src/lib/requests/auth.new"; 

interface ProfileViewHistory {
  viewed_at: string;
  recipient_role: string;
  viewer: {
    viewer_id: string | null;
    viewer_name: string;
  };
}

interface ProfileViews {
  number: number;
  last_viewed: string | null;
  view_history: ProfileViewHistory[];
}

interface Location {
  state: string;
  lga: string;
  _id: string;
}

interface Profile {
  phone_number?: string;
  years_of_experience?: string;
  field?: string;
  industry?: string;
  location?: Location;
  bio?: string;
  profile_picture?: string;
}

export interface CreatorProfileData {
  _id: string;
  bio_data: {
    full_name: string;
    user_name: string;
  };
  rating: number;
  profile: Profile;
  profile_views: ProfileViews;
  social_clicks: {
    linkedin: number;
    twitter: number;
    instagram: number;
    tiktok: number;
  };
  created_at: string;
  updated_at: string;
  portfolio?: any;
  ratings?: any[];
  resume?: any;
}

export interface CreatorProfileResponse {
  message: string;
  data: CreatorProfileData;
}

interface ProfileViewRequest {
  userId: string;
  viewerId: string;
  recipientRole: 'recruiter' | 'creator';
}

interface ProfileViewResponse {
  message: string;
  data?: any;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const isApiError = (error: unknown): error is Error & ApiErrorResponse => {
  return error instanceof Error && typeof (error as ApiErrorResponse)?.response?.data?.message === "string";
};

export async function fetchCreatorProfileApi(creatorId?: string): Promise<CreatorProfileResponse> {
  try {
    // Use provided creatorId or get from AuthStorage
    const userIdToUse = creatorId || AuthStorage.getUserId();
    
    if (!userIdToUse) {
      throw new Error("Creator ID is required to fetch profile");
    }

    // Use query parameter format
    const response = await apiClient.get<CreatorProfileResponse>(
      `/creator/profile?creatorId=${userIdToUse}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching creator profile:", error);
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch creator profile data");
  }
}

export const trackProfileViewApi = async ({ 
  userId, 
  viewerId, 
  recipientRole 
}: ProfileViewRequest): Promise<ProfileViewResponse> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!API_BASE_URL) {
      throw new Error("API base URL is not defined");
    }
    
    try {
      const params = new URLSearchParams({
        userId: userId,           
        viewerId: viewerId,       
        recipientRole: recipientRole 
      });
      
      const url = `${API_BASE_URL}/creator/profile-views/?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
  
      const data: ProfileViewResponse = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error tracking profile view:', error);
      throw error;
    }
};