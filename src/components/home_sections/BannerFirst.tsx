"use client";
import { useState } from "react";
import { Buttons } from "../export_components";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/Spinner";

interface BannerPropType {
  label?: string;
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
    <>
      {/* MOBILE VIEW */}
      <section className="block lg:hidden w-full my-8">
        <div
          className="
            w-full max-w-[1200px] mx-auto 
            px-3 sm:px-4 
            bg-primary rounded-3xl 
            flex items-center justify-evenly 
            gap-3 sm:gap-4 
            py-3 
            shadow
          "
        >
          {/* Create Portfolio */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 whitespace-nowrap">
            <h2 className="text-white font-semibold text-[10px] sm:text-xs">
              Create portfolio
            </h2>
            <Buttons
              className="
                bg-white text-[#0B1F66] rounded-full font-medium 
                text-[10px] sm:text-xs 
                px-2 sm:px-3 py-1
              "
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
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 whitespace-nowrap">
            <h2 className="text-white font-semibold text-[10px] sm:text-xs">
              Hire Creatives
            </h2>
            <Buttons
              className="
                bg-white text-[#0B1F66] rounded-full font-medium 
                text-[10px] sm:text-xs 
                px-2 sm:px-3 py-1
              "
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

      {/* DESKTOP VIEW */}
      <section className="hidden lg:block w-full my-8">
        <div
          className="
            w-full max-w-[1200px] mx-auto 
            px-5 
            bg-primary 
            rounded-2xl md:rounded-3xl 
            flex items-center justify-between 
            gap-4 
            py-6 md:py-5 
            shadow
          "
        >
          {/* Create Portfolio */}
          <div className="flex items-center gap-5 shrink-0 whitespace-nowrap">
            <h2 className="text-white font-semibold text-sm md:text-base">
              Create your portfolio
            </h2>
            <Buttons
              className="
                bg-white text-[#0B1F66] rounded-full font-medium 
                text-xs md:text-sm 
                py-1.5 md:py-2 px-3 md:px-5
              "
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
            <h2 className="text-white font-semibold text-sm md:text-base">
              Hire Creatives
            </h2>
            <Buttons
              className="
                bg-white text-[#0B1F66] rounded-full font-medium 
                text-xs md:text-sm 
                py-1.5 md:py-2 px-3 md:px-5
              "
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
