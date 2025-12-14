"use client";
import Image from "next/image";
import type { TemplateOneHeroProps } from "@/types/template-one";
import { ApiPortfolioData, EMPTY_PORTFOLIO } from "@/types/portfolio";

export const TemplateOneHero = ({ portfolio }: TemplateOneHeroProps) => {
  const portfolioData: ApiPortfolioData = portfolio || EMPTY_PORTFOLIO;

  const name = portfolioData?.display_name || "Gracier Aftang";
  const headShotUrl = portfolioData?.head_shot || "/placeholder.svg?height=500&width=500";
  const tagline =
    portfolioData?.about_me ||
    "Creative Graphic & UI/UX Designer Crafting Engaging Digital Experiences";

  // Optional: join first two job titles for small headline
  const jobTitles = portfolioData?.job_titles?.join(" / ") || "Graphics / UI UX Designer";

  const responsivePadding = "px-4 sm:px-6 md:px-8 lg:px-10";

  return (
    <>
      {/* MOBILE – image on top, text below */}
      <section className={`lg:hidden bg-black ${responsivePadding} pt-6 pb-14`}>
        {/* Image */}
        <div className="w-full h-[300px] rounded-2xl overflow-hidden mb-6">
          <Image
            src={headShotUrl}
            alt={name}
            width={640}
            height={420}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-3xl font-bold">{name}</h1>
          <p className="text-purple-500 text-base leading-relaxed">
            {jobTitles}
            <span className="sm:block lg:inline"> {tagline}</span>
          </p>
        </div>
      </section>

      {/* DESKTOP – image + text side by side */}
      <section className="hidden lg:flex bg-black items-start pt-8 pb-20 px-[55px]">
        <div className="flex gap-24">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-[640px] h-[420px] rounded-2xl overflow-hidden">
              <Image
                src={headShotUrl}
                alt={name}
                width={640}
                height={420}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-3 mt-[150px]">
            <h1 className="text-white text-4xl font-bold">{name}</h1>
            <p className="text-purple-500 text-lg max-w-md leading-relaxed">
              {jobTitles}
              <br />
              {tagline}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TemplateOneHero;
