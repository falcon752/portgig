import { CSSProperties } from "react";

export interface CustomCSSProperties extends CSSProperties {
  [key: `--${string}`]: string;
}

export interface ApiPortfolioFonts {
  heading_font: string;
  body_font: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface PortfolioFormData {
  displayName: string;
  jobTitles: string;
  location: string;
  headShot: { previewUrl: string | null; file: File | null };
  aboutMe: string;
  otherServices?: string[];
}

export interface WriterFormData extends PortfolioFormData {
  case_study: string;
  whatYouGet: string;
  linkedinLink: string;
  mediumLink: string;
  genericPortfolioFiles: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
    link: string;
  }>;
}

export interface VideographerFormData extends PortfolioFormData {
  types: string[];
  videographySkills: string[];
  videoEditingSkills: string[];
  jobsOpenTo: string;
  portfolioGoogleDrive: string;
  whatYouGetWorkingWithMe: string;
  additionalImages: { previewUrl: string | null; file: File | null }[];
  genericPortfolioFiles: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
    link: string;
  }>;
}

export interface DeveloperFormData extends PortfolioFormData {
  cta: string;
  services: Array<{ name: string; description: string }>;
  skills: string[];
  availability: string;
//   linkedinLink: string;
//   githubLink: string;
//   portfolioLink: string;
  whyWorkWithMe: string;
  genericPortfolioFiles: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
    link: string;
  }>;
}

export interface PhotographerFormData extends PortfolioFormData {
  latestWork: Array<{
    image: { previewUrl: string | null; file: File | null };
    title: string;
    link: string;
  }>;
  myServices: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
    link: string;
  }>;
  jobsOpenTo: string[];
  whyWorkWithMe: string;
  moreWork: Array<{ name: string; link: string }>;
}

export interface DesignerFormData extends PortfolioFormData {
  missionAndDesignPhilosophy: string;
  skills: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
  }>;
  tools: string[];
//   portfolioGoogleDrive: string;
//   linkedinProfile: string;
  behance: string;
  jobsOpenTo: string;
  whyWorkWithMe: string;
  genericPortfolioFiles: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
    link: string;
  }>;
}

export interface SocialMediaManagerFormData extends PortfolioFormData {
  describeExperienceYears: string;
  mission: string;
  myApproachToStrategyContent: string;
  skills: string[];
  caseStudy: Array<{
    brandName: string;
    contribution: string;
    before: { previewUrl: string | null; file: File | null };
    after: { previewUrl: string | null; file: File | null };
  }>;
  graphicDesign: Array<{
    image: { previewUrl: string | null; file: File | null };
  }>;
  videoEditing: string[];
  tools: string[];
  whyWorkWithMe: string;
  genericPortfolioFiles: Array<{
    image: { previewUrl: string | null; file: File | null };
    name: string;
  }>;
}

export interface SocialLinks {
  linkedin?: string;
  medium?: string;
  google_drive_link?: string;
  pinterest_or_behance_link?: string;
  behance?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  github?: string;
  portfolio_link?: string;
}

export interface PortfolioFile {
  image: string;
  title: string;
  link?: string;
}

export interface WriterTemplateSpecific {
  writer: {
    case_study: string;
  };
}

export interface VideographerTemplateSpecific {
  videographer: {
    types: string[];
    videography_skills: string[];
    video_editing_skills: string[];
    jobs_open_to: string;
  };
}

export interface DeveloperTemplateSpecific {
  developer: {
    cta: string;
    services: Array<{ name: string; description: string }>;
    skills: string[];
    availability: string;
  };
}

export function getDeveloperServices(
    template_specific: ApiPortfolioData["template_specific"]
  ): Array<{ name: string; description: string }> {
    if (
      template_specific &&
      "developer" in template_specific &&
      typeof template_specific.developer === "object" &&
      template_specific.developer !== null &&
      "services" in template_specific.developer &&
      Array.isArray(template_specific.developer.services)
    ) {
      // Additional type safety - filter out invalid items
      return template_specific.developer.services.filter(
        (service): service is { name: string; description: string } =>
          typeof service === "object" &&
          service !== null &&
          "name" in service &&
          typeof service.name === "string" &&
          "description" in service &&
          typeof service.description === "string"
      );
    }
    return [];
  }

export interface PhotographerTemplateSpecific {
  photographer: {
    latest_work: Array<{ image: string; title: string; link: string }>;
    my_services: Array<{ image: string; name: string; link: string }>;
    jobs_open_to: string[];
    more_work: Array<{ name: string; link: string }>;
  };
}

export interface DesignerTemplateSpecific {
  designer: {
    skills: Array<{ image: string; name: string }>;
    tools: string[];
    behance: string;
    job_open_to: string;
    why_you_should_work_with_me: string;
  };
}

export interface SocialMediaManagerTemplateSpecific {
  social_media_manager: {
    describe_experience_years?: string;
    my_approach_to_strategy_content?: string;
    skills?: string[];
    mission_values?: string;
    graphic_design?: string[];
    video_editing?: string[];
    tools?: string[];
    case_study?: Array<{
      brand_name?: string;
      contribution?: string;
      before?: string;
      after?: string;
    }>;
  };
}

export interface ApiPortfolioData {
  template_type:
    | "WRITER"
    | "SOCIAL_MEDIA_MANAGER"
    | "DEVELOPER"
    | "DESIGNER"
    | "PHOTOGRAPHER"
    | "VIDEOGRAPHER";
  display_name: string;
  job_titles: string[];
  location: string;
  about_me: string;
  mission?: string;
  head_shot: string;
  files?: PortfolioFile[];
  fonts?: ApiPortfolioFonts;
  template_fonts?: Record<string, ApiPortfolioFonts>;
  other_services?: string[];
  what_you_get_working_with_me?: string;
  social?: SocialLinks;
  template_specific?:
    | WriterTemplateSpecific
    | VideographerTemplateSpecific
    | DeveloperTemplateSpecific
    | PhotographerTemplateSpecific
    | DesignerTemplateSpecific
    | SocialMediaManagerTemplateSpecific;
  profile_image: string;
  services: string[];
}

export interface PortfolioApiPayload {
  portfolio: ApiPortfolioData;
}

export interface ActualUserData {
  _id: string;
  auth: {
    token: {
      issued_at: string;
    };
    validation_token: string | null;
    email: string;
    provider: string;
  };
  bio_data: {
    full_name: string;
    user_name: string;
  };
  profile: {
    full_name: string;
    email: string;
    bio: string;
    phone_number: string;
    years_of_experience: string;
    field: string;
    industry: string;
    location: {
      state: string;
      lga: string;
      _id: string;
      id: string;
    };
  };
  resume: {
    links: {
      linkedin: string;
      twitter: string;
      instagram: string;
      tiktok: string;
    };
    experience: Array<{
      job_title: string;
      location: string;
      contribution: string;
      ended: string;
    }>;
    industry: string;
    category: string;
    job_title: string;
    full_name: string;
    email: string;
    location: string;
    phone_number: string;
    education: Array<{
      course: string;
      school: string;
      started: string;
      ended: string;
    }>;
    brief: string;
    skills: string[];
    other_skills: string[];
    certifications: string[];
  };
  social_clicks: {
    linkedin: number;
    twitter: number;
    instagram: number;
    tiktok: number;
  };
  rating: number;
  profile_views: number;
  ratings: Array<{ rating: number; comment: string; user_id: string }>;
  created_at: string;
  updated_at: string;
  portfolio: ApiPortfolioData;
  id: string;
}

export interface UserWrapper {
  message: string;
  data: ActualUserData;
}

export interface GetPortfolioResponse {
  data: {
    portfolio: ApiPortfolioData;
    user: UserWrapper;
  };
  message: string;
}

export type UserProfileData = ActualUserData;

export const EMPTY_PORTFOLIO: ApiPortfolioData = {
  template_type: "WRITER",
  display_name: "",
  job_titles: [],
  location: "",
  about_me: "",
  mission: "",
  head_shot: "",
  files: [],
  fonts: {
    heading_font: "Inter",
    body_font: "Source Sans Pro",
    colors: {
      primary: "#1e3a8a",
      accent: "#16a34a",
      background: "#ffffff",
      text: "#000000",
    },
  },
  template_fonts: {},
  other_services: [],
  what_you_get_working_with_me: "",
  social: {},
  template_specific: { writer: { case_study: "" } },
  profile_image: "",
  services: [],
};

export function isWriterTemplateSpecific(
  template_specific: ApiPortfolioData["template_specific"]
): template_specific is WriterTemplateSpecific {
  return (
    !!template_specific &&
    "writer" in template_specific &&
    typeof template_specific.writer === "object" &&
    "case_study" in template_specific.writer &&
    typeof template_specific.writer.case_study === "string"
  );
}

export function isVideographerTemplateSpecific(
    template_specific: ApiPortfolioData["template_specific"]
  ): template_specific is VideographerTemplateSpecific {
    return (
      !!template_specific &&
      typeof template_specific === "object" &&
      "videographer" in template_specific &&
      typeof template_specific.videographer === "object" &&
      template_specific.videographer !== null
    );
  }

export function isDeveloperTemplateSpecific(
    template_specific: ApiPortfolioData["template_specific"]
  ): template_specific is DeveloperTemplateSpecific {
    return (
      !!template_specific &&
      typeof template_specific === "object" &&
      "developer" in template_specific &&
      typeof template_specific.developer === "object" &&
      template_specific.developer !== null
    );
  }

export function isPhotographerTemplateSpecific(
  template_specific: ApiPortfolioData["template_specific"]
): template_specific is PhotographerTemplateSpecific {
  return (
    !!template_specific &&
    "photographer" in template_specific &&
    typeof template_specific.photographer === "object" &&
    "latest_work" in template_specific.photographer &&
    Array.isArray(template_specific.photographer.latest_work)
  );
}

export function isDesignerTemplateSpecific(
  template_specific: ApiPortfolioData["template_specific"]
): template_specific is DesignerTemplateSpecific {
  return (
    !!template_specific &&
    typeof template_specific === "object" &&
    "designer" in template_specific &&
    typeof template_specific.designer === "object" &&
    template_specific.designer !== null &&
    ("skills" in template_specific.designer ? Array.isArray(template_specific.designer.skills) || template_specific.designer.skills === undefined : true) &&
    ("tools" in template_specific.designer ? Array.isArray(template_specific.designer.tools) || template_specific.designer.tools === undefined : true) &&
    ("job_open_to" in template_specific.designer ? typeof template_specific.designer.job_open_to === "string" || template_specific.designer.job_open_to === undefined : true) &&
    ("why_you_should_work_with_me" in template_specific.designer ? typeof template_specific.designer.why_you_should_work_with_me === "string" || template_specific.designer.why_you_should_work_with_me === undefined : true)
  );
}

export function isSocialMediaManagerTemplateSpecific(
    template_specific: ApiPortfolioData["template_specific"]
  ): template_specific is SocialMediaManagerTemplateSpecific {
    return (
      !!template_specific &&
      "social_media_manager" in template_specific &&
      typeof template_specific.social_media_manager === "object" &&
      template_specific.social_media_manager !== null
    );
  }