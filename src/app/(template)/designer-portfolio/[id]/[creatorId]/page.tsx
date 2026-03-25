/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import type { ApiPortfolioData } from "@/types/portfolio";
import { isDesignerTemplateSpecific } from "@/types/portfolio";
import {
  TemplateOneHero,
  TemplateOneAboutme,
  TemplateOnePortfolio,
  MadeByportgig,
} from "@/src/components/export_components";

interface PageProps {
  params: Promise<{ id: string; creatorId: string }>;
}

export const dynamic = "force-dynamic";

export default async function DesignerPortfolioByCreatorIdPage({ params }: PageProps) {
  const { creatorId } = await params;

  let portfolioData: ApiPortfolioData | null = null;
  let error: string | null = null;

  try {
    const responseData = await getPortfolioServer(creatorId, false);
    const rawPortfolio =
      responseData?.data?.user?.data?.portfolio ?? responseData?.data?.portfolio;

    if (
      rawPortfolio &&
      rawPortfolio.template_type === "DESIGNER" &&
      isDesignerTemplateSpecific(rawPortfolio.template_specific)
    ) {
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
            primary: "",
            accent: "",
            background: "",
            text: "",
          },
        },
        template_fonts: rawPortfolio.template_fonts ?? {},
        other_services: rawPortfolio.other_services ?? [],
        what_you_get_working_with_me: rawPortfolio.what_you_get_working_with_me ?? "",
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
            why_you_should_work_with_me:
              rawPortfolio.template_specific.designer.why_you_should_work_with_me ?? "",
          },
        },
      };
    } else {
      error = "No DESIGNER portfolio found.";
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Failed to load portfolio.";
  }

  if (error || !portfolioData) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {error || "This portfolio doesn't exist or may be private."}
          </p>
          <p className="text-xs text-gray-500 mb-6 bg-gray-50 p-3 rounded">
            This portfolio may not exist, be private, or the link may be incorrect.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200">
            Go to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="font-montserrat">
      <TemplateOneHero portfolio={portfolioData} />
      <TemplateOneAboutme portfolio={portfolioData} />
      <TemplateOnePortfolio portfolio={portfolioData} />
      <MadeByportgig className="bg-black" />
      <div className="text-center py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4 max-lg:mb-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Want to create your own professional portfolio?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Showcase your work, connect with clients, and grow your career with a stunning portfolio built just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              <Link href="/sign-up" className="inline-block px-8 py-3 bg-[#0A1754] text-white rounded-lg font-medium hover:bg-[#08124A] transition-colors duration-200">
                Create Your Portfolio
              </Link>
              <Link href="/" className="inline-block px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
