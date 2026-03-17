"use client";
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";
import React from "react";

interface TemplateTwoEventProps {
  portfolioData: any;
  types?: string[];
}

const TemplateTwoEvent = ({ portfolioData, types = [] }: TemplateTwoEventProps) => {
  const {colorUtils, customStyles, getHeadingStyle, getBodyStyle, customBackgroundColor } = usePortfolioCustomizations(portfolioData);
  
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <section className="bg-brownLight py-10 px-10 center" style={customBackgroundColor ? {backgroundColor: colorUtils.darken(customBackgroundColor)} : undefined}>
      <div className="grid grid-cols-2 gap-x-10 gap-5 w-10/12 mx-auto">
        {types.map((type, index) => (
          <div key={index} className="flex flex-col gap-2 text-white" style={getBodyStyle()}>
            <h2 className="pl-5 font-bold lg:text-2xl text-white" style={getHeadingStyle()}>
              {type}
            </h2>
            <hr className="w-62 h-0.5" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemplateTwoEvent;