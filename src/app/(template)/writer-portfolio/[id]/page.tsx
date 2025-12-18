import Image from "next/image";
import Link from "next/link";
import { getPortfolioServer } from "@/src/lib/portfolio-server";
import {
    TemplateFourHero,
    TemplateFourAboutMe,
    TemplateFourPortfolio,
} from "@/src/components/export_components";
import type {
    ApiPortfolioData,
    GetPortfolioResponse,
    WriterTemplateSpecific,
} from "@/types/portfolio";
import ShareButton from "@/src/components/ShareButton";
import { cookies } from "next/headers";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ creatorId?: string }>;
}

export default async function Template4Page({
    params,
    searchParams,
}: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const templateId = resolvedParams.id;
    const publicCreatorId = resolvedSearchParams.creatorId;

    console.log("Template4Page: Template ID from URL:", templateId);
    console.log("Template4Page: Public creator ID from query:", publicCreatorId);

    let portfolio: ApiPortfolioData | null = null;
    let error: string | null = null;
    let actualCreatorId: string | null = null;
    let isPublicView = false;

    try {
        let responseData: GetPortfolioResponse;

        if (publicCreatorId) {
            console.log("Template4Page: Fetching public portfolio for shared link");
            isPublicView = true;
            actualCreatorId = publicCreatorId;
            responseData = await getPortfolioServer(publicCreatorId);
        } else {
            console.log("Template4Page: Fetching portfolio for logged-in user");
            const cookieStore = await cookies();
            const userId = cookieStore.get("userId")?.value;

            if (!userId) {
                throw new Error(
                    "No user ID found in cookies. User may not be logged in."
                );
            }

            console.log("Template4Page: Found userId in cookies:", userId);
            actualCreatorId = userId;
            responseData = await getPortfolioServer(userId);
        }

        console.log(
            "Template4Page: Data received:",
            JSON.stringify(responseData, null, 2)
        );

        const portfolioData = responseData?.data?.user?.data?.portfolio;
        console.log(
            "Template4Page: Portfolio data:",
            JSON.stringify(portfolioData, null, 2)
        );

        if (portfolioData && portfolioData.template_type === "WRITER") {
            portfolio = portfolioData;
            console.log("Template4Page: WRITER portfolio found and assigned");
        } else {
            error = "No WRITER portfolio found or data is incomplete.";
            console.log("Template4Page: " + error);
        }
    } catch (err: unknown) {
        console.error("Template4Page: Failed to fetch portfolio:", err);
        if (err instanceof Error) {
            error = err.message || "Failed to load portfolio data.";
        } else {
            error = "An unknown error occurred while loading portfolio data.";
        }
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
                <div className="rounded-lg bg-white p-8 shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        {isPublicView ? "Portfolio Not Found" : "Error Loading Portfolio"}
                    </h1>
                    <p className="text-gray-700 mb-4">{error}</p>
                    {isPublicView ? (
                        <p className="text-sm text-gray-500 mb-6">
                            This portfolio may not exist, be private, or the link may be
                            incorrect.
                        </p>
                    ) : null}
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

    if (!portfolio) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
                <div className="rounded-lg bg-white p-8 shadow-md text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Portfolio Not Found
                    </h1>
                    <p className="text-gray-700 mb-6">
                        {isPublicView
                            ? "This portfolio doesn't seem to exist or may be private."
                            : "It looks like your portfolio hasn't been set up yet."}
                    </p>
                    <Link
                        href={isPublicView ? "/" : "/edit-template/writer"}
                        className="inline-block px-6 py-3 bg-[#0A1754] text-white rounded-lg font-medium"
                    >
                        {isPublicView ? "Go to Homepage" : "Go to Edit Form"}
                    </Link>
                </div>
            </main>
        );
    }

    const writerSpecificPortfolio =
        portfolio.template_type === "WRITER" ? portfolio : null;
    const writerSpecific = writerSpecificPortfolio?.template_specific as
        | WriterTemplateSpecific
        | undefined;

    return (
        <main className="font-montserrat max-md:mb-20">
            <TemplateFourHero
                displayName={portfolio.display_name}
                jobTitles={portfolio.job_titles}
                location={portfolio.location}
                headShot={portfolio.head_shot}
                portfolioData={portfolio}
            />
            <TemplateFourAboutMe
                aboutMe={portfolio.about_me}
                services={portfolio.other_services}
                portfolioData={portfolio}
            />
            <TemplateFourPortfolio
                portfolioItems={(portfolio.files || []).map((file) => ({
                    image: file.image ?? "",
                    title: file.title ?? "",
                    link: file.link ?? "",
                }))}
                caseStudyContent={writerSpecific?.writer?.case_study || ""}
                linkedinLink={portfolio.social?.linkedin as string | undefined}
                mediumLink={portfolio.social?.medium as string | undefined}
                portfolioData={portfolio}
                whyWorkWithMe={portfolio.what_you_get_working_with_me}
                // services={portfolio.other_services}
            />
            {/* {!isPublicView && (
                <ShareButton
                    creativeId={actualCreatorId || "unknown"}
                    displayName={portfolio.display_name}
                />
            )} */}
            <footer className="center px-10 py-20 bg-[#faf7f3]">
                <Image
                    src="/assets/madeByPortgig2.svg"
                    height={200}
                    width={1000}
                    alt="made by portgig"
                />
            </footer>
            {/* <div className="text-center py-8 bg-gray-50">
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
            </div> */}
        </main>
    );
}
