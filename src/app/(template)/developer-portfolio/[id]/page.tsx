import Link from "next/link";
import { cookies } from "next/headers";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import type { ApiPortfolioData } from "@/types/portfolio";
import {
  TemplateThreeHero,
  TemplateThreeAboutMe,
  TemplateThreePortfolio,
  TemplateThreeAvailabilty,
} from "@/src/components/export_components";
import ShareButton from "@/src/components/ShareButton";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creatorId?: string }>;
}

export default async function Template3Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const usernameOrTemplateId = resolvedParams.id;
  const publicCreatorId = resolvedSearchParams.creatorId;

  let portfolioData: ApiPortfolioData | null = null;
  let error: string | null = null;
  let actualCreatorId: string | null = null;
  let isPublicView = false;
  let accountUsername: string | null = null;

  try {
    let responseData;

    if (publicCreatorId) {
      // Legacy support: creatorId in query param
      console.log("Template3Page: Fetching public portfolio for shared link (legacy)");
      isPublicView = true;
      actualCreatorId = publicCreatorId;
      responseData = await getPortfolioServer(publicCreatorId, false);
    } else if (usernameOrTemplateId && isNaN(Number(usernameOrTemplateId))) {
      // New: username in URL path (if not a number)
      console.log("Template3Page: Fetching public portfolio by username:", usernameOrTemplateId);
      isPublicView = true;
      responseData = await getPortfolioServer(usernameOrTemplateId, true);
      actualCreatorId = responseData?.data?.user?.data?._id || null;
    } else {
      // Logged-in user
      console.log("Template3Page: Fetching portfolio for logged-in user");
      const cookieStore = await cookies();
      const userId = cookieStore.get("userId")?.value || cookieStore.get("userid")?.value;
      if (!userId) throw new Error("No user ID found in cookies.");
      actualCreatorId = userId;
      responseData = await getPortfolioServer(userId, false);
    }

    const userData = responseData?.data?.user?.data;
    accountUsername =
      userData?.bio_data?.user_name ??
      userData?.user_name ??
      null;

    const rawPortfolio = userData?.portfolio;
    if (rawPortfolio && rawPortfolio.template_type === "DEVELOPER") {
      portfolioData = rawPortfolio;
    } else {
      error = "No DEVELOPER portfolio found or data is incomplete.";
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "An unknown error occurred.";
  }

  if (error || !portfolioData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-lg bg-white p-8 shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error
              ? isPublicView
                ? "Portfolio Not Found"
                : "Error Loading Portfolio"
              : "Portfolio Not Found"}
          </h1>
          <p className="text-gray-700 mb-4">
            {error ||
              (isPublicView
                ? "This portfolio doesn't exist or is private."
                : "Your portfolio hasn't been set up yet.")}
          </p>
          {error && isPublicView && (
            <p className="text-sm text-gray-500 mb-6">
              This portfolio may not exist, be private, or the link may be
              incorrect.
            </p>
          )}
          <Link
            href={
              isPublicView
                ? "/"
                : error
                ? "/portfolio"
                : "/edit-template/developer"
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
  return (
    <main className="bg-semiBlack font-montserrat max-md:mb-20">
      <TemplateThreeHero portfolioData={portfolioData} />
      <TemplateThreeAboutMe portfolioData={portfolioData} />
      <TemplateThreePortfolio portfolioData={portfolioData} />
      <TemplateThreeAvailabilty portfolioData={portfolioData} />
      {!isPublicView && (
        <ShareButton
          creativeId={actualCreatorId || "unknown"}
          username={accountUsername ?? undefined}
          templateType={portfolioData.template_type}
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
            <Link
              href="/sign-up"
              className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium mr-4"
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
        ) : (
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium cursor-pointer"
          >
            Go To Portfolio
          </Link>
        )}
      </div>
    </main>
  );
}
