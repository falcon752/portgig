import apiClient from "@/service/apiClient";
import { ReactNode } from "react";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
const isApiError = (error: unknown): error is Error & ApiErrorResponse => {
  return (
    error instanceof Error &&
    typeof (error as ApiErrorResponse)?.response?.data?.message === "string"
  );
};

export interface Certification {
  _id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date?: string;
  field_of_study?: string;
}

export interface Rating {
  _id: string;
  score: number;
  comment?: string;
  rated_by_user_id: string;
  created_at: string;
}

export interface Creator {
  _id: string;
  bio_data: {
    phone: string;
    email: string;
    bio: string;
    full_name: string;
    user_name: string;
  };
  rating: number;
  portfolio: {
    template_type: string;
  };
  profile: {
    profile_picture: string;
    years_of_experience(years_of_experience: any): import("react").ReactNode;
    field: ReactNode;
    location: any;
    bio: string;
    profile: {
      profile_picture: string;
      years_of_experience: string;
      field: string;
      bio: string;
      industry: string;
      location: {
        state: string;
        lga: string;
        _id: string;
      };
    };
  };
  resume: {
    skills: string[];
    other_skills: string[];
    certifications: Certification[];
    experience: Experience[];
    education: Education[];
  };
  profile_views: number;
  social_clicks: {
    linkedin: number;
    twitter: number;
    instagram: number;
    tiktok: number;
  };
  created_at: string;
  updated_at: string;
  ratings: Rating[];
}

interface CreatorsApiResponse {
  message: string;
  data: {
    total_filtered_data: number;
    page_count: number;
    page_data: Creator[];
  };
}

export async function fetchCreatorsApi(): Promise<CreatorsApiResponse> {
  try {
    const response = await apiClient.get<CreatorsApiResponse>(
      "/creator/get-creators"
    );
    return response.data;
  } catch (error: unknown) {
    if (isApiError(error)) {
      throw new Error(error.response!.data!.message!);
    }
    throw new Error("Failed to fetch creators data");
  }
}
