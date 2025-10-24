/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { cookies } from "next/headers";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import {
  isPhotographerTemplateSpecific,
  type ApiPortfolioData,
  type GetPortfolioResponse,
  type PhotographerTemplateSpecific,
  type SocialLinks,
  type PortfolioFile,
  type ApiPortfolioFonts,
} from "@/types/portfolio";
import {
  TemplatesixHeroSection,
  TemplatesixAboutMe,
  TemplatesixSkills,
  TemplatesixLatestWork,
  TemplatesixMoreWork,
  TemplatesixJobs,
} from "@/src/components/export_components";
import ShareButton from "@/src/components/ShareButton";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creatorId?: string }>;
}

interface NormalizedPortfolioData
  extends Omit<
    ApiPortfolioData,
    | "template_specific"
    | "display_name"
    | "job_titles"
    | "location"
    | "about_me"
    | "mission"
    | "head_shot"
    | "files"
    | "fonts"
    | "template_fonts"
    | "other_services"
    | "what_you_get_working_with_me"
    | "social"
    | "profile_image"
    | "services"
  > {
  template_specific: PhotographerTemplateSpecific;
  display_name: string;
  job_titles: string[];
  location: string;
  about_me: string;
  mission: string;
  head_shot: string;
  files: PortfolioFile[];
  fonts: ApiPortfolioFonts;
  template_fonts: Record<string, ApiPortfolioFonts>;
  other_services: string[];
  what_you_get_working_with_me: string;
  social: SocialLinks;
  profile_image: string;
  services: string[];
}

export default async function Template6Page({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const templateId = resolvedParams.id;
  const publicCreatorId = resolvedSearchParams.creatorId;

  console.log("Template6Page: Template ID from URL:", templateId);
  console.log("Template6Page: Public creator ID from query:", publicCreatorId);

  let portfolioData: NormalizedPortfolioData | null = null;
  let error: string | null = null;
  let actualCreatorId: string | null = null;
  let isPublicView = false;

  try {
    let responseData: GetPortfolioResponse;

    if (publicCreatorId) {
      console.log("Template6Page: Fetching public portfolio for shared link");
      isPublicView = true;
      actualCreatorId = publicCreatorId;
      responseData = await getPortfolioServer(publicCreatorId);
    } else {
      console.log("Template6Page: Fetching portfolio for logged-in user");
      const cookieStore = await cookies();
      const userId =
        cookieStore.get("userid")?.value || cookieStore.get("userId")?.value;

      if (!userId) {
        throw new Error(
          "No user ID found in cookies. User may not be logged in."
        );
      }

      console.log("Template6Page: Found userId in cookies:", userId);
      actualCreatorId = userId;
      responseData = await getPortfolioServer(userId);
    }

    console.log(
      "Template6Page: Data received:",
      JSON.stringify(responseData, null, 2)
    );

    const rawPortfolio = responseData?.data?.user?.data?.portfolio;
    console.log(
      "Template6Page: Portfolio data:",
      JSON.stringify(rawPortfolio, null, 2)
    );

    if (
      rawPortfolio &&
      rawPortfolio.template_type === "PHOTOGRAPHER" &&
      rawPortfolio.template_specific !== undefined &&
      isPhotographerTemplateSpecific(rawPortfolio.template_specific)
    ) {
      portfolioData = {
        ...rawPortfolio,
        template_specific: {
          photographer: {
            latest_work:
              rawPortfolio.template_specific.photographer.latest_work ?? [],
            my_services:
              rawPortfolio.template_specific.photographer.my_services ?? [],
            jobs_open_to:
              rawPortfolio.template_specific.photographer.jobs_open_to ?? [],
            more_work:
              rawPortfolio.template_specific.photographer.more_work ?? [],
          },
        },
        display_name: rawPortfolio.display_name ?? "",
        job_titles: rawPortfolio.job_titles ?? [],
        location: rawPortfolio.location ?? "",
        about_me: rawPortfolio.about_me ?? "",
        mission: rawPortfolio.mission ?? "",
        head_shot: rawPortfolio.head_shot ?? "",
        files: rawPortfolio.files ?? [],
        fonts: rawPortfolio.fonts ?? {
          heading_font: "Inter",
          body_font: "Roboto",
          colors: {
            primary: "#0A1754",
            accent: "#1e3a8a",
            background: "#FFFFFF",
            text: "#000000",
          },
        },
        template_fonts: rawPortfolio.template_fonts ?? {},
        other_services: rawPortfolio.other_services ?? [],
        what_you_get_working_with_me:
          rawPortfolio.what_you_get_working_with_me ?? "",
        social: rawPortfolio.social ?? {
          linkedin: "",
          medium: "",
          google_drive_link: "",
          pinterest_or_behance_link: "",
          youtube: "",
          instagram: "",
          tiktok: "",
          github: "",
          portfolio_link: "",
        },
        profile_image: rawPortfolio.profile_image ?? "",
        services: rawPortfolio.services ?? [],
      };
      console.log(
        "Template6Page: PHOTOGRAPHER portfolio normalized:",
        JSON.stringify(portfolioData, null, 2)
      );
      console.log(
        "Template6Page: Normalized template_specific:",
        JSON.stringify(portfolioData.template_specific, null, 2)
      );
    } else {
      error = rawPortfolio
        ? rawPortfolio.template_specific === undefined
          ? "Portfolio data is missing template_specific."
          : `Expected PHOTOGRAPHER template, but got ${rawPortfolio.template_type}.`
        : "No portfolio data found for this user.";
      console.log("Template6Page: " + error);
      if (rawPortfolio?.template_specific) {
        console.log(
          "Template6Page: Invalid template_specific:",
          JSON.stringify(rawPortfolio.template_specific, null, 2)
        );
      }
    }
  } catch (err: unknown) {
    console.error("Template6Page: Failed to fetch portfolio:", err);
    error =
      err instanceof Error
        ? err.message || "Failed to load portfolio data."
        : "An unknown error occurred.";
  }

  if (!actualCreatorId) {
    console.warn("Template6Page: actualCreatorId is missing or 'unknown'");
    actualCreatorId = "unknown";
  }

  // Error state rendering
  if (error || !portfolioData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              {error
                ? isPublicView
                  ? "Portfolio Not Found"
                  : "Error Loading Portfolio"
                : "Portfolio Not Found"}
            </h1>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              {error ||
                (isPublicView
                  ? "This portfolio doesn't exist or is private."
                  : "Your portfolio hasn't been set up yet.")}
            </p>
            {error && isPublicView && (
              <p className="text-xs text-gray-500 mb-6 bg-gray-50 p-3 rounded">
                This portfolio may not exist, be private, or the link may be
                incorrect. Please check the URL and try again.
              </p>
            )}
          </div>
          <Link
            href={
              isPublicView
                ? "/"
                : error
                ? "/portfolio"
                : "/edit-template/photographer"
            }
            className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isPublicView
              ? "Go to Homepage"
              : error
              ? "Go To Portfolio"
              : "Go to Edit Form"}
          </Link>
        </div>
      </main>
    );
  }

  // Success state rendering
  return (
    <div className="bg-black min-h-screen max-md:mb-20">
      <TemplatesixHeroSection portfolioData={portfolioData} />
      <TemplatesixAboutMe portfolioData={portfolioData} />
      <TemplatesixSkills portfolioData={portfolioData} />
      <TemplatesixLatestWork portfolioData={portfolioData} />
      {/* <TemplatesixWeddingShoots portfolioData={portfolioData} /> */}
      <TemplatesixMoreWork portfolioData={portfolioData} />
      <TemplatesixJobs portfolioData={portfolioData} />
      {!isPublicView && (
        <div className="bg-black py-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <ShareButton
              creativeId={actualCreatorId}
              displayName={portfolioData.display_name}
            />
          </div>
        </div>
      )}
      <footer className="center px-10 py-20 bg-black">
        <Image
          src="/assets/madeByPortgig.svg"
          height={200}
          width={1000}
          alt="Made by Portgig"
          className="mx-auto"
        />
      </footer>
      <div className="text-center py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          {isPublicView ? (
            <div className="space-y-4 max-lg:mb-16">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Want to create your own professional portfolio?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Showcase your work, connect with clients, and grow your career
                with a stunning portfolio built just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                <Link
                  href="/sign-up"
                  className="inline-block px-8 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Create Your Portfolio
                </Link>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Want to see all your portfolios?
              </h3>
              <Link
                href="/portfolio"
                className="inline-block px-8 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Go To Portfolio Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO
export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const publicCreatorId = resolvedSearchParams.creatorId;
  const cookieStore = await cookies();
  const userId =
    cookieStore.get("userid")?.value || cookieStore.get("userId")?.value;

  if (userId || publicCreatorId) {
    try {
      const responseData = await getPortfolioServer(userId || publicCreatorId!);
      const rawPortfolio = responseData?.data?.user?.data?.portfolio;

      if (rawPortfolio) {
        return {
          title: `${rawPortfolio.display_name} - Photographer Portfolio | PortGig`,
          description:
            rawPortfolio.about_me.substring(0, 160) ||
            "Professional photographer portfolio showcasing creative work and services.",
          openGraph: {
            title: `${rawPortfolio.display_name} - Photographer Portfolio`,
            description: rawPortfolio.about_me.substring(0, 160),
            images: [rawPortfolio.head_shot || "/default-portfolio-image.jpg"],
            type: "website",
          },
        };
      }
    } catch (error) {
      console.error("Metadata generation error:", error);
    }
  }

  return {
    title: "Photographer Portfolio - PortGig",
    description:
      "Professional photographer portfolio template showcasing creative work, skills, and services.",
  };
}
