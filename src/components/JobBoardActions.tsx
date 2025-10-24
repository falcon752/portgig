"use client";
import Link from "next/link";
import React from "react";

import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const JobBoardActions = () => {
  const navigate = useRouter();
  const pathname = usePathname();

  const DashboardHeadings = [
    { label: "Profile & Account", link: "", items: [] },
    {
      label: "Job Posting",
      link: "",
      //dynamic route needed here
      items: [
        { itemLabel: "Graphic Design", path: "" },
        { itemLabel: "Social Media Manager", path: "" },
        { itemLabel: "Video Editor", path: "" },
      ],
    },
    {
      label: "Job Posted",
      link: "",
      items: [
        { itemLabel: "Create new job", path: "/post-new-job" },
        { itemLabel: "Active jobs", path: "/active-jobs" },
      ],
    },
    {
      label: "Applicants",
      link: "",
      items: [
        { itemLabel: "Shortlisted candidates", path: "/shortlisted-candidate" }
      ],
    },
    {
      label: "Analytic & Merics",
      link: "",
      items: [
        { itemLabel: "New Applicants", path: "/new-applicant" },
        { itemLabel: "Job Performance", path: "/job-performance" },
      ],
    },
    { label: "Message", link: "", items: [] },
    { label: "Help & Support", link: "", items: [] },
  ];

  return (
    <main className=" relative h-full px-2">
      <aside
        className={` pt-30
          bg-primary text-white p-4  transition-transform duration-300
          transform flex flex-col gap-6 h-full
        `}>
        {DashboardHeadings.map((heading, index) => (
          <div key={index} className="">
            <Link href={heading.link}>
              <h2 className="text-center font-bold text-sm ">
                {heading.label}
              </h2>
            </Link>
            <hr className="border-t border-white mx-3 mb-2" />
            <ul className="flex flex-col gap-2 items-center">
              {heading.items.map((item, index) => (
                <li key={index} className="text-center">
                  <p
                    className={clsx(
                      "text-white  text-[10px] rounded-none! cursor-pointer",
                      pathname === item.path && "bg-secondary! px-2 py-1"
                    )}
                    onClick={() => {
                      navigate.push(item.path);
                      //   setShowSidebar(false);
                    }}>
                    {item.itemLabel}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
    </main>
  );
};

export default JobBoardActions;
