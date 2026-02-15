/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { cookies } from "next/headers";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import {
  isVideographerTemplateSpecific,
  type ApiPortfolioData,
  type GetPortfolioResponse,
  type VideographerTemplateSpecific,
} from "@/types/portfolio";
import {
  TemplateTwoHero,
  TemplateTwoAboutMe,
  TemplateTwoEvent,
  TemplateTwoService,
  TemplateTwoPortfolio,
} from "@/src/components/export_components";
import ShareButton from "@/src/components/ShareButton";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creatorId?: string }>;
}

export default async function Template2Page({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const usernameOrTemplateId = resolvedParams.id;
  const publicCreatorId = resolvedSearchParams.creatorId;

  console.log("Template2Page: Username/Template ID from URL:", usernameOrTemplateId);
  console.log("Template2Page: Public creator ID from query:", publicCreatorId);

  let portfolio: ApiPortfolioData | null = null;
  let error: string | null = null;
  let actualCreatorId: string | null = null;
  let isPublicView = false;

  try {
    let responseData: GetPortfolioResponse;

    if (publicCreatorId) {
      // Legacy support: creatorId in query param
      console.log("Template2Page: Fetching public portfolio for shared link (legacy)");
      isPublicView = true;
      actualCreatorId = publicCreatorId;
      responseData = await getPortfolioServer(publicCreatorId, false);
    } else if (usernameOrTemplateId && isNaN(Number(usernameOrTemplateId))) {
      // New: username in URL path (if not a number)
      console.log("Template2Page: Fetching public portfolio by username:", usernameOrTemplateId);
      isPublicView = true;
      responseData = await getPortfolioServer(usernameOrTemplateId, true);
      actualCreatorId = responseData?.data?.user?.data?._id || null;
    } else {
      // Logged-in user
      console.log("Template2Page: Fetching portfolio for logged-in user");
      const cookieStore = await cookies();
      const userId =
        cookieStore.get("userid")?.value || cookieStore.get("userId")?.value;

      if (!userId) {
        throw new Error(
          "No user ID found in cookies. User may not be logged in."
        );
      }

      console.log("Template2Page: Found userId in cookies:", userId);
      actualCreatorId = userId;
      responseData = await getPortfolioServer(userId, false);
    }

    console.log(
      "Template2Page: Data received:",
      JSON.stringify(responseData, null, 2)
    );

    const portfolioData = responseData?.data?.user?.data?.portfolio;
    console.log(
      "Template2Page: Portfolio data:",
      JSON.stringify(portfolioData, null, 2)
    );

    if (
      portfolioData &&
      portfolioData.template_type === "VIDEOGRAPHER" &&
      portfolioData.template_specific !== undefined &&
      isVideographerTemplateSpecific(portfolioData.template_specific)
    ) {
      portfolio = {
        ...portfolioData,
        template_specific: portfolioData.template_specific,
        display_name: portfolioData.display_name ?? "",
        job_titles: portfolioData.job_titles ?? [],
        location: portfolioData.location ?? "",
        about_me: portfolioData.about_me ?? "",
        mission: portfolioData.mission ?? "",
        head_shot: portfolioData.head_shot ?? "",
        files: portfolioData.files ?? [],
        other_services: portfolioData.other_services ?? [],
        what_you_get_working_with_me:
          portfolioData.what_you_get_working_with_me ?? "",
        social: portfolioData.social ?? {
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
        profile_image: portfolioData.profile_image ?? "",
        services: portfolioData.services ?? [],
      };
      console.log(
        "Template2Page: VIDEOGRAPHER portfolio normalized:",
        JSON.stringify(portfolio, null, 2)
      );
    } else {
      error = portfolioData
        ? portfolioData.template_specific === undefined
          ? "Portfolio data is missing template_specific."
          : `Expected VIDEOGRAPHER template, but got ${portfolioData.template_type}.`
        : "No VIDEOGRAPHER portfolio found or data is incomplete.";
      console.log("Template2Page: " + error);
      if (portfolioData?.template_specific) {
        console.log(
          "Template2Page: Invalid template_specific:",
          JSON.stringify(portfolioData.template_specific, null, 2)
        );
      }
    }
  } catch (err: unknown) {
    console.error("Template2Page: Failed to fetch portfolio:", err);
    error =
      err instanceof Error
        ? err.message || "Failed to load portfolio data."
        : "An unknown error occurred while loading portfolio data.";
  }

  if (error || !portfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center">
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
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {isPublicView ? "Portfolio Not Found" : "Error Loading Portfolio"}
            </h1>
            <p className="text-gray-700 mb-4">
              {error ||
                (isPublicView
                  ? "This portfolio doesn't exist or is private."
                  : "Your portfolio hasn't been set up yet.")}
            </p>
            {isPublicView && (
              <p className="text-sm text-gray-500 mb-6">
                This portfolio may not exist, be private, or the link may be
                incorrect.
              </p>
            )}
          </div>
          <Link
            href={
              isPublicView
                ? "/"
                : error
                ? "/portfolio"
                : "/edit-template/videographer"
            }
            className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium"
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

  const videographerSpecific =
    portfolio.template_specific as VideographerTemplateSpecific;

  if (!videographerSpecific.videographer) {
    console.error("Unexpected: videographerSpecific.videographer is undefined");
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Data Error</h1>
          <p className="text-gray-700 mb-4">
            Invalid portfolio data structure.
          </p>
          <Link
            href={isPublicView ? "/" : "/portfolio"}
            className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium"
          >
            {isPublicView ? "Go to Homepage" : "Go To Portfolio"}
          </Link>
        </div>
      </main>
    );
  }

  const portfolioItems = (portfolio.files ?? []).map((item) => ({
    image: item.image,
    title: item.title,
    link: item.link ?? "",
  }));

  const username = portfolio?.display_name?.toLowerCase().replace(/\\s+/g, '-') || null;

  return (
    <main className="bg-black font-montserrat max-md:mb-20">
      <TemplateTwoHero
        displayName={portfolio.display_name}
        jobTitles={portfolio.job_titles}
        location={portfolio.location}
        headShot={portfolio.head_shot}
        portfolioData={portfolio}
      />
      <TemplateTwoAboutMe
        aboutMe={portfolio.about_me}
        portfolioData={portfolio}
      />
      <TemplateTwoEvent portfolioData={videographerSpecific.videographer.types ?? []} />
      <TemplateTwoService
        videographyTypes={videographerSpecific.videographer.types ?? []}
        services={portfolio.other_services as string[]}
        videographySkills={
          videographerSpecific.videographer.videography_skills ?? []
        }
        videoEditingSkills={
          videographerSpecific.videographer.video_editing_skills ?? []
        }
        portfolioData={portfolio}
      />
      <TemplateTwoPortfolio
        portfolioItems={portfolioItems}
        // linkedinLink={portfolio.social?.linkedin ?? ""}
        // mediumLink={portfolio.social?.medium ?? ""}
        whyWorkWithMe={portfolio.what_you_get_working_with_me ?? ""}
        portfolioData={portfolio}
        jobsOpenTo={videographerSpecific.videographer.jobs_open_to ?? ""}
      />
      {!isPublicView && (
        <ShareButton
          creativeId={actualCreatorId ?? "unknown"}
          displayName={portfolio.display_name ?? "Portfolio"}
          username={username}
        />
      )}
      <footer className="center px-10 py-20 bg-black">
        <Image
          src="/assets/madeByPortgig.svg"
          height={200}
          width={1000}
          alt="made by portgig"
        />
      </footer>
      <div className="text-center py-8 bg-gray-50">
        {isPublicView ? (
          <div className="space-y-4 max-lg:mb-16">
            <p className="text-gray-600">
              Want to create your own professional portfolio?
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium"
              >
                Create Your Portfolio
              </Link>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        ) : (
          <Link
            href="/portfolio"
            className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium cursor-pointer"
          >
            Go To Portfolio
          </Link>
        )}
      </div>
    </main>
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
          title: `${rawPortfolio.display_name} - Videographer Portfolio | PortGig`,
          description:
            rawPortfolio.about_me?.substring(0, 160) ||
            "Professional videographer portfolio showcasing creative work and services.",
          openGraph: {
            title: `${rawPortfolio.display_name} - Videographer Portfolio`,
            description:
              rawPortfolio.about_me?.substring(0, 160) ||
              "Professional videographer portfolio",
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
    title: "Videographer Portfolio - PortGig",
    description:
      "Professional videographer portfolio template showcasing creative work, skills, and services.",
  };
}
