"use client";

import { NavigationBar, Footer } from "@/src/components/export_components";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const noNavPaths = [
    "/dashboard",
    "/dashboard/recruiter-dashboard",
    "/JobBoard",
    "/recruiter",
  ];

  const showNav = !noNavPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div className="text-white">
      {showNav && <NavigationBar />}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
