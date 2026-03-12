"use client";
import Link from "next/link"
import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization"

interface TemplateFiveVideoEditingProps {
  videoEditing: string[]
  portfolioData: any
}

export default function VideoEditing({ videoEditing, portfolioData }: TemplateFiveVideoEditingProps) {
  const {  } = usePortfolioCustomizations(portfolioData)
  const colors = portfolioData?.fonts?.colors || {}

  return (
    <div 
      className="flex flex-col items-center px-4 py-10"
      style={{ 
        backgroundColor: colors.primary,
        fontFamily: portfolioData?.fonts?.body_font
      }}
    >
      <div className="w-full max-w-6xl">
        <p className="font-bold text-sm md:text-lg lg:text-3xl text-left lg:pl-3 mb-6" style={{ color: colors.accent }}>
          Video Editing
        </p>
        {videoEditing && videoEditing.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {videoEditing.map((videoUrl, index) => (
              <div
                key={index}
                className="relative h-[320px] w-[320px] rounded shadow-md flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: colors.accent }}
              >
                {videoUrl ? (
                  <Link
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full text-lg lg:text-2xl font-bold transition-opacity hover:opacity-80"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.accent
                    }}
                  >
                    View Video {index + 1}
                  </Link>
                ) : (
                  <span className="text-lg lg:text-2xl font-bold" style={{ color: colors.primary }}>
                    No Video Link
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg" style={{ color: colors.accent }}>
            No video editing examples to display.
          </p>
        )}
      </div>
    </div>
  )
}