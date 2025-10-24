"use client";

import {
  AboutSection,
  Banner,
  CommunitySection,
  HeroSection,
  HowToSection,
} from "@/src/components/export_components";
import BannerFirst from "@/src/components/home_sections/BannerFirst";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <BannerFirst label="Sign up/Log in"/>
      <AboutSection />
      <HowToSection />
      <Banner label="Get started" />
      <CommunitySection />
    </main>
  );
};

export default Home;
