"use client";
import Image from "next/image";
import { getImageUrl } from "@/src/utils/image-url";

interface TemplateFiveGraphicsDesignProps {
  graphicsDesign?: string[];
}

export default function TemplateFiveGraphicsDesign({ graphicsDesign }: TemplateFiveGraphicsDesignProps) {
  return (
    <section className="bg-[#f9f9f9] px-6 py-12 text-center">
      {/* Section Title */}
      <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-6">
        Graphics Design
      </h3>

      {/* Graphics Grid */}
      {graphicsDesign && graphicsDesign.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {graphicsDesign.map((imageUrl, index) => (
            <div
              key={index}
              className="bg-white border border-[#7fd3f7] rounded-lg overflow-hidden relative aspect-square flex items-center justify-center"
            >
              {imageUrl ? (
                <Image
                  src={getImageUrl(imageUrl) || imageUrl}
                  alt={`Graphic Design ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700 text-sm">
                  No Image
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg mt-6">
          No graphic design examples to display.
        </p>
      )}
    </section>
  );
}
