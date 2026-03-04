import Link from "next/link";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import type { ApiPortfolioData } from "@/types/portfolio";
import {
  TemplateThreeHero,
  TemplateThreeAboutMe,
  TemplateThreePortfolio,
  TemplateThreeAvailabilty,
} from "@/src/components/export_components";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string; creatorId: string }>;
}

export const dynamic = "force-dynamic";

export default async function DeveloperPortfolioByCreatorIdPage({ params }: PageProps) {
  const { creatorId } = await params;

  let portfolioData: ApiPortfolioData | null = null;
  let error: string | null = null;

  try {
    const responseData = await getPortfolioServer(creatorId, false);
    const rawPortfolio = responseData?.data?.user?.data?.portfolio;
    if (rawPortfolio && rawPortfolio.template_type === "DEVELOPER") {
      portfolioData = rawPortfolio;
    } else {
      error = "No DEVELOPER portfolio found.";
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Failed to load portfolio.";
  }

  if (error || !portfolioData) {
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

  return (
    <main className="bg-semiBlack font-montserrat max-md:mb-20">
      <TemplateThreeHero portfolioData={portfolioData} />
      <TemplateThreeAboutMe portfolioData={portfolioData} />
      <TemplateThreePortfolio portfolioData={portfolioData} />
      <TemplateThreeAvailabilty portfolioData={portfolioData} />
      <footer className="center px-10 py-20 bg-black">
        <Image src="/assets/madeByPortgig.svg" height={200} width={1000} alt="made by portgig" />
      </footer>
      <div className="text-center py-8 bg-gray-50">
        <div className="space-y-4 max-lg:mb-16">
          <p className="text-gray-600">Want to create your own professional portfolio?</p>
          <Link href="/sign-up" className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium mr-4">
            Create Your Portfolio
          </Link>
          <Link href="/" className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium">
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}
