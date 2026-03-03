/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { cookies } from "next/headers";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import type { ApiPortfolioData, GetPortfolioResponse } from "@/types/portfolio";
import { isDesignerTemplateSpecific } from "@/types/portfolio";
import {
  TemplateOneHero,
  TemplateOneAboutme,
  TemplateOnePortfolio,
  MadeByportgig,
} from "@/src/components/export_components";
import ShareButton from "@/src/components/ShareButton";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creatorId?: string }>;
}

export default async function TemplateOnePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const usernameOrTemplateId = resolvedParams.id;
  const publicCreatorId = resolvedSearchParams.creatorId;

  console.log("TemplateOnePage: Username/Template ID from URL:", usernameOrTemplateId);
  console.log("TemplateOnePage: Public creator ID from query:", publicCreatorId);

  let portfolioData: ApiPortfolioData | null = null;
  let error: string | null = null;
  let actualCreatorId: string | null = null;
  let isPublicView = false;
  let accountUsername: string | null = null;

  try {
    let fullProfile: GetPortfolioResponse;

    if (publicCreatorId) {
      // Legacy support: creatorId in query param
      console.log("TemplateOnePage: Fetching public portfolio for shared link (legacy)");
      isPublicView = true;
      actualCreatorId = publicCreatorId;
      fullProfile = await getPortfolioServer(publicCreatorId, false);
    } else if (usernameOrTemplateId && isNaN(Number(usernameOrTemplateId))) {
      // New: username in URL path (if not a number)
      console.log("TemplateOnePage: Fetching public portfolio by username:", usernameOrTemplateId);
      isPublicView = true;
      fullProfile = await getPortfolioServer(usernameOrTemplateId, true);
      actualCreatorId = fullProfile?.data?.user?.data?._id || null;
    } else {
      console.log("TemplateOnePage: Fetching portfolio for logged-in user");
      const cookieStore = await cookies();
      const userid =
        cookieStore.get("userid")?.value || cookieStore.get("userId")?.value;

      if (!userid) {
        throw new Error("No user ID found in cookies. User may not be logged in.");
      }

      console.log("TemplateOnePage: Found userId in cookies:", userid);
      actualCreatorId = userid;
      fullProfile = await getPortfolioServer(userid, false);
    }

    try {
      const userData = fullProfile?.data?.user?.data;
      accountUsername =
        userData?.bio_data?.user_name ??
        userData?.user_name ??
        null;

      const rawPortfolio =
        userData?.portfolio ??
        fullProfile?.data?.portfolio;

      if (rawPortfolio && rawPortfolio.template_type === "DESIGNER") {
        console.log("[TemplateOnePage] rawPortfolio.template_specific:", JSON.stringify(rawPortfolio.template_specific, null, 2));
        if (isDesignerTemplateSpecific(rawPortfolio.template_specific)) {
          portfolioData = {
            template_type: "DESIGNER",
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
            social: {
              linkedin: rawPortfolio.social?.linkedin ?? "",
              medium: rawPortfolio.social?.medium ?? "",
              google_drive_link: rawPortfolio.social?.google_drive_link ?? "",
              youtube: rawPortfolio.social?.youtube ?? "",
              instagram: rawPortfolio.social?.instagram ?? "",
              tiktok: rawPortfolio.social?.tiktok ?? "",
              github: rawPortfolio.social?.github ?? "",
              portfolio_link: rawPortfolio.social?.portfolio_link ?? "",
            },
            profile_image: rawPortfolio.profile_image ?? "",
            services: rawPortfolio.services ?? [],
            template_specific: {
              designer: {
                skills: rawPortfolio.template_specific.designer.skills ?? [],
                tools: rawPortfolio.template_specific.designer.tools ?? [],
                behance: rawPortfolio.template_specific.designer.behance ?? "",
                job_open_to: rawPortfolio.template_specific.designer.job_open_to ?? "",
                why_you_should_work_with_me: rawPortfolio.template_specific.designer.why_you_should_work_with_me ?? "",
              },
            },
          };
        } else {
          error = "Portfolio data does not match DESIGNER template structure.";
          console.error("[TemplateOnePage] template_specific failed validation:", rawPortfolio.template_specific);
        }
      } else {
        error = rawPortfolio
          ? `Expected DESIGNER template, but got ${rawPortfolio.template_type}.`
          : "No portfolio data found for this user.";
      }
    } catch (err: unknown) {
      error =
        err instanceof Error ? err.message : "Failed to load portfolio data.";
      console.error("TemplateOnePage: Failed to fetch portfolio:", err);
    }
  } catch (err: unknown) {
    console.error("TemplateOnePage: Failed to fetch portfolio:", err);
    error =
      err instanceof Error
        ? err.message || "Failed to load portfolio data."
        : "An unknown error occurred while loading portfolio data.";
  }

  // Error state rendering
  if (error || !portfolioData) {
    const isUsernameNotFound = error?.includes("not found") || error?.includes("Not found");
    const showEditButton = !isPublicView && !isUsernameNotFound;
    
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
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
              {isUsernameNotFound ? "Portfolio Not Found" : "Error Loading Portfolio"}
            </h1>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              {error || "Your portfolio hasn't been set up yet."}
            </p>
          </div>
          {showEditButton && (
            <Link
              href="/edit-template/designer"
              className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Go to Edit Form
            </Link>
          )}
          {isUsernameNotFound && (
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Go to Home
            </Link>
          )}
        </div>
      </main>
    );
  }

  // Success state rendering
  return (
    <main className="font-montserrat">
      {/* Hero Section */}
      <TemplateOneHero portfolio={portfolioData} />

      {/* About Me Section */}
      <TemplateOneAboutme portfolio={portfolioData} />

      {/* Spacer */}
      {/* <div className="bg-white h-15"></div> */}

      {/* Portfolio Section */}
      <TemplateOnePortfolio portfolio={portfolioData} />

      {/* Share Button */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <ShareButton
            creativeId={actualCreatorId || "unknown"}
            username={accountUsername ?? undefined}
            templateType={portfolioData.template_type}
          />
        </div>
      </div>

      {/* Footer */}
      <MadeByportgig className="bg-black" />

      {/* CTA Section */}
      <div className="text-center py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
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
        </div>
      </div>
    </main>
  );
}

// Metadata for SEO
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const cookieStore = await cookies();
  const userid =
    cookieStore.get("userid")?.value || cookieStore.get("userId")?.value;

  if (userid) {
    try {
      const responseData = await getPortfolioServer(userid);
      const rawPortfolio =
        responseData?.data?.user?.data?.portfolio ??
        responseData?.data?.portfolio;

      if (rawPortfolio) {
        return {
          title: `${
            rawPortfolio.display_name || "Designer"
          } - Designer Portfolio | PortGig`,
          description:
            rawPortfolio.about_me?.substring(0, 160) ||
            "Professional designer portfolio showcasing creative work and services.",
          openGraph: {
            title: `${
              rawPortfolio.display_name || "Designer"
            } - Designer Portfolio`,
            description:
              rawPortfolio.about_me?.substring(0, 160) ||
              "Professional designer portfolio showcasing creative work and services.",
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
    title: "Designer Portfolio - PortGig",
    description:
      "Professional designer portfolio template showcasing creative work, skills, and services.",
  };
}