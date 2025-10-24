"use client";
import { useState } from "react";
import { Buttons } from "../export_components";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/Spinner";

interface BannerPropType {
  label: string;
}

const BannerFirst = ({}: BannerPropType) => {
  const navigate = useRouter();
  const [loadingTarget, setLoadingTarget] = useState<
    "portfolio" | "recruiter" | null
  >(null);

  const handleRedirect = (path: string, type: "portfolio" | "recruiter") => {
    setLoadingTarget(type);
    setTimeout(() => {
      navigate.push(path);
    }, 1000);
  };

  return (
    //   mobile view
    <>
      <section className="block lg:hidden my-8 px-3 sm:px-4 md:px-0">
        <div className="px-2 sm:px-3 py-3 bg-primary rounded-3xl flex items-center justify-evenly gap-3 sm:gap-4 shadow">
          {/* Create Portfolio */}
          <div className="flex items-center gap-4 shrink-0">
            <h2 className="text-white font-semibold text-[10px] whitespace-nowrap">
              Create portfolio
            </h2>
            <Buttons
              className="bg-white text-[#0B1F66] rounded-full font-medium text-[10px] px-2 py-1! sm:px-3 sm:py-1"
              onClick={() => handleRedirect("/sign-up", "portfolio")}
              label={
                loadingTarget === "portfolio" ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Spinner>Redirecting...</Spinner>
                  </div>
                ) : (
                  "Sign up"
                )
              }
            />
          </div>

          {/* Hire Creatives */}
          <div className="flex items-center gap-4 shrink-0">
            <h2 className="text-white font-semibold text-[10px] whitespace-nowrap">
              Hire Creatives
            </h2>
            <Buttons
              className="bg-white text-[#0B1F66] rounded-full font-medium text-[10px] px-2 py-1! sm:px-3 sm:py-1"
              onClick={() => handleRedirect("/recruiter-sign-up", "recruiter")}
              label={
                loadingTarget === "recruiter" ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Spinner>Redirecting...</Spinner>
                  </div>
                ) : (
                  "Sign up"
                )
              }
            />
          </div>
        </div>
      </section>

      {/* deskstop view */}
      <section className="hidden lg:block bodyMargin my-8 px-5">
        <div className="px-4 md:px-8 py-6 md:py-4 bg-primary rounded-2xl md:rounded-4xl flex items-center justify-between gap-2 md:gap-0 shadow">
          {/* Create Portfolio */}
          <div className="flex items-center gap-5 shrink-0 whitespace-nowrap">
            <h2 className="text-white font-semibold text-[10px] sm:text-sm md:text-base">
              Create your portfolio
            </h2>
            <Buttons
              className="bg-white text-[#0B1F66] rounded-full font-medium text-[10px] sm:text-sm py-1 sm:px-4 sm:py-2"
              onClick={() => handleRedirect("/sign-up", "portfolio")}
              label={
                loadingTarget === "portfolio" ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Spinner>Redirecting...</Spinner>
                  </div>
                ) : (
                  "Sign up / Log in"
                )
              }
            />
          </div>

          {/* Hire Creatives */}
          <div className="flex items-center gap-5 shrink-0 whitespace-nowrap">
            <h2 className="text-white font-semibold text-[10px] sm:text-sm md:text-base">
              Hire Creatives
            </h2>
            <Buttons
              className="bg-white text-[#0B1F66] rounded-full font-medium text-[10px] sm:text-sm py-1 sm:px-4 sm:py-2"
              onClick={() => handleRedirect("/recruiter-sign-up", "recruiter")}
              label={
                loadingTarget === "recruiter" ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Spinner>Redirecting...</Spinner>
                  </div>
                ) : (
                  "Sign up / Log in"
                )
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default BannerFirst;