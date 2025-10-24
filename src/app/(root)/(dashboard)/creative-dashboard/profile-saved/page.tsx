"use client";
import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Buttons } from "@/src/components/export_components";
import clsx from "clsx";
export default function ProfileSaved() {
  const router = useRouter();

  const links = [
    { label: "Dashboard", path: "/creative-dashboard" },
    { label: "Edit CV/Resume", path: "/creative-dashboard/edit-cv" },
    { label: "Edit portfolio", path: "/creative-dashboard/edit-portfolio" },
    { label: "Change Password", path: "/creative-dashboard/change-password" },
  ];

  const buttonStyles =
    "bg-primary!  rounded-lg w-42 md:w-62 py-3 text-sm md:text-lg cursor-pointer";

  return (
    <main className="bodyMargin flex flex-col items-center justify-center my-20 gap-5 text-white font-raleway">
      <div className="bg-primary rounded-full w-44 h-44 lg:w-60 lg:h-60 flex justify-center items-center">
        <IoCheckmarkDone className="font-black  text-5xl lg:text-7xl" />
      </div>
      <p className="text-primary">Changes Saved</p>
      {links.map((link) => (
        <Buttons
          key={link.path}
          label={link.label}
          onClick={() => router.push(link.path)}
          className={clsx(buttonStyles)}
        />
      ))}
    </main>
  );
}
