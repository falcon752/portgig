"use client";

import { JobBoardActions } from "@/src/components/export_components";

const JobDasboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bodyMargin text-textColor flex  gap-2  ">
      {" "}
      <div className=" aside flex-2 max-lg:hidden ">
        <JobBoardActions />
      </div>
      <div className="flex-10 lg:mx-5">{children}</div>
    </main>
  );
};

export default JobDasboardlayout;
