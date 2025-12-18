/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { cookies } from "next/headers";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import type { ApiPortfolioData, GetPortfolioResponse } from "@/types/portfolio";
import { isSocialMediaManagerTemplateSpecific } from "@/types/portfolio";
import {
  TemplateFiveHero,
  TemplateFiveAboutMe,
  TemplateFiveStrategyContent,
  TemplateFiveSkills,
  TemplateFiveServices,
  TemplateFiveHealthcareCaseStudy,
  TemplateFiveGraphicsDesign,
  TemplateFiveVideoEditing,
  TemplateFiveTools,
  TemplateFivePortfolio,
} from "@/src/components/export_components";
import ShareButton from "@/src/components/ShareButton";
import Image from "next/image";

interface SocialMediaManagerTemplateSpecific {
  social_media_manager: {
    describe_experience_years?: string;
    my_approach_to_strategy_content?: string;
    skills?: string[];
    case_study?: Array<{
      brand_name?: string;
      contribution?: string;
      before?: string;
      after?: string;
    }>;
    graphic_design?: string[];
    video_editing?: string[];
    tools?: string[];
    mission_values?: string;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creatorId?: string }>;
}

export default async function Template5Page({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const templateId = resolvedParams.id;
  const publicCreatorId = resolvedSearchParams.creatorId;

  console.log("Template5Page: Template ID from URL:", templateId);
  console.log("Template5Page: Public creator ID from query:", publicCreatorId);

  let portfolioData: ApiPortfolioData | null = null;
  let error: string | null = null;
  let actualCreatorId: string | null = null;
  let isPublicView = false;

  try {
    let responseData: GetPortfolioResponse;

    if (publicCreatorId) {
      console.log("Template5Page: Fetching public portfolio for shared link");
      isPublicView = true;
      actualCreatorId = publicCreatorId;
      responseData = await getPortfolioServer(publicCreatorId);
    } else {
      console.log("Template5Page: Fetching portfolio for logged-in user");
      const cookieStore = await cookies();
      const userId =
        cookieStore.get("userid")?.value || cookieStore.get("userId")?.value;

      if (!userId) {
        throw new Error(
          "No user ID found in cookies. User may not be logged in."
        );
      }

      console.log("Template5Page: Found userId in cookies:", userId);
      actualCreatorId = userId;
      responseData = await getPortfolioServer(userId);
    }

    console.log(
      "Template5Page: Data received:",
      JSON.stringify(responseData, null, 2)
    );

    const rawPortfolio = responseData?.data?.user?.data?.portfolio;
    console.log(
      "Template5Page: Portfolio data:",
      JSON.stringify(rawPortfolio, null, 2)
    );

    if (rawPortfolio && rawPortfolio.template_type === "SOCIAL_MEDIA_MANAGER") {
      if (
        isSocialMediaManagerTemplateSpecific(rawPortfolio.template_specific)
      ) {
        portfolioData = {
          ...rawPortfolio,
          template_specific: {
            social_media_manager: {
              describe_experience_years:
                rawPortfolio.template_specific.social_media_manager
                  .describe_experience_years || "",
              my_approach_to_strategy_content:
                rawPortfolio.template_specific.social_media_manager
                  .my_approach_to_strategy_content || "",
              skills:
                rawPortfolio.template_specific.social_media_manager.skills ||
                [],
              case_study:
                rawPortfolio.template_specific.social_media_manager
                  .case_study || [],
              graphic_design:
                rawPortfolio.template_specific.social_media_manager
                  .graphic_design || [],
              video_editing:
                rawPortfolio.template_specific.social_media_manager
                  .video_editing || [],
              tools:
                rawPortfolio.template_specific.social_media_manager.tools || [],
              mission_values:
                rawPortfolio.template_specific.social_media_manager
                  .mission_values || "",
            },
          },
          display_name: rawPortfolio.display_name || "",
          job_titles: rawPortfolio.job_titles || [],
          location: rawPortfolio.location || "",
          about_me: rawPortfolio.about_me || "",
          mission: rawPortfolio.mission || "",
          head_shot: rawPortfolio.head_shot || "",
          other_services: rawPortfolio.other_services || [],
          what_you_get_working_with_me:
            rawPortfolio.what_you_get_working_with_me || "",
          social: rawPortfolio.social || {
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
          files: rawPortfolio.files || [],
          profile_image: rawPortfolio.profile_image || "",
          services: rawPortfolio.services || [],
        };
        console.log(
          "Template5Page: SOCIAL_MEDIA_MANAGER portfolio normalized:",
          JSON.stringify(portfolioData, null, 2)
        );
        console.log(
          "Template5Page: Normalized template_specific:",
          JSON.stringify(portfolioData.template_specific, null, 2)
        );
      } else {
        error =
          "Portfolio data does not match SOCIAL_MEDIA_MANAGER template structure.";
        console.log(
          "Template5Page: Type guard failed for SocialMediaManagerTemplateSpecific. Expected social_media_manager object, got:",
          JSON.stringify(rawPortfolio.template_specific, null, 2)
        );
      }
    } else {
      error = rawPortfolio
        ? `Expected SOCIAL_MEDIA_MANAGER template, but got ${rawPortfolio.template_type}.`
        : "No portfolio data found for this user.";
      console.log("Template5Page: " + error);
      if (rawPortfolio?.template_specific) {
        console.log(
          "Template5Page: Invalid template_specific:",
          JSON.stringify(rawPortfolio.template_specific, null, 2)
        );
      }
    }
  } catch (err: unknown) {
    console.error("Template5Page: Failed to fetch portfolio:", err);
    error =
      err instanceof Error
        ? err.message || "Failed to load portfolio data."
        : "An unknown error occurred.";
  }

  if (!actualCreatorId) {
    console.warn("Template5Page: actualCreatorId is missing or 'unknown'");
    actualCreatorId = "unknown";
  }

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
                : "/edit-template/social-media-manager"
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

  const socialMediaManagerSpecific =
    portfolioData.template_specific as SocialMediaManagerTemplateSpecific;
  const caseStudy = socialMediaManagerSpecific.social_media_manager
    .case_study?.[0] || {
    brand_name: "",
    contribution: "",
    before: "",
    after: "",
  };

  return (
    <div className="font-sans bg-black min-h-screen max-md:mb-20">
  <div className="max-w-5xl mx-auto px-6">
      <TemplateFiveHero
        displayName={portfolioData.display_name}
        jobTitles={portfolioData.job_titles}
        location={portfolioData.location}
        headShot={portfolioData.head_shot}
        portfolioData={portfolioData}
      />
      <TemplateFiveAboutMe
        aboutMe={portfolioData.about_me}
        years={
          socialMediaManagerSpecific.social_media_manager
            .describe_experience_years || ""
        }
      />
      <TemplateFiveStrategyContent
        approachToStrategy={
          socialMediaManagerSpecific.social_media_manager
            .my_approach_to_strategy_content || ""
        }
        mission={portfolioData.mission || ""}
      />
      <TemplateFiveSkills
        mySkillSet={
          socialMediaManagerSpecific.social_media_manager.skills || []
        }
      />
      <TemplateFiveServices
        otherServices={portfolioData.other_services || []}
      />
      <TemplateFiveHealthcareCaseStudy
        brandName={caseStudy.brand_name || ""}
        howYouHelp={caseStudy.contribution || ""}
        before={caseStudy.before || ""}
        after={caseStudy.after || ""}
      />
      <TemplateFivePortfolio />
      <TemplateFiveGraphicsDesign
        graphicsDesign={
          socialMediaManagerSpecific.social_media_manager.graphic_design || []
        }
      />
      <TemplateFiveVideoEditing
        videoEditing={
          socialMediaManagerSpecific.social_media_manager.video_editing || []
        }
        portfolioData={portfolioData}
      />
      <TemplateFiveTools
        toolsIUse={socialMediaManagerSpecific.social_media_manager.tools || []}
        whyWorkWithMe={portfolioData.what_you_get_working_with_me || ""}
      />
      {!isPublicView && (
        <div className="bg-black py-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <ShareButton
              creativeId={actualCreatorId}
              displayName={portfolioData.display_name || "Portfolio"}
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
          title: `${rawPortfolio.display_name} - Social Media Manager Portfolio | PortGig`,
          description:
            rawPortfolio.about_me.substring(0, 160) ||
            "Professional social media manager portfolio showcasing creative work and services.",
          openGraph: {
            title: `${rawPortfolio.display_name} - Social Media Manager Portfolio`,
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
    title: "Social Media Manager Portfolio - PortGig",
    description:
      "Professional social media manager portfolio template showcasing creative work, skills, and services.",
  };
}
