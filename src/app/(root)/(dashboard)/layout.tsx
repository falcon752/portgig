"use client";
import DashboardLayout from "@/src/components/Dashboard-layout";
import { usePathname } from "next/navigation";
import type React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  const routesWithoutLayout = [
      "/recruiter-dashboard/recruiter-edit-profile", 
      "/creative-dashboard",
      "/dashboard",
    // "/dashboard/custom-sidebar-page", 
  ];

  const shouldHideLayout = routesWithoutLayout.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default Layout;