export type Education = {
    course: string
    school: string
    started: string 
    ended: string 
  }
  
  export type Experience = {
    location: string
    job_title: string
    contribution: string
    ended: string 
  }
  
  export type UserProfile = {
    _id: string;
    bio_data: {
      full_name: string;
      user_name: string;
    };
    auth?: {
      email?: string;
    }
    rating: number;
      profile: {
        full_name?: string;
      profile: any
      phone_number?: string;
      years_of_experience?: string;
      field?: string;
      industry?: string;
      location?: {
        state?: string;
        lga?: string;
        _id?: string;
      };
      profile_picture?: string;
      email?: string;
      bio?: string;
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      tiktok?: string;
    };
    resume: {
      experience?: Array<{
        started: string
        job_title?: string;
        location?: string;
        contribution?: string;
        ended?: string;
      }>;
      education?: Array<{
        course?: string;
        school?: string;
        started?: string;
        ended?: string;
      }>;
      industry?: string;
      category?: string;
      job_title?: string;
      full_name?: string;
      email?: string;
      phone_number?: string;
      location?: string;
      brief?: string;
      skills?: string[];
      other_skills?: string[];
      certifications?: string[];
      links?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        tiktok?: string;
      };
    };
    profile_views?: {
      number: number;
      last_viewed?: string;
      view_history?: Array<{
        viewed_at: string;
        recipient_role: string;
        viewer: {
          viewer_id: string;
          viewer_name: string;
        };
      }>;
    };
    social_clicks?: {
      linkedin: number;
      twitter: number;
      instagram: number;
      tiktok: number;
    };
    created_at: string;
    updated_at: string;
    ratings?: Array<{
      value: number;
      comment: string;
      created_at: string;
      user: {
        user_id: string;
        username: string;
      };
    }>;
    portfolio?: {
      skills(skills: any): unknown
      services: never[]
      template_type?: string;
      display_name?: string;
      job_titles?: string[];
      location?: string;
      about_me?: string;
      mission?: string;
      head_shot?: string;
      files?: Array<{
        image?: string;
        title?: string;
        link?: string;
      }>;
      fonts?: {
        heading_font?: string;
        body_font?: string;
        colors?: {
          primary?: string;
          accent?: string;
          background?: string;
          text?: string;
        };
      };
      other_services?: string[];
      what_you_get_working_with_me?: string;
      social?: {
        linkedin?: string;
        medium?: string;
        google_drive_link?: string;
        pinterest_or_behance_link?: string;
      };
      template_specific?: {
        case_study: {
            videographer?: { types?: string[] | undefined; videography_skills?: string[] | undefined; video_editing_skills?: string[] | undefined; jobs_open_to?: string | undefined } | undefined; developer?: { services?: string[] | undefined; skills?: string[] | undefined } | undefined; photographer?: { latest_work?: string[] | undefined; jobs_open_to?: string[] | undefined } | undefined; social_media_manager?: { skills?: string[] | undefined; case_study?: string[] | undefined; graphic_design?: string[] | undefined; video_editing?: string[] | undefined; tools?: string[] | undefined } | undefined; designer?: { skills?: string[] | undefined; tools?: string[] | undefined } | undefined; writer?: { // ← Add this as optional
                case_study?: string | undefined // Single string for writer case study
                // Single string for writer case study
                writing_skills?: string[] | undefined; genres?: string[] | undefined; jobs_open_to?: string | undefined
            } | undefined
        } | undefined
        videographer?: {
          types?: string[];
          videography_skills?: string[];
          video_editing_skills?: string[];
          jobs_open_to?: string;
        };
        developer?: {
          cta: string
          availability: string
          services?: string[];
          skills?: string[];
        };
        photographer?: {
          latest_work?: string[];
          jobs_open_to?: string[];
        };
        social_media_manager?: {
          skills?: string[];
          case_study?: string[];
          graphic_design?: string[];
          video_editing?: string[];
          tools?: string[];
        };
        designer?: {
          skills?: string[];
          tools?: string[];
        };
        writer?: { // ← Add this as optional
          case_study?: string; // Single string for writer case study
          writing_skills?: string[];
          genres?: string[];
          jobs_open_to?: string;
        };
      };
    };
  };
  
  
  export type UserResponse = {
    data?: UserProfile  
    profile?: UserProfile  
    message: string
    status?: number  
  }
  
  export type ProfileUpdateFormData = {
    profile: {
      profile_picture?: string
      phone_number?: string
      location?: {
        state: string
        lga: string
      }
      industry?: string
      field?: string
      years_of_experience?: string
      social_links?: {
        linkedin: string
        twitter: string
        instagram: string
        tiktok: string
      }
    }
  }
  
  export interface ResumeInfo {
    brief: string
    full_name: string
    email: string
    phone_number: string
    industry: string
    location: string
    category: string
    job_title: string
    education: Array<{
      course: string
      school: string
      started: string
      ended: string
    }>
    links: {
      linkedin: string
      twitter: string
      instagram: string
      tiktok: string
    }
    skills: Array<{
      value: string
    }>
    experience: Array<{
      location: string
      job_title: string
      contribution: string
      ended: string
    }>
    other_skills: Array<{
      value: string
    }>
    certifications: Array<{
      value: string
    }>
  }
  
  export interface ResumePayload {
    resume_info: {
      brief: string
      full_name: string
      email: string
      phone_number: string
      location: string
      job_title: string
      education: {
        course: string
        school: string
        started: string
        ended: string
      }[]
      links: {
        linkedin: string
        twitter: string
        instagram: string
        tiktok: string
      }
      skills: string[]
      other_skills: string[]
      certifications: string[]
      experience: {
        location: string
        job_title: string
        contribution: string
        ended: string
      }[]
    }
  }
  
  export type PasswordChangeType = {
    old_password: string
    new_password: string
  }
  
  export type PortfolioProject = {
    id: string
    title: string
    description: string
    image?: string
    url?: string
    technologies?: string[]
  }
  
  export type Portfolio = {
    template_type?: string
    title?: string
    description?: string
    images?: string[]
    videos?: string[]
    projects?: PortfolioProject[]
    skills?: string[]
    created_at?: string
    updated_at?: string
  }