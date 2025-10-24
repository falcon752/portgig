import ExploreCreatives from "@/src/components/creativeHome_sections/ExploreCreatives";
import {
  CreativeHeroSection,
  CreativeBanner,
  ExploreJob,
  DiscoverMore,
  DashboardSection,
  Community,
} from "@/src/components/export_components";
import React from "react";

const CreativeHomePage = () => {
  return (
    <main>
      <CreativeHeroSection />
      <CreativeBanner />
      <ExploreJob />
      <DiscoverMore />
      <ExploreCreatives />
      <DashboardSection />
      <Community />
    </main>
  );
};

export default CreativeHomePage;
