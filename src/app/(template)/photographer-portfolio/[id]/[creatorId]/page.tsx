/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import {
  isPhotographerTemplateSpecific,
  type ApiPortfolioData,
  type PhotographerTemplateSpecific,
} from "@/types/portfolio";
import {
  TemplatesixHeroSection,
  TemplatesixAboutMe,
  TemplatesixSkills,
  TemplatesixLatestWork,
  TemplatesixMoreWork,
  TemplatesixJobs,
} from "@/src/components/export_components";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string; creatorId: string }>;
}

export const dynamic = "force-dynamic";

export default async function PhotographerPortfolioByCreatorIdPage({ params }: PageProps) {
  const { creatorId } = await params;

  let portfolioData: ApiPortfolioData | null = null;
  let error: string | null = null;

  try {
    const responseData = await getPortfolioServer(creatorId, false);
    const rawPortfolio = responseData?.data?.user?.data?.portfolio;

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
            latest_work: rawPortfolio.template_specific.photographer.latest_work ?? [],
            my_services: rawPortfolio.template_specific.photographer.my_services ?? [],
            jobs_open_to: rawPortfolio.template_specific.photographer.jobs_open_to ?? [],
            more_work: rawPortfolio.template_specific.photographer.more_work ?? [],
          },
        },
        display_name: rawPortfolio.display_name ?? "",
        job_titles: rawPortfolio.job_titles ?? [],
        location: rawPortfolio.location ?? "",
        about_me: rawPortfolio.about_me ?? "",
        mission: rawPortfolio.mission ?? "",
        head_shot: rawPortfolio.head_shot ?? "",
        files: rawPortfolio.files ?? [],
        other_services: rawPortfolio.other_services ?? [],
        what_you_get_working_with_me: rawPortfolio.what_you_get_working_with_me ?? "",
        social: rawPortfolio.social ?? {
          linkedin: "", medium: "", google_drive_link: "",
          pinterest_or_behance_link: "", youtube: "", instagram: "",
          tiktok: "", github: "", portfolio_link: "",
        },
        profile_image: rawPortfolio.profile_image ?? "",
        services: rawPortfolio.services ?? [],
      };
    } else {
      error = "No PHOTOGRAPHER portfolio found.";
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Failed to load portfolio.";
  }

  if (error || !portfolioData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-700 mb-4">
            {error || "This portfolio doesn't exist or may be private."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
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
    <div className="bg-black min-h-screen max-md:mb-20">
      <TemplatesixHeroSection portfolioData={portfolioData} />
      <TemplatesixAboutMe portfolioData={portfolioData} />
      <TemplatesixSkills portfolioData={portfolioData} />
      <TemplatesixLatestWork portfolioData={portfolioData} />
      <TemplatesixMoreWork portfolioData={portfolioData} />
      <TemplatesixJobs portfolioData={portfolioData} />
      <footer className="center px-10 py-20 bg-black">
        <Image src="/assets/madeByPortgig.svg" height={200} width={1000} alt="Made by Portgig" className="mx-auto" />
      </footer>
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
    </div>
  );
}
