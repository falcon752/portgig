"use client";
import { useState } from "react";
import { Buttons } from "../export_components";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/Spinner";

interface BannerPropType {
  label: string;
}

const Banner = ({ label }: BannerPropType) => {
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
      <section className="hidden md:flex justify-center my-8 px-5">
        <main
          className="
            w-full max-w-[1200px]
            bg-primary rounded-2xl
            flex items-center justify-between
            gap-2 md:gap-4 lg:gap-0
            py-6 md:py-4 lg:py-4
            px-4 md:px-6 lg:px-8
            text-white shadow
          "
        >
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5 shrink-0 whitespace-nowrap">
            <h2 className="font-semibold text-[10px] md:text-sm lg:text-base">
              Create your portfolio
            </h2>
            <Buttons
              className="bg-white text-[#0B1F66] rounded-full font-medium text-[10px] md:text-sm lg:text-sm py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2"
              onClick={() => handleRedirect("/sign-up", "portfolio")}
              label={
                loadingTarget === "portfolio" ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Spinner>Redirecting...</Spinner>
                  </div>
                ) : (
                  label
                )
              }
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 lg:gap-5 shrink-0 whitespace-nowrap">
            <h2 className="font-semibold text-[10px] md:text-sm lg:text-base">
              Hire Creatives
            </h2>
            <Buttons
              className="bg-white text-[#0B1F66] rounded-full font-medium text-[10px] md:text-sm lg:text-sm py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2"
              onClick={() => handleRedirect("/recruiter-sign-up", "recruiter")}
              label={
                loadingTarget === "recruiter" ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Spinner>Redirecting...</Spinner>
                  </div>
                ) : (
                  label
                )
              }
            />
          </div>
        </main>
      </section>
    </>
  );
};

export default Banner;
