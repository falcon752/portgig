"use client";
import React from "react";
import { Buttons } from "./export_components";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const RecruiterActions = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      label: "Profile & account",
      path: "/recruiter-dashboard/recruiter-edit-profile",
    },
    {
      label: "Change Password",
      path: "/recruiter-dashboard/recruiter-change-password",
    },
  ];

  const helpLink = {
    label: "Help & Support",
    path: "/dashboard/help",
  };

  const buttonStyles =
    "bg-white! rounded-none! mt-10 text-primary font-urbanist border border-black max-md:px-2 rounded-lg max-md:w-fit md:w-full max-md:text-[10px] sm:text-sm md:text-lg cursor-pointer";

  return (
    <aside className="w-64 bg-[#0A1754] min-h-[calc(100vh-73px)] max-md:hidden font-urbanist flex flex-col justify-between text-primary px-3 py-5">
      {/* Top Buttons */}
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Buttons
            key={link.path}
            label={link.label}
            onClick={() => router.push(link.path)}
            className={clsx(
              buttonStyles,
              pathname === link.path && "font-bold font-urbanist"
            )}
          />
        ))}
      </div>

      {/* Help & Support Text */}
      <div className="pb-4 flex flex-col items-center cursor-pointer gap-3">
        <p
          onClick={() => router.push(helpLink.path)}
          className={clsx(
            "text-white text-sm hover:underline font-inter font-semibold",
            pathname === helpLink.path && "font-bold font-inter"
          )}
        >
          {helpLink.label}
        </p>
        <p className="font-inter text-xs text-white">
          Report an issue/Contact support
        </p>
      </div>
    </aside>
  );
};

export default RecruiterActions;
