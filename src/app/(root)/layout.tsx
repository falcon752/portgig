"use client";

import { NavigationBar, Footer } from "@/src/components/export_components";
import React, { useEffect, useState } from "react";
import AuthStorage from "@/src/lib/requests/auth.new";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"creator" | "recruiter" | "admin" | null>(null);

  useEffect(() => {
    setIsAuthenticated(AuthStorage.isAuthenticated());
    setUserType(AuthStorage.getUserType());
  }, []);

  const guestNavItems = [
    { label: "About", link: "/about" },
    { label: "Shop", link: "/shop" },
    { label: "Blogs", link: "/blogs" },
    { label: "Academy", link: "/academy" },
  ];

  return (
    <div className="text-white">
      <NavigationBar
        isAuthenticated={isAuthenticated}
        userType={userType}
        guestNavItems={guestNavItems}
      />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
