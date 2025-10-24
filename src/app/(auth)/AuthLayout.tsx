"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  let bgImage = "/assets/auth-man-2.png";
  if (
    pathname.includes("recruiter-sign-in") ||
    pathname.includes("recruiter-sign-up")
  ) {
    bgImage = "/assets/auth-woman-2.png";
  } else if (
    pathname.includes("welcome-onboarding") ||
    pathname.includes("why-onboarding")
  ) {
    bgImage = "/assets/onboarding-woman.png";
  } else if (pathname.includes("recruiter-onboarding")) {
    bgImage = "/assets/onboarding-man.png";
  }

  return (
    <main className="flex h-screen text-white overflow-hidden">
      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden w-full h-full relative flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${bgImage}')`,
          }}
        />

        {/* Card Container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full px-4 py-8 md:py-0">
          <div
            className="
              w-full max-w-md bg-primary/85 backdrop-blur-md rounded-3xl 
              p-4 sm:p-6 md:p-8 
              shadow-2xl border border-white/10 
              overflow-y-auto max-h-[calc(100vh-4rem)]
              mb-16 md:mb-0
            "
          >
            {children}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left Image with Logo Overlay */}
        <div className="w-1/2 h-full relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${bgImage}')`,
            }}
          />
          <div className="relative z-10 p-8">
            <Link href="/">
              <Image
                src="/assets/portgig-2.svg"
                alt="Portgig Logo"
                width={150}
                height={150}
                className="w-[150px] h-[150px]"
              />
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-1/2 h-full overflow-y-auto bg-primary px-4 sm:px-6 md:px-10 py-10">
          {children}
        </div>
      </div>
    </main>
  );
};
