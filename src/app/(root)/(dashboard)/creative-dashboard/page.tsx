import React from "react";
import {
  CreativeDashboardHero,
  ProfileAnalytics,
  JobApplied,
  CreativeCommunity,
} from "@/src/components/export_components";
const CreativeDashboard = () => {
  return (
    <main>
      <CreativeDashboardHero />
      <ProfileAnalytics />
      <JobApplied />
      <CreativeCommunity />
    </main>
  );
};

export default CreativeDashboard;
