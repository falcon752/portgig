import { MadeByportgig } from "@/src/components/export_components";
import AboutMe from "@/src/components/portfolio6/AboutMe";
import HeroSection from "@/src/components/portfolio6/HeroSection";
import Jobs from "@/src/components/portfolio6/Jobs";
import LatestWork from "@/src/components/portfolio6/LatestWork";
import MoreWork from "@/src/components/portfolio6/MoreWork";
import Skills from "@/src/components/portfolio6/Skills";
import WeddingShoots from "@/src/components/portfolio6/WeddingShoots";
import React from "react";

const page = () => {
  return (
    <div className="bg-black">
      <HeroSection />
      <AboutMe />
      <Skills />
      <WeddingShoots />
      <LatestWork />
      <MoreWork />
      <Jobs />
      <MadeByportgig className="bg-semiBlack " />
    </div>
  );
};

export default page;
