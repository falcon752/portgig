/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import {
  isVideographerTemplateSpecific,
  type ApiPortfolioData,
  type VideographerTemplateSpecific,
} from "@/types/portfolio";
import {
  TemplateTwoHero,
  TemplateTwoAboutMe,
  TemplateTwoEvent,
  TemplateTwoService,
  TemplateTwoPortfolio,
} from "@/src/components/export_components";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string; creatorId: string }>;
}

export const dynamic = "force-dynamic";

export default async function VideographerPortfolioByCreatorIdPage({ params }: PageProps) {
  const { creatorId } = await params;

  let portfolio: ApiPortfolioData | null = null;
  let error: string | null = null;

  try {
    const responseData = await getPortfolioServer(creatorId, false);
    const portfolioData = responseData?.data?.user?.data?.portfolio;

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
        what_you_get_working_with_me: portfolioData.what_you_get_working_with_me ?? "",
        social: portfolioData.social ?? {
          linkedin: "", medium: "", google_drive_link: "",
          pinterest_or_behance_link: "", youtube: "", instagram: "",
          tiktok: "", github: "", portfolio_link: "",
        },
        profile_image: portfolioData.profile_image ?? "",
        services: portfolioData.services ?? [],
      };
    } else {
      error = "No VIDEOGRAPHER portfolio found.";
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Failed to load portfolio.";
  }

  if (error || !portfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-700 mb-4">
            {error || "This portfolio doesn't exist or may be private."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This portfolio may not exist, be private, or the link may be incorrect.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium">
            Go to Homepage
          </Link>
        </div>
      </main>
    );
  }

  const videographerSpecific = portfolio.template_specific as VideographerTemplateSpecific;

  const portfolioItems = (portfolio.files ?? []).map((item) => ({
    image: item.image,
    title: item.title,
    link: item.link ?? "",
  }));

  return (
    <main className="bg-black font-montserrat max-md:mb-20">
      <TemplateTwoHero
        displayName={portfolio.display_name}
        jobTitles={portfolio.job_titles}
        location={portfolio.location}
        headShot={portfolio.head_shot}
        portfolioData={portfolio}
      />
      <TemplateTwoAboutMe aboutMe={portfolio.about_me} portfolioData={portfolio} />
      <TemplateTwoEvent portfolioData={videographerSpecific.videographer.types ?? []} />
      <TemplateTwoService
        videographyTypes={videographerSpecific.videographer.types ?? []}
        services={portfolio.other_services as string[]}
        videographySkills={videographerSpecific.videographer.videography_skills ?? []}
        videoEditingSkills={videographerSpecific.videographer.video_editing_skills ?? []}
        portfolioData={portfolio}
      />
      <TemplateTwoPortfolio
        portfolioItems={portfolioItems}
        whyWorkWithMe={portfolio.what_you_get_working_with_me ?? ""}
        portfolioData={portfolio}
        jobsOpenTo={videographerSpecific.videographer.jobs_open_to ?? ""}
      />
      <footer className="center px-10 py-20 bg-black">
        <Image src="/assets/madeByPortgig.svg" height={200} width={1000} alt="made by portgig" />
      </footer>
      <div className="text-center py-8 bg-gray-50">
        <div className="space-y-4 max-lg:mb-16">
          <p className="text-gray-600">Want to create your own professional portfolio?</p>
          <div className="flex justify-center gap-4">
            <Link href="/sign-up" className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium">
              Create Your Portfolio
            </Link>
            <Link href="/" className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
